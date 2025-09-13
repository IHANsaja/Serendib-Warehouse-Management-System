import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
    return (
      <div className="flex justify-between items-center p-4 bg-[var(--main-red)]">
        <h2 className="text-3xl font-bold text-[var(--theme-white)]">Serendib WMS</h2>
        <p className="text-[var(--theme-white)] text-2xl">Welcome <span className="font-black">{user.name}!</span></p>
        <button
          className="bg-[var(--darkest-red)] text-[var(--theme-white)] px-4 py-2 rounded-xl hover:bg-red-900"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    );
  };
  
  export default Header;
  