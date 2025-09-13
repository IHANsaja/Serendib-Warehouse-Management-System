import ManageHeader from "../components/datamanage/ManageHeader";
import SecurityHeader from "../components/datamanage/SecurityHeader";

const DataManagePG = ({ children, showSecurityTiming }) => {

  return (
    <div className="w-full min-h-screen bg-[#FEF4F3]">
      {showSecurityTiming ? <SecurityHeader /> : <ManageHeader />}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {children}
      </div>
    </div>
  );
};

export default DataManagePG;
