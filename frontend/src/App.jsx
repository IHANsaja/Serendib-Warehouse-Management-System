import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DataInputForm from "./pages/DataInputPG";
import LoginPG from "./pages/LoginPG";
import AIresponsePG from "./pages/AIresponsePG";
import DashboardPG from "./pages/DashboardPG";
import DataManagePG from "./pages/DataManagePG";
import DataManageForm from "./components/datamanage/DataManageTable";

function App() {
  const [role, setRole] = useState(null);

  return (
    <Routes>
      {!role ? (
        <Route path="*" element={<LoginPG setRole={setRole} />} />
      ) : (
        <>
          {/* Redirect “/” → role home */}
          <Route
            path="/"
            element={
              role === "Administrator" ? (
                <Navigate to="/admin" />
              ) : role === "Executive" ? (
                <Navigate to="/executive" />
              ) : role === "Security Officer" ? (
                <Navigate to="/security" />
              ) : (
                <Navigate to="/inventory" />
              )
            }
          />

          {/* Administrator */}
          {role === "Administrator" && (
            <Route path="/admin" element={<DashboardPG />} />
          )}

          {/* Executive */}
          {role === "Executive" && (
            <Route path="/executive" element={<DataInputForm />} />
          )}

          {/* Security Officer (no Sidebar) */}
          {role === "Security Officer" && (
            <Route
              path="/security"
              element={
                <DataManagePG>
                  <DataManageForm role="Security Officer" type="delivery" />
                </DataManagePG>
              }
            />
          )}

          {/* Inventory Officer */}
          {role === "Inventory Officer" && (
            <Route path="/inventory" element={<AIresponsePG />} />
          )}

          {/* Catch‑all */}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
