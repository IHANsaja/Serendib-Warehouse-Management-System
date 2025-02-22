import React from "react";
import "../../CSS/global.css";
const AITable = () => (
  <table className="w-full mt-4 table-auto rounded-2xl">
    <thead className="table-header">
      <tr>
        <th>Truck ID</th>
        <th>Truck Weight</th>
        <th>No. of Stacks</th>
        <th>Overlapping Stack Pairs</th>
        <th>Order Date</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr className="bg-[var(--table-row-one)]">
        <td>TL-2009</td>
        <td>500KG</td>
        <td>500</td>
        <td>1</td>
        <td>2025/02/09</td>
        <td>2 stacks overlapped</td>
      </tr>
      <tr className="bg-[var(--table-row-two)]">
        <td>LP-2022</td>
        <td>1T</td>
        <td>1000</td>
        <td>4</td>
        <td>2025/02/09</td>
        <td>8 stacks overlapped</td>
      </tr>
    </tbody>
  </table>
);
export default AITable;
