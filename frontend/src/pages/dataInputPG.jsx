import React, { useState } from "react";
import Header from "../components/dataInput/Header";
import OrderForm from "../components/dataInput/OrderForm";
import DataManageForm from "../components/datamanage/DataManageTable";
import Sidebar from "../components/common/Sidebar";

const DataInputPG = () => {
  const [selectedComponent, setSelectedComponent] = useState("OrderForm");

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar selected={selectedComponent} onSelect={setSelectedComponent} />
        <main className="w-full p-4 md:p-6 bg-[#FEF4F3] min-h-screen">
          {selectedComponent === "OrderForm" && <OrderForm />}
          {selectedComponent === "DataManageForm" && (
            <DataManageForm role="Executive Officer" type="delivery" />
          )}
        </main>
      </div>
    </>
  );
};

export default DataInputPG;
