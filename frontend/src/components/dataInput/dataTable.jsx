const DataTable = ({ orders, handleStatusChange }) => {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Submitted Orders</h3>
        <table className="min-w-full mt-4 text-center">
          <thead className="bg-[var(--main-red)] text-[var(--theme-white)]">
            <tr>
              <th className="p-2">Customer Name</th>
              <th className="p-2">Order No</th>
              <th className="p-2">Item Code</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Item</th>
              <th className="p-2">Vehicle No</th>
              <th className="p-2">Date</th>
              <th className="p-2">Type</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={
                  index % 2 === 0
                    ? "bg-[var(--table-row-one)]"
                    : "bg-[var(--table-row-two)]"
                }
              >
                <td className="p-2">{order.CustomerName}</td>
                <td className="p-2">{order.OrderNo}</td>
                <td className="p-2">{order.ItemCode}</td>
                <td className="p-2">{order.Quantity}</td>
                <td className="p-2">{order.Item}</td>
                <td className="p-2">{order.VehicleNo}</td>
                <td className="p-2">{order.Date}</td>
                <td className="p-2">{order.Type}</td>
                <td className="p-2">
                  {order.status === "ok" ? (
                    <span className="text-green-500">✔️</span>
                  ) : order.status === "not ok" ? (
                    <span className="text-red-500">❌</span>
                  ) : (
                    <span className="text-yellow-500">❗</span>
                  )}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleStatusChange(order.id)}
                    className="btn-primary cursor-pointer"
                  >
                    {order.status === "ok" ? "Mark Not OK" : "Mark OK"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default DataTable;  