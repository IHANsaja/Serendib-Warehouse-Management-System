import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageToggle from "../common/LanguageToggle";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-4 bg-[var(--main-red)]">
      <h2 className="text-3xl font-bold text-[var(--theme-white)]">{t("headers.appTitle")}</h2>
      <div className="flex items-center gap-3">
        <p className="text-[var(--theme-white)] text-2xl">{t("common.welcome")} <span className="font-black">{user.name}!</span></p>
        <LanguageToggle />
        <button
          className="bg-[var(--darkest-red)] text-[var(--theme-white)] px-4 py-2 rounded-xl hover:bg-red-900"
          onClick={logout}
        >
          {t("common.logout")}
        </button>
      </div>
    </div>
  );
};

export default Header;
  