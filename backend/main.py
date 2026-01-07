from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_model import fetch_price_data, build_features, train_model, make_predictions

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

@app.post("/api/analyze")
def analyze_stock(req: TickerRequest):
    ticker = req.ticker.strip()
    if not ticker:
        raise HTTPException(status_code=400, detail="Ticker is required")

    model_name = req.model.lower()
    if model_name not in {"logreg", "rf"}:
        raise HTTPException(status_code=400, detail="Invalid model; choose logreg or rf")

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

    accuracy = float((preds == y_test.values).mean())

    response_rows = []
    for i, idx in enumerate(X_test.index):
        response_rows.append({
            "date": idx.strftime("%Y-%m-%d"),
            "close": float(df_feat.loc[idx, "Close"]),
            "pred_up": int(preds[i]),
            "prob_up": float(proba[i]),
            "actual_up": int(y_test.loc[idx]),
        })

    return {
        "ticker": ticker.upper(),
        "period": req.period,
        "model": model_name,
        "accuracy": accuracy,
        "rows": response_rows,
    }
