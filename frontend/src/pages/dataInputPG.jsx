import React, { useState } from 'react';
import '../CSS/dataInputPG.css';  // Import the custom CSS file
import Header from "../components/dataInput/Header";
import OrderForm from "../components/dataInput//OrderForm";

const DataInputPG = () => {
  return (
    <div className="container mx-auto p-4">
      <Header />
      <OrderForm />
    </div>
  );
};

export default DataInputPG;
