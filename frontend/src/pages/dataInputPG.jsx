import React, { useState } from 'react';
import '../CSS/dataInputPG.css';  // Import the custom CSS file

function DataInputForm() {
  // States for the form data
  const [formData, setFormData] = useState({
    CustomerName: '',
    OrderNo: '',
    ItemCode: '',
    contact: '',
    Quantity: '',
    warehouse: '',
    Item: '',
    VehicleNo: '',
    choice: 'loading',
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle date selection
  const handleDateChange = (e) => {
    setFormData({ ...formData, date: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    alert('Form submitted successfully!');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-main text-3xl font-bold mb-6">Data Input Form</h2>
      <form onSubmit={handleSubmit} className="bg-secondary p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Column 1 */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-main mb-2">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="age" className="block text-main mb-2">Age:</label>
          <input
            type="number"
            name="age"
            id="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-main mb-2">Address:</label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
          />
        </div>

        {/* Column 2 */}
        <div className="mb-4">
          <label htmlFor="contact" className="block text-main mb-2">Contact:</label>
          <input
            type="text"
            name="contact"
            id="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-main mb-2">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-main mb-2">Date:</label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleDateChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
            required
          />
        </div>

        {/* Column 3 */}
        <div className="mb-4">
          <label htmlFor="field1" className="block text-main mb-2">Field 1:</label>
          <input
            type="text"
            name="field1"
            id="field1"
            value={formData.field1}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="field2" className="block text-main mb-2">Field 2:</label>
          <input
            type="text"
            name="field2"
            id="field2"
            value={formData.field2}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="field3" className="block text-main mb-2">Field 3:</label>
          <input
            type="text"
            name="field3"
            id="field3"
            value={formData.field3}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-main focus:border-accent outline-none"
          />
        </div>

        {/* Choice Input: Loading or Unloading */}
        <div className="col-span-1 md:col-span-1 mb-4">
          <label className="block text-main mb-2">Choice:</label>
          <div className="flex space-x-4">
            <label className="flex items-center text-main">
              <input
                type="radio"
                name="choice"
                value="loading"
                checked={formData.choice === "loading"}
                onChange={handleChange}
                className="mr-2"
              />
              Loading
            </label>
            <label className="flex items-center text-main">
              <input
                type="radio"
                name="choice"
                value="unloading"
                checked={formData.choice === "unloading"}
                onChange={handleChange}
                className="mr-2"
              />
              Unloading
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full py-3 bg-main text-white rounded-lg hover:bg-accent transition duration-300">
          Submit
        </button>
      </form>
    </div>
  );
};

export default DataInputForm;
