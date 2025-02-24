import React from "react";

const roles = [
  "Administrator",
  "Executive",
  "Security Officer",
  "Inventory Officer",
];

const RoleSelector = ({ role, setRole }) => {
  return (
    <div className="role-selector">
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
