import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const fmtLKR = (x) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(x);

const ProcessStatus = ({ predictions = [] }) => {
  // Prepare chart data from predictions
  const chartData = predictions.map((income, index) => ({
    month: `Month ${index + 1}`,
    income: income,
  }));

  // Format tooltip to show currency
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="label">{`${label}`}</p>
          <p className="intro text-[var(--main-red)] font-semibold">
            {fmtLKR(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="grid grid-cols-1 gap-6">
      <div className="bg-[var(--theme-white)] text-[var(--darkest-red)] p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-center mb-4">
          Income Predictions
        </h3>
        
        {predictions.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => fmtLKR(value)}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--main-red)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
                name="Predicted Income"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-center">
              No predictions available. <br />
              Generate income predictions using the Income Predictor tool.
            </p>
          </div>
        )}
        
        {/* Display predictions in list format as well */}
        {predictions.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3 text-center">Predicted Income by Month</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chartData.map((data, index) => (
                <div key={index} className="bg-[var(--table-row-two)] p-3 rounded-lg flex justify-between items-center">
                  <span className="font-medium">{data.month}:</span>
                  <span className="font-semibold text-[var(--main-red)]">
                    {fmtLKR(data.income)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProcessStatus;