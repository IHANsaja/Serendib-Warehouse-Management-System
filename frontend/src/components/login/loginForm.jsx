import { useState } from "react";
import { toast } from "react-toastify";

const LoginForm = ({ role, onLogin }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in as:", role, username);

    // Basic client-side validation with user-friendly toasts
    if (!username.trim() && !password.trim()) {
      toast.warn("Please enter your username and password.");
      return;
    }
    if (!username.trim()) {
      toast.warn("Please enter your username.");
      return;
    }
    if (!password.trim()) {
      toast.warn("Please enter your password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: username, password, role }),
      });

      // Attempt to parse JSON safely
      let data = {};
      try {
        data = await response.json();
      } catch {
        // non-JSON response
      }

      if (response.ok) {
        console.log("Login successful:", data);
        toast.success("Login successful!");
        onLogin?.(data.user);
      } else {
        // Map common auth failures to clearer messages
        const message =
          data?.error ||
          (response.status === 400 || response.status === 401
            ? "Invalid username, password, or role."
            : response.status === 403
            ? "You don't have permission to access this account."
            : "Login failed. Please try again.");
        toast.error(message);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error. Please check your connection and try again.");
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
