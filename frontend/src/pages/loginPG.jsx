// src/pages/LoginPG.jsx
import { useState } from "react";
import LoginForm from "../components/login/loginForm.jsx";
import RoleSelector from "../components/login/RoleSelector.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import LanguageToggle from "../components/common/LanguageToggle.jsx";

const LoginPG = () => {
  const [role, setLocalRole] = useState("Administrator");
  const { setUser } = useAuth();
  const { t } = useLanguage();

  const handleLogin = (user) => {
    console.log("User logged in:", user);
    setUser(user); // ✅ sets the global user context
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="absolute top-4 right-4"><LanguageToggle /></div>
      <div className="login-container">
        <h2 className="heading font-black text-3xl text-center">{t("login.title")}</h2>
        <div className="mt-4">
          <RoleSelector role={role} setRole={setLocalRole} />
        </div>
        <div className="input-container">
          <LoginForm role={role} onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default LoginPG;
