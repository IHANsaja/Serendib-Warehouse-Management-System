
from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
import joblib, json
from pathlib import Path
from typing import List

MODEL_DIR = Path("./artifacts")
MODEL_PATH = MODEL_DIR / "income_predictor.h5"
SCALER_PATH = MODEL_DIR / "scaler.pkl"
META_PATH = MODEL_DIR / "meta.json"

def load_assets():
    model = tf.keras.models.load_model(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    meta = json.loads(META_PATH.read_text())
    return model, scaler, meta["seq_len"]

model, scaler, SEQ_LEN = load_assets()
app = FastAPI(title="Income Predictor")

class PredictBody(BaseModel):
    incomes: List[float]
    n_steps: int = 1

def _predict_next(seq_scaled):
    pred_scaled = model.predict(np.array([seq_scaled]), verbose=0)
    return scaler.inverse_transform(pred_scaled)[0][0]

@app.post("/predict")
def predict(body: PredictBody):
    incomes = np.array(body.incomes, dtype=float).reshape(-1, 1)
    if len(incomes) < SEQ_LEN:
        return {"error": f"Need at least {SEQ_LEN} incomes; got {len(incomes)}."}

    scaled = scaler.transform(incomes)
    window = scaled[-SEQ_LEN:].copy()
    preds = []

    for _ in range(body.n_steps):
        y_hat = _predict_next(window)
        preds.append(float(y_hat))
        y_hat_scaled = scaler.transform(np.array([[y_hat]]))
        window = np.vstack([window[1:], y_hat_scaled])

    return {"predictions": preds}


