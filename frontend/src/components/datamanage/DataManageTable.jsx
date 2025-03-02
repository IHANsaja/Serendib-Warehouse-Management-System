import { useState } from "react";

const DataManageTable = () => {
  const [activeTab, setActiveTab] = useState("loading");
  const [timestamps, setTimestamps] = useState({});

  const handleArrival = (id) => {
    const currentTime = new Date().toLocaleTimeString();
    setTimestamps((prev) => ({
      ...prev,
      [id]: { arrival: currentTime, exit: "" },
    }));
  };

  const handleExit = (id) => {
    const currentTime = new Date().toLocaleTimeString();
    setTimestamps((prev) => ({
      ...prev,
      [id]: { ...prev[id], exit: currentTime },
    }));
  };

  const data = [
    { id: "P2009", quantity: "500KG", vehicle: "LP-2056", org: "JAY KAY", date: "2025/02/09" },
    { id: "P2006", quantity: "800KG", vehicle: "LP-2056", org: "MIMN", date: "2025/02/09" },
    { id: "P2011", quantity: "300KG", vehicle: "LP-2056", org: "Harischandra", date: "2025/02/09" },
  ];

  return (
    <div className="bg-[var(--table-row-two)] font-[Noto Sans Sinhala] w-full flex flex-col items-center">
      <div className="w-full flex justify-center h-full">
        <button
          className={`w-1/2 py-3 text-lg font-semibold text-center cursor-pointer ${
            activeTab === "loading" ? "bg-[var(--main-red)] text-[var(--theme-white)]" : "bg-[var(--table-row-two)] text-[var(--darkest-red)]"
          }`}
          onClick={() => setActiveTab("loading")}
        >
          Loading
        </button>
        <button
          className={`w-1/2 py-3 text-lg font-semibold text-center cursor-pointer ${
            activeTab === "unloading" ? "bg-[var(--main-red)] text-[var(--theme-white)]" : "bg-[var(--table-row-two)] text-[var(--darkest-red)]"
          }`}
          onClick={() => setActiveTab("unloading")}
        >
          Unloading
        </button>
      </div>

      <h2 className="text-left text-[var(--darkest-red)] m-5 mt-8 text-2xl font-bold">{activeTab === "loading" ? "පැටවුම්වලට අදාළ විස්තර" : "බැවුම්වලට අදාළ විස්තර"}</h2>

      <table className="w-full mt-6 text-center">
        <thead>
          <tr className="table-header bg-[var(--main-red)] text-[var(--theme-white)]">
            <th className="p-3">Product ID</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Vehicle Number</th>
            <th className="p-3">Organization</th>
            <th className="p-3">Order Date</th>
            <th className="p-3">✔ Arrival</th>
            <th className="p-3">Arrival Time</th>
            <th className="p-3">✔ Exit</th>
            <th className="p-3">Exit Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? "bg-[var(--table-row-two)]" : "bg-[var(--table-row-one)]"}>
              <td className="p-3">{item.id}</td>
              <td className="p-3">{item.quantity}</td>
              <td className="p-3">{item.vehicle}</td>
              <td className="p-3">{item.org}</td>
              <td className="p-3">{item.date}</td>
              <td className="p-3">
                <input type="checkbox" className="accent-[var(--main-red)] cursor-pointer" onChange={() => handleArrival(item.id)} checked={!!timestamps[item.id]?.arrival} />
              </td>
              <td className="p-3">{timestamps[item.id]?.arrival || "-"}</td>
              <td className="p-3">
                {timestamps[item.id]?.arrival && (
                  <input type="checkbox" className="accent-[var(--main-red)] cursor-pointer" onChange={() => handleExit(item.id)} checked={!!timestamps[item.id]?.exit} />
                )}
              </td>
              <td className="p-3">{timestamps[item.id]?.exit || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataManageTable;