import React, { useState } from "react";
import DataInputForm from "./pages/dataInputPG";
import LoginPG from "./pages/loginPG";
import AIresponsePG from "./pages/AIresponsePG";
import DashboardPG from "./pages/dashboardPG";
import DataManagePG from "./pages/DataManagePG";

function App() {
  const [role, setRole] = useState(null);

  const renderPage = () => {
    switch (role) {
      case "Administrator":
        return <DashboardPG />;
      case "Executive":
        return <DataInputForm />;
      case "Security Officer":
        return <DataManagePG />;
      case "Inventory Officer":
        return <AIresponsePG />;
      default:
        return <LoginPG setRole={setRole} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;