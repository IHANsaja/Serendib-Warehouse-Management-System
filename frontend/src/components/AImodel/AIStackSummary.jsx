import React from "react";
import "../../CSS/global.css";

const AIStackSummary = () => (
  <div className="card-primary p-6 space-y-6 text-[color:var(--darkest-red)] rounded-2xl shadow-md">
    <ul className="space-y-4">
      <li className="flex justify-between items-center rounded-lg p-3">
        <span className="font-medium">Total Stacks in the Truck</span>
        <span className="summary-span rounded-lg px-4 py-2">500</span>
      </li>
      <li className="flex justify-between items-center rounded-lg p-3">
        <span className="font-medium">Stacks Without Errors</span>
        <span className="summary-span rounded-lg px-4 py-2">498</span>
      </li>
      <li className="flex justify-between items-center rounded-lg p-3">
        <span className="font-medium">Overlapping Stack Pairs</span>
        <span className="summary-span rounded-lg px-4 py-2">1</span>
      </li>
      <li className="flex justify-between items-center rounded-lg p-3">
        <span className="font-medium">Positions of Overlapping Stack Pairs</span>
        <span className="summary-span rounded-lg px-4 py-2">20, 21</span>
      </li>
      <li className="flex justify-between items-center rounded-lg p-3">
        <span className="font-medium">Count got by AI model</span>
        <span className="summary-span rounded-lg px-4 py-2">500</span>
      </li>
    </ul>
  </div>
);

export default AIStackSummary;