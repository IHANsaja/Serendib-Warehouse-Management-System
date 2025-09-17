import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.metrics import r2_score, mean_absolute_error
import joblib
import json

# Load metadata
with open("artifacts/meta.json", "r") as f:
    meta = json.load(f)
SEQ_LEN = meta["seq_len"]

# Load scaler and model
scaler = joblib.load("artifacts/scaler.pkl")
model = load_model("artifacts/income_predictor.h5")

# Load dataset
data = pd.read_csv("data/income_data.csv")
incomes = data["income"].astype(float).values.reshape(-1, 1)

# Scale data
scaled = scaler.transform(incomes)

# Create sequences
def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

X, y = create_sequences(scaled, SEQ_LEN)

# Split same as training (80/20)
split = int(len(X) * 0.8)
X_train, y_train = X[:split], y[:split]
X_test, y_test = X[split:], y[split:]

# Evaluate
loss = model.evaluate(X_test, y_test, verbose=2)
y_pred = model.predict(X_test)

# Inverse transform predictions and labels
y_test_inv = scaler.inverse_transform(y_test)
y_pred_inv = scaler.inverse_transform(y_pred)

# Metrics
mae = mean_absolute_error(y_test_inv, y_pred_inv)
r2 = r2_score(y_test_inv, y_pred_inv)

print(f"Test Loss (MSE scaled): {loss:.6f}")
print(f"Mean Absolute Error: {mae:.2f}")
print(f"R² Score: {r2:.4f}")
print(f"Accuracy: {r2 * 100:.2f}%")
