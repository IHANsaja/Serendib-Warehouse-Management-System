import React from "react";
import "../../CSS/global.css";

const AITable = () => (
  <table className="w-full mt-4 text-center table-auto rounded-2xl AIdata-table">
    <thead className="table-header">
      <tr>
        <th className="text-sm md:text-base lg:text-lg">Truck ID</th>
        <th className="text-sm md:text-base lg:text-lg">Truck Weight</th>
        <th className="text-sm md:text-base lg:text-lg">No. of Sacks</th>
        <th className="text-sm md:text-base lg:text-lg">Overlapping Sack Pairs</th>
        <th className="text-sm md:text-base lg:text-lg">Order Date</th>
        <th className="text-sm md:text-base lg:text-lg">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr className="bg-[var(--table-row-one)]">
        <td className="text-sm md:text-base lg:text-lg">TL-2009</td>
        <td className="text-sm md:text-base lg:text-lg">500KG</td>
        <td className="text-sm md:text-base lg:text-lg">500</td>
        <td className="text-sm md:text-base lg:text-lg">1</td>
        <td className="text-sm md:text-base lg:text-lg">2025/02/09</td>
        <td className="text-sm md:text-base lg:text-lg">2 stacks overlapped</td>
      </tr>
      <tr className="bg-[var(--table-row-two)]">
        <td className="text-sm md:text-base lg:text-lg">LP-2022</td>
        <td className="text-sm md:text-base lg:text-lg">1T</td>
        <td className="text-sm md:text-base lg:text-lg">1000</td>
        <td className="text-sm md:text-base lg:text-lg">4</td>
        <td className="text-sm md:text-base lg:text-lg">2025/02/09</td>
        <td className="text-sm md:text-base lg:text-lg">8 stacks overlapped</td>
      </tr>
    </tbody>
  </table>
);

export default AITable;