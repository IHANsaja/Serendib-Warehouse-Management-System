import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "sonner";

const fmtLKR = (x) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(x);

export default function IncomePredictor() {
  const [incomes, setIncomes] = useState("");
  const [nSteps, setNSteps] = useState(1);
  const [preds, setPreds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formMonth, setFormMonth] = useState("");
  const [formIncome, setFormIncome] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchIncomes = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/incomes");
      // Expecting array of { IncomeID, Month, Income }
      const ordered = [...data].sort((a, b) => String(a.Month).localeCompare(String(b.Month)));
      const values = ordered.map((r) => Number(r.Income)).filter((v) => Number.isFinite(v));
      setIncomes(values.join(","));
    } catch (err) {
      console.error("Failed to load incomes:", err.message);
      toast.error("Failed to load incomes");
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const addIncome = async (e) => {
    e.preventDefault();
    if (!/^\d{4}-\d{2}$/.test(formMonth)) {
      toast.error("Month must be in YYYY-MM format");
      return;
    }
    const incomeNum = Number(formIncome);
    if (!Number.isFinite(incomeNum) || incomeNum <= 0) {
      toast.error("Income must be a positive number");
      return;
    }
    try {
      setSaving(true);
      await axios.post("http://localhost:5000/api/incomes", {
        month: formMonth,
        income: incomeNum,
      });
      setFormMonth("");
      setFormIncome("");
      await fetchIncomes();
    } catch (err) {
      console.error("Failed to add income:", err.message);
      toast.error("Failed to add income because of: " + err.message.split(":")[1].trim() + "");
    } finally {
      setSaving(false);
    }
  };

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
      toast.error("Prediction failed because of: " + err.message.split(":")[1].trim() + "");
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

        {/* Add Income Form */}
        <div className="border-t border-[var(--main-red)] pt-4">
          <h2 className="text-xl font-bold mb-3 text-[var(--main-red)]">Add Month Income</h2>
          <form onSubmit={addIncome} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-sm font-semibold mb-1">Month (YYYY-MM)</label>
              <input
                type="month"
                className="w-full rounded-lg border border-[var(--main-red)] bg-[var(--table-row-two)] text-[var(--darkest-red)] p-2"
                value={formMonth}
                onChange={(e) => setFormMonth(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Income (LKR)</label>
              <input
                type="number"
                className="w-full rounded-lg border border-[var(--main-red)] bg-[var(--table-row-two)] text-[var(--darkest-red)] p-2"
                value={formIncome}
                onChange={(e) => setFormIncome(e.target.value)}
                min={0}
                step="0.01"
              />
            </div>
            <button
              type="submit"
              className="btn-primary py-2 px-4"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Add Income'}
            </button>
          </form>
          <p className="mt-2 text-xs text-[var(--darkest-red)] opacity-70">After adding, the past incomes above will refresh automatically.</p>
        </div>

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
