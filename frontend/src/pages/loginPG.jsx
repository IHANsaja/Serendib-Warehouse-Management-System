import React, { useState } from "react";
import LoginForm from "../components/login/loginForm.jsx";
import RoleSelector from "../components/login/RoleSelector.jsx";

const LoginPG = ({ setRole }) => {
  const [role, setLocalRole] = useState("Administrator");

  const handleLogin = (user) => {
    console.log("User logged in:", user);
    setRole(user.role); // 🟢 Use role from DB
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="login-container">
        <h2 className="heading font-black text-3xl">SERENDIB WMS LOGIN</h2>
        <RoleSelector role={role} setRole={setLocalRole} />
        <div className="input-container">
          <LoginForm role={role} onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default LoginPG;
