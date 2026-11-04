// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthLayout, {
  fieldClass,
  labelClass,
  errorClass,
  submitClass,
} from "../components/AuthLayout";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (event) =>
    setForm({ ...form, [key]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || "Could not create account, try again.");
      if (Array.isArray(data?.errors)) {
        const mapped = {};
        data.errors.forEach((e) => {
          if (!mapped[e.field]) mapped[e.field] = e.message;
        });
        setFieldErrors(mapped);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Athlete Account"
      subtitle="Join Prolane to shop elite sports equipment, track orders, and save more."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-black text-accent-600 hover:underline">
            Log in
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
          <label htmlFor="signup-name" className={labelClass}>Full Name</label>
          <input
            id="signup-name"
            type="text"
            value={form.name}
            onChange={update("name")}
            placeholder="Alex Fernandes"
            autoComplete="name"
            required
            className={fieldClass}
          />
          {fieldErrors.name && <p className={errorClass}>{fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="signup-email" className={labelClass}>Email Address</label>
          <input
            id="signup-email"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="athlete@example.com"
            autoComplete="email"
            required
            className={fieldClass}
          />
          {fieldErrors.email && <p className={errorClass}>{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="signup-password" className={labelClass}>Password</label>
          <input
            id="signup-password"
            type="password"
            value={form.password}
            onChange={update("password")}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            required
            className={fieldClass}
          />
          {fieldErrors.password && <p className={errorClass}>{fieldErrors.password}</p>}
        </div>

        <button type="submit" disabled={loading} className={submitClass}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Signup;