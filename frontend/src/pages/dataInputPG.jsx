import React, { useState } from "react";
import Header from "../components/dataInput/Header";
import OrderForm from "../components/dataInput/OrderForm";
import DataManageForm from "../components/datamanage/DataManageTable";
import Sidebar from "../components/common/Sidebar";
import BayManagement from "../components/datamanage/BayManagement";
import { useAuth } from "../context/AuthContext";

const DataInputPG = () => {
  const [selectedComponent, setSelectedComponent] = useState("OrderForm");
  const { user } = useAuth();

  // You can store these in state or get from selected order
  const visitId = 1; // Replace with actual selected VisitID
  const bayId = 101; // Replace with actual selected BayID
  const eoId = user?.employeeId; // From logged-in Executive

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
          {selectedComponent === "BayManagement" && (
            <BayManagement visitId={visitId} eoId={eoId} bayId={bayId} />
          )}
        </main>
      </div>
    </>
  );
};

export default DataInputPG;
