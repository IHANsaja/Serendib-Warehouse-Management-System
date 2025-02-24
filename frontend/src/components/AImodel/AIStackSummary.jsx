import React from "react";
import "../../CSS/global.css";

const AIStackSummary = () => (
  <div>
    <div className="card-summary text-[color:var(--darkest-red)]">
      <ul className="space-y-4">
        <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
          <span className="font-medium text-sm md:text-base lg:text-lg">Total Sacks in the Truck</span>
          <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">500</span>
        </li>
        <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
          <span className="font-medium text-sm md:text-base lg:text-lg">Sacks Without Errors</span>
          <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">498</span>
        </li>
        <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
          <span className="font-medium text-sm md:text-base lg:text-lg">Overlapping Sack Pairs</span>
          <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">1</span>
        </li>
        <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
          <span className="font-medium text-sm md:text-base lg:text-lg">Positions of Overlapping Sack Pairs</span>
          <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">20, 21</span>
        </li>
        <li className="flex justify-between items-center rounded-lg pr-3 pl-3">
          <span className="font-medium text-sm md:text-base lg:text-lg">Count got by AI model</span>
          <span className="summary-span rounded-lg w-20 h-10 text-sm md:text-base lg:text-lg">500</span>
        </li>
      </ul>
    </div>
    <div className="flex justify-end items-center mt-4">
      <button className="btn-primary cursor-pointer">Verify Count</button>
    </div>
  </div>
  
);

export default AIStackSummary;