const AITable = () => (
  <table className="w-full mt-4 text-center table-auto rounded-2xl AIdata-table">
    <thead className="table-header">
      <tr>
        <th className="text-sm md:text-base lg:text-lg p-2">Truck ID</th>
        <th className="text-sm md:text-base lg:text-lg p-2">Truck Weight</th>
        <th className="text-sm md:text-base lg:text-lg p-2">No. of Sacks</th>
        <th className="text-sm md:text-base lg:text-lg p-2">Overlapping Sack Pairs</th>
        <th className="text-sm md:text-base lg:text-lg p-2">Order Date</th>
        <th className="text-sm md:text-base lg:text-lg p-2">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr className="bg-[var(--table-row-one)]">
        <td className="text-sm md:text-base lg:text-lg p-2">TL-2009</td>
        <td className="text-sm md:text-base lg:text-lg p-2">500KG</td>
        <td className="text-sm md:text-base lg:text-lg p-2">500</td>
        <td className="text-sm md:text-base lg:text-lg p-2">1</td>
        <td className="text-sm md:text-base lg:text-lg p-2">2025/02/09</td>
        <td className="text-sm md:text-base lg:text-lg p-2">2 stacks overlapped</td>
      </tr>
      <tr className="bg-[var(--table-row-two)]">
        <td className="text-sm md:text-base lg:text-lg p-2">LP-2022</td>
        <td className="text-sm md:text-base lg:text-lg p-2">1T</td>
        <td className="text-sm md:text-base lg:text-lg p-2">1000</td>
        <td className="text-sm md:text-base lg:text-lg p-2">4</td>
        <td className="text-sm md:text-base lg:text-lg p-2">2025/02/09</td>
        <td className="text-sm md:text-base lg:text-lg p-2">8 stacks overlapped</td>
      </tr>
    </tbody>
  </table>
);

export default AITable;