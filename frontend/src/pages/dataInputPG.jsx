import React, { useState } from "react";
import Header from "../components/dataInput/Header";
import OrderForm from "../components/dataInput/OrderForm";
import DataManageForm from "../components/datamanage/DataManageTable";
import Sidebar from "../components/common/sidebar";
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
    <div className="flex flex-col h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50">
        <Header />
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sticky Sidebar */}
        <div className="flex flex-col h-full">
          <aside className="h-full">
            <Sidebar selected={selectedComponent} onSelect={setSelectedComponent} />
          </aside>
        </div>
        
        {/* Scrollable Content */}
        <main className="flex-1 p-4 md:p-6 bg-[#FEF4F3] overflow-y-auto">
          {selectedComponent === "OrderForm" && <OrderForm />}
          {selectedComponent === "DataManageForm" && (
            <DataManageForm role="Executive Officer" type="delivery" />
          )}
          {selectedComponent === "BayManagement" && (
            <BayManagement visitId={visitId} eoId={eoId} bayId={bayId} />
          )}
        </main>
      </div>
    </div>
  );
};

export default DataInputPG;