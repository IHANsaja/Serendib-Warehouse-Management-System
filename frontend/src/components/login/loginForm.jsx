import React, { useState } from "react";

const LoginForm = ({ role, onLogin }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in as:", role, username);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        onLogin(data.user);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 p-6 bg-[var(--theme-white)] shadow-lg rounded-xl w-full"
      onSubmit={handleSubmit}
    >
      {/* Username Field */}
      <div className="relative w-full">
        <input
          type="text"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
          placeholder="Username"
          className="peer w-full px-4 py-3 rounded-lg"
        />
      </div>

      {/* Password Field */}
      <div className="relative">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="peer w-full px-4 py-3 rounded-lg"
        />
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full py-3 bg-[var(--theme-yellow)] text-[var(--main-red)] font-semibold rounded-lg"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
