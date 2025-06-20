import { useState, useEffect } from "react";

const DataManageTable = ({ role, type }) => {
  const [data, setData] = useState([]);
  const [timestamps, setTimestamps] = useState({});
  const [baySelections, setBaySelections] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/api/order?type=${type}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setTimestamps({});
        setBaySelections({});
      })
      .catch(console.error);
  }, [type]);

  const isSecurity = role === "Security Officer";
  const isExecutive = role === "Executive Officer";

  const formatTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const setTime = (id, field) =>
    setTimestamps((prev) => {
      const curr = prev[id] || {};
      const now = formatTime();
      if (field === "arrival") {
        return { ...prev, [id]: { ...curr, arrival: now, exit: "" } };
      }
      if (field === "bayIn") {
        return { ...prev, [id]: { ...curr, bayIn: now, bayOut: "" } };
      }
      return { ...prev, [id]: { ...curr, [field]: now } };
    });

  const handleBaySelect = (id, val) =>
    setBaySelections((prev) => ({ ...prev, [id]: val }));

  return (
    <div className="w-full overflow-x-auto bg-white p-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-[#6C1509] mb-4">
          {type === "loading"
            ? "පැටවුම්වලට අදාළ විස්තර"
            : "බැවුම්වලට අදාළ විස්තර"}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-center border-collapse">
            <thead className="sticky top-0 bg-[#A43424] text-white">
              <tr>
                <th className="p-2">Product ID</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Vehicle Number</th>
                <th className="p-2">Organization</th>
                <th className="p-2">Order Date</th>
                {isSecurity && (
                  <>
                    <th className="p-2">✔ Arrival</th>
                    <th className="p-2">Arrival Time</th>
                    <th className="p-2">✔ Exit</th>
                    <th className="p-2">Exit Time</th>
                  </>
                )}
                {isExecutive && (
                  <>
                    <th className="p-2">Bay Number</th>
                    <th className="p-2">✔ Bay-In</th>
                    <th className="p-2">Bay-In Time</th>
                    <th className="p-2">✔ Bay-Out</th>
                    <th className="p-2">Bay-Out Time</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                const ts = timestamps[item.ItemCode] || {};
                const bg = i % 2 ? "bg-gray-50" : "bg-white";
                return (
                  <tr key={item.ItemCode} className={bg}>
                    <td className="p-2">{item.ItemCode}</td>
                    <td className="p-2">{item.QtyOrdered}</td>
                    <td className="p-2">{item.VehicleNo}</td>
                    <td className="p-2">{item.CustomerName}</td>
                    <td className="p-2">
                      {new Date(item.Date).toISOString().slice(0, 10)}
                    </td>
                    {isSecurity && (
                      <>
                        <td className="p-2">
                          <input
                            type="checkbox"
                            onChange={() => setTime(item.ItemCode, "arrival")}
                            checked={!!ts.arrival}
                          />
                        </td>
                        <td className="p-2">{ts.arrival || "-"}</td>
                        <td className="p-2">
                          {ts.arrival && (
                            <input
                              type="checkbox"
                              onChange={() => setTime(item.ItemCode, "exit")}
                              checked={!!ts.exit}
                            />
                          )}
                        </td>
                        <td className="p-2">{ts.exit || "-"}</td>
                      </>
                    )}
                    {isExecutive && (
                      <>
                        <td className="p-2">
                          <select
                            value={baySelections[item.ItemCode] || "Bay 01"}
                            onChange={(e) =>
                              handleBaySelect(item.ItemCode, e.target.value)
                            }
                          >
                            <option>Bay 01</option>
                            <option>Bay 02</option>
                            <option>Bay 03</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <input
                            type="checkbox"
                            onChange={() => setTime(item.ItemCode, "bayIn")}
                            checked={!!ts.bayIn}
                          />
                        </td>
                        <td className="p-2">{ts.bayIn || "-"}</td>
                        <td className="p-2">
                          {ts.bayIn && (
                            <input
                              type="checkbox"
                              onChange={() =>
                                setTime(item.ItemCode, "bayOut")
                              }
                              checked={!!ts.bayOut}
                            />
                          )}
                        </td>
                        <td className="p-2">{ts.bayOut || "-"}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataManageTable;
