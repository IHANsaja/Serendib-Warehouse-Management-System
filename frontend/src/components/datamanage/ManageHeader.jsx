import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageToggle from "../common/LanguageToggle";

const ManageHeader = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  return (
    <div className="p-4 bg-[var(--main-red)] ml-60">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">{t("headers.dataManageTitle")}</h2>
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

export default ManageHeader;