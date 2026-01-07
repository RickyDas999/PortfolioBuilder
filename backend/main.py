import time
from typing import Dict, Tuple

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_model import (
    build_features,
    compute_metrics,
    fetch_price_data,
    make_predictions,
    train_model,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TickerRequest(BaseModel):
    ticker: str
    period: str = "6mo"
    model: str = "logreg"

CACHE_TTL_SECONDS = 300
CacheKey = Tuple[str, str, str]
cache: Dict[CacheKey, Tuple[float, dict]] = {}

@app.post("/api/analyze")
def analyze_stock(req: TickerRequest):
    ticker = req.ticker.strip()
    if not ticker:
        raise HTTPException(status_code=400, detail="Ticker is required")

    model_name = req.model.lower()
    if model_name not in {"logreg", "rf"}:
        raise HTTPException(status_code=400, detail="Invalid model; choose logreg or rf")

    cache_key: CacheKey = (ticker.upper(), req.period, model_name)
    now = time.time()
    if cache_key in cache:
        ts, cached_value = cache[cache_key]
        if now - ts <= CACHE_TTL_SECONDS:
            return cached_value

    df = fetch_price_data(ticker, req.period)
    if df.empty:
        raise HTTPException(status_code=400, detail="No data for ticker")

    X, y, df_feat = build_features(df)
    if len(X) < 30:
        raise HTTPException(status_code=400, detail="Not enough data to train")

    split_idx = int(len(X) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

    model = train_model(X_train, y_train, model_name=model_name)
    preds, proba = make_predictions(model, X_test)
    metrics = compute_metrics(y_test, preds)
    accuracy = metrics["accuracy"]

    response_rows = []
    for i, idx in enumerate(X_test.index):
        response_rows.append({
            "date": idx.strftime("%Y-%m-%d"),
            "close": float(df_feat.loc[idx, "Close"]),
            "pred_up": int(preds[i]),
            "prob_up": float(proba[i]),
            "actual_up": int(y_test.loc[idx]),
        })

    response = {
        "ticker": ticker.upper(),
        "period": req.period,
        "model": model_name,
        "accuracy": accuracy,
        "metrics": metrics,
        "rows": response_rows,
    }
    cache[cache_key] = (now, response)
    return response
