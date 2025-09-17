import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageToggle from "../common/LanguageToggle";
import { useNavigate } from "react-router-dom";

const SecurityHeader = () => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <div className="w-full p-4 text-center bg-[var(--main-red)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">{t("headers.securityTitle")}</h2>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            className="bg-[var(--darkest-red)] text-[var(--theme-white)] px-4 py-2 rounded-xl hover:bg-red-900"
            onClick={logout}
          >
            {t("common.logout")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityHeader;
