import { useState } from "react";
import DataTable from "../dataInput/dataTable.jsx";
import axios from "axios";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/order", {
        OrderID: formData.OrderNo,
        ProductName: formData.Item,
        QtyOrdered: formData.Quantity,
        CustomerName: formData.CustomerName,
        ItemCode: formData.ItemCode,
        VehicleNo: formData.VehicleNo,
        Date: formData.Date,
        Type: formData.Type,
      });

      alert(response.data.message);

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
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="px-4 py-6" style={{ backgroundColor: "var(--theme-white)" }}>
      <form
        onSubmit={handleSubmit}
        className="p-6 md:p-8 rounded-xl shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ backgroundColor: "var(--theme-white)" }}
      >
        <h2
          className="col-span-full text-xl font-semibold border-b pb-2"
          style={{ color: "var(--main-red)", borderColor: "var(--main-red)" }}
        >
          Order Entry Form
        </h2>

        {/* Input Fields */}
        {[
          { label: "Customer Name", name: "CustomerName", type: "text" },
          { label: "Order No", name: "OrderNo", type: "text" },
          { label: "Item Code", name: "ItemCode", type: "text" },
          { label: "Quantity", name: "Quantity", type: "number" },
          { label: "Item", name: "Item", type: "text" },
          { label: "Vehicle No", name: "VehicleNo", type: "text" },
          { label: "Date", name: "Date", type: "date" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label
              className="block mb-2 text-sm font-medium"
              style={{ color: "var(--main-red)" }}
            >
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border focus:outline-none"
              style={{
                borderColor: "var(--main-red)",
                backgroundColor: "var(--theme-white)",
                color: "var(--darkest-red)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--theme-yellow)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--main-red)")
              }
            />
          </div>
        ))}

        {/* Type Radio Buttons */}
        <div className="col-span-full">
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: "var(--main-red)" }}
          >
            Type
          </label>
          <div className="flex space-x-4">
            {["loading", "unloading"].map((typeOption) => (
              <button
                key={typeOption}
                type="button"
                onClick={() => setFormData({ ...formData, Type: typeOption })}
                className="px-6 py-2 rounded-full border text-sm font-medium transition-all duration-200"
                style={{
                  borderColor: "var(--main-red)",
                  backgroundColor:
                    formData.Type === typeOption
                      ? "var(--theme-yellow)"
                      : "var(--theme-white)",
                  color:
                    formData.Type === typeOption
                      ? "var(--darkest-red)"
                      : "var(--main-red)",
                }}
              >
                {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-full flex justify-end mt-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-lg font-semibold cursor-pointer"
            style={{
              backgroundColor: "var(--main-red)",
              color: "var(--theme-white)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--darkest-red)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--main-red)")
            }
          >
            Submit Order
          </button>
        </div>
      </form>

      {/* Orders Table */}
      {orders.length > 0 && (
        <div className="mt-8">
          <DataTable orders={orders} handleStatusChange={() => {}} />
        </div>
      )}
    </div>
  );
};

export default OrderForm;
