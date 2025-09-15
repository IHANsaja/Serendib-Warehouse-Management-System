// // src/components/AImodel/AIHeader.jsx
// const AIHeader = () => (
//   <div className="bg-[var(--main-red)] text-[var(--theme-white)] p-4 flex justify-between items-center">
//     <h1 className="text-xl font-semibold">SERENDIB AI</h1>
//     <button className="header-head">Real-Time Camera View</button>
//   </div>
// );
// export default AIHeader;

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageToggle from "../common/LanguageToggle";

const AIHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <header className="bg-[var(--main-red)] text-[var(--theme-white)] p-4 flex justify-between items-center shadow-md">
      <div>
        <h1 className="text-2xl font-bold">{t("headers.aiTitle")}</h1>
        {user && (
          <p className="text-sm mt-1">
            {t("headers.loggedInAs")} <span className="font-semibold">{user.name}</span> ({user.role})
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <LanguageToggle />
        <button
          className="header-head"
          onClick={() => navigate("/live")}
        >
          {t("headers.realTimeCamera")}
        </button>
        <button
          className="bg-[var(--darkest-red)] text-[var(--theme-white)] px-4 py-2 rounded-xl hover:bg-red-900"
          onClick={logout}
        >
          {t("common.logout")}
        </button>
      </div>
    </header>
  );
};

export default AIHeader;
