import { useState } from "react";
import { api } from "../../../api/backend";

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      setError("");
      const res = await api.register({ username, email, password });
      
      if (res.token || res.message === "User created") {
        if(res.token) {
           localStorage.setItem("token", res.token);
           window.location.reload();
        } else {
           // wait for login or just switch to login
           alert("Registered! Please login.");
           onSwitchToLogin();
        }
      } else {
        setError(res.error || res.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#111] text-white w-[320px] p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <div className="flex flex-col gap-3">
          <input
            className="p-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-rose-500"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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

          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-rose-500 hover:bg-rose-600 py-2 rounded font-semibold mt-2 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-rose-400 cursor-pointer hover:underline"
            onClick={onSwitchToLogin}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterModal;
