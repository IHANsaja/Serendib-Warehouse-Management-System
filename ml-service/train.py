
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.callbacks import EarlyStopping
import joblib
import json
from pathlib import Path

DATA_PATH = Path("../data/income_data.csv")
MODEL_DIR = Path("./artifacts")
MODEL_DIR.mkdir(parents=True, exist_ok=True)

SEQ_LEN = 6
EPOCHS = 50
BATCH_SIZE = 16

def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data)-seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

def main():
    df = pd.read_csv(DATA_PATH)
    incomes = df["income"].astype(float).values.reshape(-1, 1)

    n = len(incomes)
    split = int(n * 0.8)
    train, val = incomes[:split], incomes[split:]

    scaler = MinMaxScaler()
    train_scaled = scaler.fit_transform(train)
    val_scaled = scaler.transform(val)

    X_train, y_train = create_sequences(train_scaled, SEQ_LEN)
    X_val, y_val = create_sequences(np.vstack([train_scaled[-SEQ_LEN:], val_scaled]), SEQ_LEN)

    model = keras.Sequential([
        keras.layers.LSTM(64, input_shape=(SEQ_LEN, 1)),
        keras.layers.Dense(1)
    ])
    model.compile(optimizer="adam", loss="mse")

    es = EarlyStopping(patience=10, restore_best_weights=True)
    model.fit(X_train, y_train, validation_data=(X_val, y_val),
              epochs=EPOCHS, batch_size=BATCH_SIZE, verbose=1, callbacks=[es])

    model.save(MODEL_DIR / "income_predictor.h5")
    joblib.dump(scaler, MODEL_DIR / "scaler.pkl")
    (MODEL_DIR / "meta.json").write_text(json.dumps({"seq_len": SEQ_LEN}))
    print("Model trained and saved.")

if __name__ == "__main__":
    main()
