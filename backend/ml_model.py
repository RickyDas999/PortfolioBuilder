import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)

def fetch_price_data(ticker: str, period: str = "6mo"):
    data = yf.download(ticker, period=period, interval="1d", auto_adjust=True)
    data = data.dropna()
    return data

def build_features(df: pd.DataFrame):
    df = df.copy()
    df["return_1d"] = df["Close"].pct_change()
    df["ma_5"] = df["Close"].rolling(5).mean()
    df["ma_10"] = df["Close"].rolling(10).mean()
    df["ma_ratio"] = df["ma_5"] / df["ma_10"]
    df["vol_5"] = df["return_1d"].rolling(5).std()
    df["target_up"] = (df["return_1d"].shift(-1) > 0).astype(int)
    df = df.dropna()
    features = df[["return_1d", "ma_ratio", "vol_5"]]
    target = df["target_up"]
    return features, target, df

def train_model(features: pd.DataFrame, target: pd.Series, model_name: str = "logreg"):
    if model_name == "rf":
        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=6,
            random_state=42,
            n_jobs=-1,
        )
    else:
        model = LogisticRegression()
    model.fit(features, target)
    return model

def make_predictions(model, features: pd.DataFrame):
    proba = model.predict_proba(features)[:, 1]
    preds = (proba >= 0.5).astype(int)
    return preds, proba

def compute_metrics(y_true: pd.Series, y_pred: np.ndarray):
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred, labels=[0, 1]).ravel()
    return {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1": float(f1_score(y_true, y_pred, zero_division=0)),
        "tp": int(tp),
        "fp": int(fp),
        "tn": int(tn),
        "fn": int(fn),
        "test_rows": int(len(y_true)),
    }
