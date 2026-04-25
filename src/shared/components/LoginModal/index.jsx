import { useState } from "react";
import { api } from "../../../api/backend";

function LoginModal({ isOpen, onClose, onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      setError("");
      const res = await api.login({ email, password });
      
      if (res.token) {
        localStorage.setItem("token", res.token);
        if (res.user && res.user.username) {
            localStorage.setItem("username", res.user.username);
        }
        if (onLogin) onLogin();
        onClose();
        window.location.reload();
      } else {
        setError(res.error || res.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      {/* modal box */}
      <div className="bg-[#111] text-white w-[320px] p-6 rounded-xl shadow-lg relative">

        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {/* title */}
        <h2 className="text-xl font-bold mb-4 text-center">
          Login
        </h2>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        {/* inputs */}
        <div className="flex flex-col gap-3">
          <input 
            className="p-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-rose-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="p-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-rose-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* login button */}
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="bg-rose-500 hover:bg-rose-600 py-2 rounded font-semibold mt-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* signup text */}
        <p className="text-sm text-gray-400 mt-4 text-center">
          No account?{" "}
          <span 
            className="text-rose-400 cursor-pointer hover:underline"
            onClick={onSwitchToRegister}
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;