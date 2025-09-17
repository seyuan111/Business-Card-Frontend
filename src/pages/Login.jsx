import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false, // Added for rememberMe functionality
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // Login request to backend
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/users/login`,
      {
        email: formData.email,
        password: formData.password,
      },
      { withCredentials: true } // Include cookies for desktop compatibility
    );

    if (response.data.success) {
      // Store token in localStorage for mobile compatibility
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // If user data is returned directly in login response, use it
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } else {
        // Fetch user data using /check-auth with both methods
        const token = response.data.token || localStorage.getItem("token");
        
        const userResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/check-auth`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}, // Add Authorization header for mobile
            withCredentials: true, // Keep cookies for desktop compatibility
          }
        );

        if (userResponse.data.success) {
          // Store user data in localStorage (excluding password)
          localStorage.setItem("user", JSON.stringify(userResponse.data.user));

          // Optionally adjust JWT cookie expiration based on rememberMe
          if (formData.rememberMe) {
            // Backend should set a longer-lived JWT cookie
            // This requires backend modification (see notes below)
          }

          // Redirect to a protected route
          navigate("/");
        } else {
          throw new Error("Failed to fetch user data");
        }
      }
    }
  } catch (err) {
    // Handle specific backend error messages
    const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
    setError(errorMessage);
    console.error("Login error:", err.response?.data || err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-[#e6f0fa] via-[#f9e6f0] to-[#e6f0fa] text-gray-700">
      <NavBar />
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mt-2">Login to Card-Ology</h2>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
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
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-600">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="border border-gray-300 bg-white p-3 w-full rounded-lg focus:ring-2 focus:ring-[#e63946] text-black"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 cursor-pointer accent-[#e63946]"
              />
              <label className="text-sm text-gray-600">Remember Me</label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-[#e63946] hover:bg-[#d62828] text-white rounded-lg text-lg font-semibold transition shadow-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
            <div className="text-center mt-4 flex justify-center items-center gap-1">
              <p>Forgot Password?</p>
              <Link to="/forgot-password" className="text-sm text-gray-500">
                <span className="text-[#e63946] hover:underline">Reset Password</span>
              </Link>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-[#e63946] font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;