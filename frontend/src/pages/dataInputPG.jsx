import React, { useState } from "react";
import Header from "../components/dataInput/Header";
import OrderForm from "../components/dataInput/OrderForm";
import DataManageForm from "../components/datamanage/DataManageTable";

const DataInputPG = () => {
  const [selectedComponent, setSelectedComponent] = useState("OrderForm");

  return (
    <>
      <Header />
      <div className="flex container mx-auto p-4">
        <div className="flex-1 p-4">
          <select
            name="swap"
            id="swap"
            className="p-2 bg=[var(--main-red)] rounded"
            onChange={(e) => setSelectedComponent(e.target.value)}
            value={selectedComponent}
          >
            <option value="OrderForm">Order Management</option>
            <option value="DataManageForm">Data Management</option>
          </select>

          <div className="mt-4">
            {selectedComponent === "OrderForm" && <OrderForm />}
            {selectedComponent === "DataManageForm" && <DataManageForm role="Executive Officer"/>}
          </div>
        </div>
      </div>
    </>
  );
};

export default DataInputPG;
