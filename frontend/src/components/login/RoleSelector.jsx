import React, { useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";

const rawRoles = [
  "Administrator",
  "Executive Officer",
  "Security Officer",
  "Inventory Officer",
];

const RoleSelector = ({ role, setRole }) => {
  const { t } = useLanguage();

  const roles = useMemo(
    () => [
      { value: "Administrator", label: t("roles.administrator") },
      { value: "Executive Officer", label: t("roles.executiveOfficer") },
      { value: "Security Officer", label: t("roles.securityOfficer") },
      { value: "Inventory Officer", label: t("roles.inventoryOfficer") },
    ],
    [t]
  );

  return (
    <div className="role-selector w-full flex flex-row gap-1">
      {roles.map((r) => (
        <button
          key={r.value}
          className={role === r.value ? "role-button active" : "role-button"}
          onClick={() => setRole(r.value)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
