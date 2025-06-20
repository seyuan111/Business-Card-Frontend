import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import { BiArrowBack } from "react-icons/bi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
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

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/forgot-password`,
        {
          email: formData.email,
        },
        { withCredentials: true } // Include cookies if needed
      );

      setSuccess(response.data.message || "Password reset email sent. Please check your inbox.");
      setFormData({ email: "" }); // Clear form
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send password reset email.");
      console.error("Forgot password error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-[#e6f0fa] via-[#f9e6f0] to-[#e6f0fa] text-gray-700">
      <NavBar />
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 transition"
          >
            <BiArrowBack size={24} />
          </button>
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mt-2">Reset Your Password</h2>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email address to receive a password reset link.
              </p>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="border border-gray-300 bg-white p-3 w-full rounded-lg focus:ring-2 focus:ring-[#e63946] text-black"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-[#e63946] hover:bg-[#d62828] text-white rounded-lg text-lg font-semibold transition shadow-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Back to{" "}
                <Link to="/login" className="text-[#e63946] font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;