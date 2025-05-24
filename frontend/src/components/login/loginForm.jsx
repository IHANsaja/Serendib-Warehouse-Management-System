import React, { useState } from "react";

const LoginForm = ({ role, onLogin }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in as:", role, username);
    onLogin(); // Trigger login function
  };

  return (
    <form
      className="flex flex-col gap-4 p-6 bg-[var(--theme-white)] shadow-lg rounded-xl w-full"
      onSubmit={handleSubmit}
    >
      <div className="relative w-full">
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="peer w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--table-row-one)] focus:border-[var(--theme-yellow)] placeholder-transparent"
          placeholder=" "
        />
        <label
          htmlFor="username"
          className="absolute cursor-text left-3 top-3 text-[var(--main-red)] transition-all transform -translate-y-1/2 scale-100 origin-top-left bg-[#FEF4F3] px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:opacity-70 peer-placeholder-shown:text-[var(--main-red)] peer-focus:top-2 peer-focus:opacity-100 peer-focus:text-sm peer-focus:text-[var(--main-red)]"
        >
          Username
        </label>
      </div>
      <div className="relative">
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="peer w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--table-row-one)] focus:border-[var(--theme-yellow)] placeholder-transparent"
          placeholder=" "
        />
        <label
          htmlFor="password"
          className="absolute cursor-text left-3 top-3 text-[var(--main-red)] transition-all transform -translate-y-1/2 scale-100 origin-top-left bg-[#FEF4F3] px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:opacity-70 peer-placeholder-shown:text-[var(--main-red)] peer-focus:top-2 peer-focus:opacity-100 peer-focus:text-sm peer-focus:text-[var(--main-red)]"
        >
          Password
        </label>
      </div>
      <button
        type="submit"
        className="w-full py-3 cursor-pointer bg-[var(--theme-yellow)] text-[var(--main-red)] font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-[#f9c046] hover:shadow-lg active:scale-95"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
