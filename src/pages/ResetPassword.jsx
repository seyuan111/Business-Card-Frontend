import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import { BiArrowBack } from "react-icons/bi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/reset-password/${token}`,
        { password: formData.password },
        { withCredentials: true }
      );

      setSuccess(response.data.message || "Password reset successfully. You can now log in.");
      setFormData({ password: "", confirmPassword: "" });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
      console.log("Reset password error:", err.response?.data || err);
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
      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Secure reset</p>
              <h2 className="text-2xl font-bold text-white">Set a new password</h2>
              <p className="mt-2 text-sm text-slate-200/80">Choose a strong password to protect your account.</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-emerald-100 hover:text-emerald-50"
            >
              <BiArrowBack /> Back
            </button>
          </div>

          {error && <p className="mb-3 rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">{error}</p>}
          {success && <p className="mb-3 rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-50">{success}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">New password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-emerald-500/50 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>

            <div className="flex flex-col items-center gap-1 text-sm text-slate-200/80 sm:flex-row sm:justify-between">
              <Link to="/login" className="font-semibold text-emerald-100 hover:text-emerald-50">
                Back to login
              </Link>
              <Link to="/signup" className="font-semibold text-emerald-100 hover:text-emerald-50">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
