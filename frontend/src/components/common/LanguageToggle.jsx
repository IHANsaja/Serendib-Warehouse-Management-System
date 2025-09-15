import { useLanguage } from "../../context/LanguageContext";
import { useMemo } from "react";
import { FaGlobe } from "react-icons/fa";

const LanguageToggle = ({ className = "" }) => {
  const { currentLanguage, toggleLanguage, t } = useLanguage();

  const isSinhala = useMemo(() => currentLanguage === "sinhala", [currentLanguage]);

  return (
    <button
      type="button"
      aria-label={t("common.switchTo") + " " + (isSinhala ? "English" : "සිංහල")}
      onClick={toggleLanguage}
      className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 text-[var(--main-red)] shadow-md border border-red-200 hover:shadow-lg transition-all duration-300 group ${className}`}
    >
      <FaGlobe className="text-[var(--main-red)] transition-transform duration-300 group-hover:rotate-12" />
      <span className="font-semibold text-sm">
        {isSinhala ? "සිං → EN" : "EN → සිං"}
      </span>
      <span
        className={`absolute inset-0 -z-10 rounded-full bg-[var(--theme-yellow)] opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300`}
      />
    </button>
  );
};

export default LanguageToggle;
