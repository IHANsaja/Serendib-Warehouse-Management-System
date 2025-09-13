import { useState } from "react";
import axios from "axios";

const fmtLKR = (x) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(x);

export default function IncomePredictor() {
  const [incomes, setIncomes] = useState(
    "1000000,1050000,1100000,1150000,1200000,1250000"
  );
  const [nSteps, setNSteps] = useState(1);
  const [preds, setPreds] = useState([]);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    setLoading(true);
    try {
      const arr = incomes
        .split(",")
        .map((v) => Number(String(v).trim()))
        .filter((v) => !Number.isNaN(v));

      const { data } = await axios.post("http://localhost:5000/api/predict", {
        incomes: arr,
        n_steps: nSteps,
      });
      setPreds(data.predictions || []);
    } catch (err) {
      console.error("Prediction failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-[var(--theme-white)] text-[var(--darkest-red)]">
      <div className="max-w-2xl w-full card shadow-xl space-y-6 border border-[var(--main-red)]">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-center text-[var(--main-red)]">
          Income Predictor
        </h1>

        {/* Input Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold">
            Enter past incomes (comma-separated, in LKR)
          </label>
          <textarea
            className="w-full rounded-lg border border-[var(--main-red)] bg-[var(--table-row-two)] text-[var(--darkest-red)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--theme-yellow)] transition-all duration-300"
            rows={3}
            value={incomes}
            onChange={(e) => setIncomes(e.target.value)}
          />
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold whitespace-nowrap">
            Predict next N months:
          </label>
          <input
            type="number"
            min={1}
            max={24}
            className="border border-[var(--main-red)] rounded-lg p-2 w-28 bg-[var(--table-row-two)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--theme-yellow)] transition-all"
            value={nSteps}
            onChange={(e) => setNSteps(Number(e.target.value))}
          />
        </div>

        {/* Button */}
        <button
          onClick={predict}
          disabled={loading}
          className="btn-primary w-full py-3 text-lg font-bold tracking-wide disabled:cursor-not-allowed"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {/* Predictions */}
        {preds.length > 0 && (
          <div className="highlight space-y-2">
            <div className="font-semibold text-lg text-[var(--darkest-red)]">
              Predictions:
            </div>
            <ul className="list-disc pl-6 space-y-1 text-[var(--darkest-red)]">
              {preds.map((p, i) => (
                <li key={i} className="font-medium">
                  {fmtLKR(p)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
