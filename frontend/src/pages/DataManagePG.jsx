// src/pages/DataManagePG.jsx
import ManageHeader from "../components/datamanage/ManageHeader";
import { Outlet } from "react-router-dom";

const DataManagePG = () => {
  return (
    <div className="flex">
      <div className="ml-16 md:ml-60 w-full">
        <ManageHeader />
        <div className="mx-4 md:mx-6 my-4 md:my-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DataManagePG;
