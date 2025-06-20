import React from "react";
import ManageHeader from "../components/datamanage/ManageHeader";

const DataManagePG = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-[#FEF4F3]">
      {/* Full‑width header */}
      <ManageHeader />

      {/* Centered content container */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {children}
      </div>
    </div>
  );
};

export default DataManagePG;
