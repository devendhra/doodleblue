// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthLayout, {
  fieldClass,
  labelClass,
  submitClass,
} from "../components/AuthLayout";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (event) =>
    setForm({ ...form, [key]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not log in, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to your Prolane account to continue shopping professional gear."
      footer={
        <>
          New to Prolane?{" "}
          <Link to="/signup" className="font-black text-accent-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-2xl border border-danger-300 bg-danger-50 px-4 py-3 text-xs font-bold text-danger-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="login-email" className={labelClass}>Email Address</label>
          <input
            id="login-email"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="athlete@example.com"
            autoComplete="email"
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="login-password" className={labelClass}>Password</label>
          <input
            id="login-password"
            type="password"
            value={form.password}
            onChange={update("password")}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className={fieldClass}
          />
        </div>

        <button type="submit" disabled={loading} className={submitClass}>
          {loading ? "Authenticating..." : "Log In"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;