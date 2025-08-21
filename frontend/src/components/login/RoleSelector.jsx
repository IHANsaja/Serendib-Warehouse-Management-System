import React from "react";

const roles = [
  "Administrator",
  "Executive Officer",
  "Security Officer",
  "Inventory Officer",
];

const RoleSelector = ({ role, setRole }) => {
  return (
    <div className="role-selector w-full flex flex-row gap-1">
      {roles.map((r) => (
        <button
          key={r}
          className={role === r ? "role-button active" : "role-button"}
          onClick={() => setRole(r)}
        >
          {r}
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
