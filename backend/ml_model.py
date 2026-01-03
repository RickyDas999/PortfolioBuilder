import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression

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

def train_model(features: pd.DataFrame, target: pd.Series):
    model = LogisticRegression()
    model.fit(features, target)
    return model

def make_predictions(model, features: pd.DataFrame):
    proba = model.predict_proba(features)[:, 1]
    preds = (proba >= 0.5).astype(int)
    return preds, proba
