import { useState } from "react";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    CustomerName: "",
    OrderNo: "",
    ItemCode: "",
    Quantity: "",
    Item: "",
    VehicleNo: "",
    Date: "",
    Type: "loading",
  });

  const [orders, setOrders] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrders([...orders, { ...formData, id: Date.now(), status: "pending" }]);
    setFormData({
      CustomerName: "",
      OrderNo: "",
      ItemCode: "",
      Quantity: "",
      Item: "",
      VehicleNo: "",
      Date: "",
      Type: "loading",
    });
    alert("Form submitted successfully!");
  };

  const handleStatusChange = (id) => {
    const updatedOrders = orders.map((order) =>
      order.id === id
        ? {
            ...order,
            status: order.status === "pending" ? "ok" : order.status === "ok" ? "not ok" : "ok",
          }
        : order
    );
    setOrders(updatedOrders);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-secondary p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* First Column (Left) */}
        <div className="mb-4">
          <label className="block text-main mb-2">Customer Name</label>
          <input
            type="text"
            name="CustomerName"
            value={formData.CustomerName}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-main mb-2">Order No</label>
          <input
            type="text"
            name="OrderNo"
            value={formData.OrderNo}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-main mb-2">Item Code</label>
          <input
            type="text"
            name="ItemCode"
            value={formData.ItemCode}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
            required
          />
        </div>

        {/* Second Column (Center) */}
        <div className="mb-4">
          <label className="block text-main mb-2">Quantity</label>
          <input
            type="number"
            name="Quantity"
            value={formData.Quantity}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-main mb-2">Item</label>
          <input
            type="text"
            name="Item"
            value={formData.Item}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-main mb-2">Vehicle No</label>
          <input
            type="text"
            name="VehicleNo"
            value={formData.VehicleNo}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
            required
          />
        </div>

        {/* Third Column (Right) */}
        <div className="mb-4">
          <label className="block text-main mb-2">Date</label>
          <input
            type="date"
            name="Date"
            value={formData.Date}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-main mb-2">Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center text-main">
              <input
                type="radio"
                name="Type"
                value="loading"
                checked={formData.Type === "loading"}
                onChange={handleChange}
                className="mr-2"
              />
              Loading
            </label>
            <label className="flex items-center text-main">
              <input
                type="radio"
                name="Type"
                value="unloading"
                checked={formData.Type === "unloading"}
                onChange={handleChange}
                className="mr-2"
              />
              Unloading
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            className="w-40 py-3 bg-main text-white rounded-lg hover:bg-accent transition duration-300 text-center"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Table to display submitted orders */}
      {orders.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Submitted Orders</h3>
          <table className="min-w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Customer Name</th>
                <th className="border p-2">Order No</th>
                <th className="border p-2">Item Code</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Item</th>
                <th className="border p-2">Vehicle No</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="border p-2">{order.CustomerName}</td>
                  <td className="border p-2">{order.OrderNo}</td>
                  <td className="border p-2">{order.ItemCode}</td>
                  <td className="border p-2">{order.Quantity}</td>
                  <td className="border p-2">{order.Item}</td>
                  <td className="border p-2">{order.VehicleNo}</td>
                  <td className="border p-2">{order.Date}</td>
                  <td className="border p-2">{order.Type}</td>
                  <td className="border p-2">
                    {order.status === "ok" ? (
                      <span className="text-green-500">✔️</span>
                    ) : order.status === "not ok" ? (
                      <span className="text-red-500">❌</span>
                    ) : (
                      <span className="text-yellow-500">❗</span>
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleStatusChange(order.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {order.status === "ok" ? "Mark Not OK" : "Mark OK"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
