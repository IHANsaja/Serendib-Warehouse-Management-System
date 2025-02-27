import React, { useState } from "react";
import LoginForm from "../components/login/LoginForm.jsx";
import RoleSelector from "../components/login/RoleSelector.jsx"; 


const LoginPG = () => {
  const [role, setRole] = useState("Administrator");

  return (
    <div className="login-container">
      <h2 className="heading">Serendib Login</h2>
      <RoleSelector role={role} setRole={setRole} />
      <div className="input-container">
        <LoginForm role={role} setRole={setRole} />
      </div>  
    </div>
  );
};

export default LoginPG;
