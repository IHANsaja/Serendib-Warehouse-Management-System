import { useState, useEffect } from "react";

const DataManageTable = ({ role }) => {
  const [activeTab, setActiveTab] = useState("loading");
  const [data, setData] = useState([]);
  const [timestamps, setTimestamps] = useState({});
  const [user, setUser] = useState(null);

  // Fetch session data
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        console.log("Session user:", data.user);
      })
      .catch((err) => console.error("Session fetch failed:", err));
  }, []);

  // Fetch orders based on tab (loading/unloading)
  useEffect(() => {
    fetch(`http://localhost:5000/api/order?type=${activeTab}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched order data:", data);
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error("Unexpected response from backend:", data);
          setData([]);
        }
        setTimestamps({});
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        setData([]);
      });
  }, [activeTab]);

  const isSecurity = role === "Security Officer";
  const isExecutive = role === "Executive Officer";

  const setTime = (id, field) => {
    const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    const item = data.find((d) => d.ItemCode === id);
    const vehicleNumber = item?.VehicleNo;
    const companyId = item?.CustomerID;
    const truckType = activeTab === "loading" ? "Loading" : "Unloading";

    if (isSecurity) {
      if (field === "arrival" || field === "exit") {
        const route = field === "arrival" ? "truckvisit/arrival" : "truckvisit/exit";

        const payload = {
          vehicleNumber,
          truckType,
          companyId,
          seId: user?.id,
          [field === "arrival" ? "arrivalTime" : "leaveTime"]: currentTime,
        };

        fetch(`http://localhost:5000/api/order/${route}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then((data) => console.log(`Truck visit ${field} updated:`, data.message))
          .catch((err) => console.error(`Failed to update ${field} time:`, err));
      }
    }

    setTimestamps((prev) => {
      const updated = { ...prev[id] };

      if (field === "arrival") {
        return {
          ...prev,
          [id]: {
            arrival: currentTime,
            exit: "",
          },
        };
      }

      if (field === "bayIn") {
        return {
          ...prev,
          [id]: {
            bayIn: currentTime,
            bayOut: "",
          },
        };
      }

      return {
        ...prev,
        [id]: {
          ...updated,
          [field]: currentTime,
        },
      };
    });
  };

  return (
    <div className="bg-[var(--table-row-two)] font-[Noto Sans Sinhala] w-full flex flex-col items-center">
      <div className="w-full flex justify-center h-full">
        <button
          className={`w-1/2 py-3 text-lg font-semibold text-center cursor-pointer ${
            activeTab === "loading"
              ? "bg-[var(--main-red)] text-[var(--theme-white)]"
              : "bg-[var(--table-row-two)] text-[var(--darkest-red)]"
          }`}
          onClick={() => setActiveTab("loading")}
        >
          Loading
        </button>
        <button
          className={`w-1/2 py-3 text-lg font-semibold text-center cursor-pointer ${
            activeTab === "unloading"
              ? "bg-[var(--main-red)] text-[var(--theme-white)]"
              : "bg-[var(--table-row-two)] text-[var(--darkest-red)]"
          }`}
          onClick={() => setActiveTab("unloading")}
        >
          Unloading
        </button>
      </div>

      <h2 className="text-left text-[var(--darkest-red)] m-5 mt-8 text-2xl font-bold">
        {activeTab === "loading"
          ? "පැටවුම්වලට අදාළ විස්තර"
          : "බැවුම්වලට අදාළ විස්තර"}
      </h2>

      <table className="w-full mt-6 text-center">
        <thead>
          <tr className="table-header bg-[var(--main-red)] text-[var(--theme-white)]">
            <th className="p-3">Product ID</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Vehicle Number</th>
            <th className="p-3">Organization</th>
            <th className="p-3">Order Date</th>

            {isSecurity && (
              <>
                <th className="p-3">✔ Arrival</th>
                <th className="p-3">Arrival Time</th>
                <th className="p-3">✔ Exit</th>
                <th className="p-3">Exit Time</th>
              </>
            )}
            {isExecutive && (
              <>
                <th className="p-3">Bay Number</th>
                <th className="p-3">✔ Bay-In</th>
                <th className="p-3">Bay-In Time</th>
                <th className="p-3">✔ Bay-Out</th>
                <th className="p-3">Bay-Out Time</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={item.ItemCode}
                className={
                  index % 2 === 0
                    ? "bg-[var(--table-row-two)]"
                    : "bg-[var(--table-row-one)]"
                }
              >
                <td className="p-3">{item.ItemCode}</td>
                <td className="p-3">{item.QtyOrdered}</td>
                <td className="p-3">{item.VehicleNo}</td>
                <td className="p-3">{item.CustomerName}</td>
                <td className="p-3">
                  {new Date(item.Date).toISOString().slice(0, 10)}
                </td>

                {isSecurity && (
                  <>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        className="accent-[var(--main-red)] cursor-pointer"
                        onChange={() => setTime(item.ItemCode, "arrival")}
                        checked={!!timestamps[item.ItemCode]?.arrival}
                      />
                    </td>
                    <td className="p-3">
                      {timestamps[item.ItemCode]?.arrival || "-"}
                    </td>
                    <td className="p-3">
                      {timestamps[item.ItemCode]?.arrival && (
                        <input
                          type="checkbox"
                          className="accent-[var(--main-red)] cursor-pointer"
                          onChange={() => setTime(item.ItemCode, "exit")}
                          checked={!!timestamps[item.ItemCode]?.exit}
                        />
                      )}
                    </td>
                    <td className="p-3">
                      {timestamps[item.ItemCode]?.exit || "-"}
                    </td>
                  </>
                )}

                {isExecutive && (
                  <>
                    <td className="p-3">
                      <select name="baynumber" id="baynumber">
                        <option value="Bay 01">Bay 01</option>
                        <option value="Bay 02">Bay 02</option>
                        <option value="Bay 03">Bay 03</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        className="accent-[var(--main-red)] cursor-pointer"
                        onChange={() => setTime(item.ItemCode, "bayIn")}
                        checked={!!timestamps[item.ItemCode]?.bayIn}
                      />
                    </td>
                    <td className="p-3">
                      {timestamps[item.ItemCode]?.bayIn || "-"}
                    </td>
                    <td className="p-3">
                      {timestamps[item.ItemCode]?.bayIn && (
                        <input
                          type="checkbox"
                          className="accent-[var(--main-red)] cursor-pointer"
                          onChange={() => setTime(item.ItemCode, "bayOut")}
                          checked={!!timestamps[item.ItemCode]?.bayOut}
                        />
                      )}
                    </td>
                    <td className="p-3">
                      {timestamps[item.ItemCode]?.bayOut || "-"}
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={isSecurity ? 9 : isExecutive ? 14 : 5}
                className="p-4 text-center text-red-500"
              >
                දත්ත ලබා ගත නොහැක / No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataManageTable;
