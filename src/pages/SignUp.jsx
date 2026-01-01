import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";
import NavBar from "../components/NavBar";
import { isEmail } from "../utils/email";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");

  const valid = isEmail(formData.email);
  const emailError = formData.email && !valid ? "Please enter a valid email address." : "";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!valid) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setShowVerificationModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setVerificationError("");
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/verify-email`, {
        code: verificationCode,
      });

      if (response.data.success) {
        setShowVerificationModal(false);
        navigate("/");
      }
    } catch (err) {
      setVerificationError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b223f] to-[#0f172a] text-slate-50">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-12 top-12 h-64 w-64 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="absolute bottom-10 right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
      <NavBar />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Sign up</p>
                <h2 className="text-2xl font-bold text-white">Create your account</h2>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-100 hover:text-emerald-50"
              >
                <BiArrowBack /> Back
              </button>
            </div>

            {error && <p className="mb-4 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-100 border border-rose-300/30">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white autofill:bg-white/10 autofill:text-white autofill:border-white/10 autofill:shadow-[0_0_0_1000px_rgba(255,255,255,0.04)_inset] placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40 ${
                    emailError ? "border-rose-300/60" : "border-white/10 bg-white/10 focus:border-emerald-300/60"
                  }`}
                  required
                />
                {emailError && <p className="mt-1 text-xs text-rose-200">{emailError}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Create a password"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">Confirm</label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="text-xs font-semibold text-emerald-100 hover:text-emerald-50"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-emerald-500/50 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing up..." : "Create account"}
              </button>

              <div className="text-center text-sm text-slate-200/80">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-emerald-100 hover:text-emerald-50">
                  Log in
                </Link>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur hidden lg:flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Why join</p>
              <h3 className="mt-3 text-3xl font-bold text-white">Design, save, share.</h3>
              <p className="mt-3 text-slate-200/80">
                Keep your business cards in sync, export in seconds, and control who sees your latest details.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-200/80">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-emerald-100">Templates</p>
                <p className="mt-1 font-semibold text-white">Fresh drops weekly</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-emerald-100">Sync</p>
                <p className="mt-1 font-semibold text-white">Multi-device ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-bold text-white">Verify your email</h2>
            <p className="mt-2 text-sm text-slate-200/80">
              Enter the verification code we sent to your inbox to finish signing up.
            </p>
            {verificationError && (
              <p className="mt-3 rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                {verificationError}
              </p>
            )}
            <form onSubmit={handleVerificationSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">Verification code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="6-digit code"
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
                {loading ? "Verifying..." : "Verify"}
              </button>
              <button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
