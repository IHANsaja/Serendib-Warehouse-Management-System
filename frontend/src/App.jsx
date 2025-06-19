import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import DataInputForm from "./pages/dataInputPG";
import LoginPG from "./pages/loginPG";
import AIresponsePG from "./pages/AIresponsePG";
import DashboardPG from "./pages/dashboardPG";
import DataManagePG from "./pages/DataManagePG";

function App() {
  const [role, setRole] = useState(null);

  return (
    <Routes>
      {!role ? (
        <Route path="*" element={<LoginPG setRole={setRole} />} />
      ) : (
        <>
          {role === "Administrator" && <Route path="*" element={<DashboardPG />} />}
          {role === "Executive" && <Route path="*" element={<DataInputForm />} />}
          {role === "Security Officer" && <Route path="*" element={<DataManagePG />} />}
          {role === "Inventory Officer" && <Route path="*" element={<AIresponsePG />} />}
        </>
      )}
    </Routes>
  );
}

export default App;
