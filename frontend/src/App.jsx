// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import DataInputForm from "./pages/DataInputPG";
import LoginPG from "./pages/LoginPG";
import AIresponsePG from "./pages/AIresponsePG";
import DashboardPG from "./pages/DashboardPG";
import DataManagePG from "./pages/DataManagePG";
import DataManageForm from "./components/datamanage/DataManageTable";
import { Toaster } from "sonner";

function App() {
  const { user } = useAuth();

  if (user === null) {
    return <LoginPG />;
  }

  const role = user?.role;

  return (
    <>
      <Routes>
        {!role ? (
          <Route path="*" element={<LoginPG />} />
        ) : (
          <>
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

            {/* Security Officer */}
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

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
      <Toaster richColors position="top-right" expand={true} />
    </>
  );
}

export default App;
