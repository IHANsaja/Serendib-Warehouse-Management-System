import { useState } from "react";
import { toast } from "react-toastify";
import { useLanguage } from "../../context/LanguageContext";

const LoginForm = ({ role, onLogin }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation with user-friendly toasts
    if (!username.trim() && !password.trim()) {
      toast.warn(t("login.toastEnterUsernamePassword"));
      return;
    }
    if (!username.trim()) {
      toast.warn(t("login.toastEnterUsername"));
      return;
    }
    if (!password.trim()) {
      toast.warn(t("login.toastEnterPassword"));
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
        toast.success(t("login.toastLoginSuccess"));
        onLogin?.(data.user);
      } else {
        // Map common auth failures to clearer messages
        const message =
          data?.error ||
          (response.status === 400 || response.status === 401
            ? toast.error(t("login.toastInvalidCredentials"))
            : response.status === 403
            ? toast.error(t("login.toastNoPermission"))
            : toast.error(t("login.toastLoginFailed")));
        toast.error(message);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(t("login.toastNetworkError"));
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
          placeholder={t("login.usernamePlaceholder")}
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
          placeholder={t("login.passwordPlaceholder")}
          className="peer w-full px-4 py-3 rounded-lg"
        />
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full py-3 bg-[var(--theme-yellow)] text-[var(--main-red)] font-semibold rounded-lg"
      >
        {t("login.loginButton")}
      </button>
    </form>
  );
};

export default LoginForm;
