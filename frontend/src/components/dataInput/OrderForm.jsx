import React, { useState, useEffect } from "react";
import DataTable from "../dataInput/dataTable.jsx";
import axios from "axios";
import { getSriLankaDate } from "../../utils/timeUtils";
import { toast } from "react-toastify";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    CustomerName: "",
    OrderNo: "",
    ItemCode: "",
    Quantity: "",
    Item: "",
    VehicleNo: "",
    EstimatedArrival: "",
    EstimatedLeave: "",
    EstimatedBayIn: "",
    EstimatedBayOut: "",
    Type: "loading",
  });

  const [orders, setOrders] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    Name: "",
    Address: "",
  });

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/order/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomerData({ ...newCustomerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First create the order record with estimated bay times
      const orderResponse = await axios.post("http://localhost:5000/api/order", {
        CustomerName: formData.CustomerName,
        ItemCode: formData.ItemCode,
        VehicleNo: formData.VehicleNo,
        Item: formData.Item,
        Quantity: formData.Quantity,
        Date: getSriLankaDate(), // Use Sri Lanka timezone
        Type: formData.Type,
        DriverName: "Driver Name", // This could be added to the form later
        EstimatedBayIn: formData.EstimatedBayIn.replace('T', ' '),
        EstimatedBayOut: formData.EstimatedBayOut.replace('T', ' ')
      });

      if (orderResponse.data.message === 'Order inserted successfully') {
        // Get the order ID from the response
        const orderId = orderResponse.data.orderId;
        
        // Create a truck visit record linked to the order
        const visitResponse = await axios.post("http://localhost:5000/api/order/truckvisit", {
          vehicleNumber: formData.VehicleNo,
          truckType: formData.Type === 'loading' ? 'Loading' : 'Unloading',
          companyId: companies.find(c => c.Name === formData.CustomerName)?.CompanyID,
          seId: 1003, // Default security officer ID
          eoId: 1002, // Default executive officer ID
          driverName: "Driver Name", // This could be added to the form later
          numSacks: formData.Quantity,
          estimatedArrivalTime: formData.EstimatedArrival.replace('T', ' '),
          estimatedLeaveTime: formData.EstimatedLeave.replace('T', ' '),
          orderId: orderId
        });

        if (visitResponse.data.visitId) {
          toast.success("Order and truck visit created successfully! The executive officer can now assign a bay and record bay operations.");
        }
      }

      setFormData({
        CustomerName: "",
        OrderNo: "",
        ItemCode: "",
        Quantity: "",
        Item: "",
        VehicleNo: "",
        EstimatedArrival: "",
        EstimatedLeave: "",
        EstimatedBayIn: "",
        EstimatedBayOut: "",
        Type: "loading",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  const handleNewCustomerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/order/company", newCustomerData);
      toast.success(response.data.message);
      
      // Add new company to the list and select it
      setCompanies([...companies, response.data.company]);
      setFormData({ ...formData, CustomerName: response.data.company.Name });
      
      // Reset and close form
      setNewCustomerData({ Name: "", Address: "" });
      setShowNewCustomerForm(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  const openNewCustomerForm = () => {
    setShowNewCustomerForm(true);
  };

  const closeNewCustomerForm = () => {
    setShowNewCustomerForm(false);
    setNewCustomerData({ Name: "", Address: "" });
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

        {/* Customer Name Dropdown */}
        <div className="col-span-full sm:col-span-1">
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: "var(--main-red)" }}
          >
            Customer Name
          </label>
          <div className="flex gap-2">
            <select
              name="CustomerName"
              value={formData.CustomerName}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-3 rounded-lg border focus:outline-none"
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
            >
              <option value="">Select Customer</option>
              {companies.map((company) => (
                <option key={company.CompanyID} value={company.Name}>
                  {company.Name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={openNewCustomerForm}
              className="px-4 py-3 rounded-lg font-medium cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: "var(--theme-yellow)",
                color: "var(--darkest-red)",
                border: "1px solid var(--main-red)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--main-red)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--theme-yellow)")
              }
            >
              + New
            </button>
          </div>
        </div>

        {/* Input Fields */}
        {[
          { label: "Order No", name: "OrderNo", type: "text" },
          { label: "Item Code", name: "ItemCode", type: "text" },
          { label: "Quantity", name: "Quantity", type: "number" },
          { label: "Item", name: "Item", type: "text" },
          { label: "Vehicle No", name: "VehicleNo", type: "text" },
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

        {/* Estimated Time Fields */}
        <div className="col-span-full sm:col-span-1">
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: "var(--main-red)" }}
          >
            Estimated Arrival to Gate
          </label>
          <input
            type="datetime-local"
            name="EstimatedArrival"
            value={formData.EstimatedArrival}
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

        <div className="col-span-full sm:col-span-1">
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: "var(--main-red)" }}
          >
            Estimated Leave from Gate
          </label>
          <input
            type="datetime-local"
            name="EstimatedLeave"
            value={formData.EstimatedLeave}
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

        <div className="col-span-full sm:col-span-1">
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: "var(--main-red)" }}
          >
            Estimated Bay-In Time
          </label>
          <input
            type="datetime-local"
            name="EstimatedBayIn"
            value={formData.EstimatedBayIn}
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

        <div className="col-span-full sm:col-span-1">
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: "var(--main-red)" }}
          >
            Estimated Bay-Out Time
          </label>
          <input
            type="datetime-local"
            name="EstimatedBayOut"
            value={formData.EstimatedBayOut}
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

      {/* New Customer Popup Form */}
      {showNewCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--main-red)" }}
            >
              Add New Customer
            </h3>
            <form onSubmit={handleNewCustomerSubmit}>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-medium"
                  style={{ color: "var(--main-red)" }}
                >
                  Company Name
                </label>
                <input
                  type="text"
                  name="Name"
                  value={newCustomerData.Name}
                  onChange={handleNewCustomerChange}
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
              <div className="mb-6">
                <label
                  className="block mb-2 text-sm font-medium"
                  style={{ color: "var(--main-red)" }}
                >
                  Address
                </label>
                <textarea
                  name="Address"
                  value={newCustomerData.Address}
                  onChange={handleNewCustomerChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none resize-none"
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
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeNewCustomerForm}
                  className="px-4 py-2 rounded-lg font-medium cursor-pointer"
                  style={{
                    backgroundColor: "var(--theme-white)",
                    color: "var(--main-red)",
                    border: "1px solid var(--main-red)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-medium cursor-pointer"
                  style={{
                    backgroundColor: "var(--main-red)",
                    color: "var(--theme-white)",
                  }}
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
