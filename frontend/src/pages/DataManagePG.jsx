import DataManageTable from "../components/datamanage/DataManageTable";
import ManageHeader from "../components/datamanage/ManageHeader";

const DataManagePG = () => {
  return (
    <div>
        <ManageHeader />
        <div className="mx-6 my-6">
            <DataManageTable />
        </div>
    </div>
  );
}

export default DataManagePG;