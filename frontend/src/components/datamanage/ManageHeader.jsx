import { useAuth } from "../../context/AuthContext";

const ManageHeader = () => {
  const {user, logout} = useAuth();
  return (
    <div className="p-4 text-center bg-[var(--main-red)] ml-60">
      <h2 className="text-3xl font-bold text-white">Serendib WMS DataManage</h2>
      <button
          className="bg-[var(--darkest-red)] text-[var(--theme-white)] px-4 py-2 rounded-xl hover:bg-red-900"
          onClick={logout}
        >
          Logout
      </button>
    </div>
  );
};

export default ManageHeader;