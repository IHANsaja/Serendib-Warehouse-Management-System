import { useAuth } from "../../context/AuthContext";
import LanguageToggle from "../common/LanguageToggle";
import { useLanguage } from "../../context/LanguageContext";

const SecurityHeader = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  return (
    <div className="p-4 bg-[var(--main-red)] flex items-center justify-between">
      <h2 className="text-3xl font-bold text-white">Serendib WMS</h2>
      <div className="flex items-center gap-3">
        <LanguageToggle size="sm" />
        <button
          className="bg-[var(--darkest-red)] text-[var(--theme-white)] px-4 py-2 rounded-xl hover:bg-red-900"
          onClick={logout}
        >
          {t('common.logout')}
        </button>
      </div>
    </div>
  );
};

export default SecurityHeader;


