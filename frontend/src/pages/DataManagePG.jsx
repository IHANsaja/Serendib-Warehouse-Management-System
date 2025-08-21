import ManageHeader from "../components/datamanage/ManageHeader";
import SecurityTimingManagement from "../components/datamanage/SecurityManagement";
import { useAuth } from "../context/AuthContext";

const DataManagePG = ({ children, showSecurityTiming }) => {
  const { user } = useAuth();
  const visitId = 1; // Replace with selected visit
  const seId = user?.employeeId;

  return (
    <div className="w-full min-h-screen bg-[#FEF4F3]">
      <ManageHeader />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {children}
        {showSecurityTiming && (
          <SecurityTimingManagement visitId={visitId} seId={seId} />
        )}
      </div>
    </div>
  );
};

export default DataManagePG;
