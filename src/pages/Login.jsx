import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-[#e6f0fa] via-[#f9e6f0] to-[#e6f0fa] text-gray-700">
      {/* Navbar */}
      <NavBar />

      {/* Centered Content */}
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mt-2">Login to Card-Ology</h2>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-4">
            {/* Username or Email Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Email Address</label>
              <input
                type="text"
                placeholder="Enter your email"
                className="border border-gray-300 bg-white p-3 w-full rounded-lg focus:ring-2 focus:ring-[#e63946] text-black"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-600">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="border border-gray-300 bg-white p-3 w-full rounded-lg focus:ring-2 focus:ring-[#e63946] text-black"
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4 cursor-pointer accent-[#e63946]" />
              <label className="text-sm text-gray-600">Remember Me</label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#e63946] hover:bg-[#d62828] text-white rounded-lg text-lg font-semibold transition shadow-md"
            >
              Log In
            </button>

            {/* Forgot Password Link */}
            <div className="text-center mt-4">
              <Link to="/forgot-password" className="text-sm text-gray-500 hover:underline">
                Lost your password? <span className="text-[#e63946]">Go to</span>
              </Link>
            </div>

            {/* Signup Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
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
