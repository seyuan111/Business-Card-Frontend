import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/");
        } else {
          const token = response.data.token || localStorage.getItem("token");
          const userResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/users/check-auth`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
              withCredentials: true,
            }
          );

          if (userResponse.data.success) {
            localStorage.setItem("user", JSON.stringify(userResponse.data.user));
            navigate("/");
          } else {
            throw new Error("Failed to fetch user data");
          }
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b223f] to-[#0f172a] text-slate-50">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
      <NavBar />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="hidden lg:flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Welcome back</p>
            <h1 className="mt-3 text-3xl font-bold text-white">Log in to Card-Ology</h1>
            <p className="mt-3 text-slate-200/80">
              Access your saved cards, keep designs synced, and manage your profile from one place.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-200/80">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-emerald-100">Secure</p>
                <p className="mt-1 font-semibold text-white">Encrypted sessions</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-emerald-100">Fast</p>
                <p className="mt-1 font-semibold text-white">1-click resume</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Sign in</p>
                <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              </div>
              <Link to="/signup" className="text-sm font-semibold text-emerald-100 hover:text-emerald-50">
                Need an account?
              </Link>
            </div>

            {error && <p className="mb-4 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-100 border border-rose-300/30">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-xs font-semibold text-emerald-100 hover:text-emerald-50"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-200/80">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-300/60"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-emerald-100 hover:text-emerald-50">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-emerald-500/50 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>

              <div className="text-center text-sm text-slate-200/80">
                <span>New here?</span>{" "}
                <Link to="/signup" className="font-semibold text-emerald-100 hover:text-emerald-50">
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
