import React, { useState } from 'react';
import Header from "../components/dataInput/Header";
import OrderForm from "../components/dataInput//OrderForm";

const DataInputPG = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <OrderForm />
      </div>
    </>
  );
};

export default DataInputPG;
