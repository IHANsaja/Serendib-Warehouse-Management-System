import React from "react";
import "../../CSS/global.css";
const AIStackSummary = () => (
  <div className="card-primary space-y-4">
    <h2 className="text-lg font-semibold">Stack Count</h2>
    <progress className="w-full" value="300" max="500"></progress>
    <ul className="space-y-2">
      <li>Total Stacks: 500</li>
      <li>Stacks Without Errors: 498</li>
      <li>Overlapping Stack Pairs: 1</li>
      <li>Positions: 20, 21</li>
      <li>Count by AI Model: 500</li>
    </ul>
  </div>
);
export default AIStackSummary;