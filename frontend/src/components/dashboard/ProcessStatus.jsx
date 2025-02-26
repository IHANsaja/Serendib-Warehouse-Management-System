import React from "react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const loadingData = {
  withinTimeLimit: 42,
  outOfTimeLimit: 8,
};

const total = loadingData.withinTimeLimit + loadingData.outOfTimeLimit;
const percentage = (
  (loadingData.withinTimeLimit / total) * 100
).toFixed(1);

const CircularChart = ({ title, percentage, data }) => (
  <div className="bg-[var(--theme-white)] text-[var(--darkest-red)] p-6 rounded-2xl shadow-lg flex flex-col items-center w-full">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="w-40 h-40">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        strokeWidth={12}
        styles={buildStyles({
          pathColor: "var(--main-red)",
          trailColor: "var(--table-row-two)",
          textColor: "var(--darkest-red)",
          textSize: "16px",
        })}
      />
    </div>
    <div className="mt-4 text-sm text-center">
      <p>Within Time Limit - {data.withinTimeLimit}</p>
      <p>Out of Time Limit - {data.outOfTimeLimit}</p>
    </div>
  </div>
);

const ProcessStatus = () => (
  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <CircularChart
      title="Loading Status"
      percentage={percentage}
      data={loadingData}
    />
    <CircularChart
      title="Unloading Status"
      percentage={percentage}
      data={loadingData}
    />
  </section>
);

export default ProcessStatus;