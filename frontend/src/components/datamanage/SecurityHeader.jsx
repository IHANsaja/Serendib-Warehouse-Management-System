import { useAuth } from "../../context/AuthContext";

const SecurityHeader = () => {
  const { logout } = useAuth();
  return (
    <div className="w-full p-4 text-center bg-[var(--main-red)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Serendib WMS - Security Officer</h2>
        <button
          className="bg-[var(--darkest-red)] text-[var(--theme-white)] px-4 py-2 rounded-xl hover:bg-red-900"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SecurityHeader;
