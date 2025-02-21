import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navbar */}
      <NavBar />

      {/* Centered Content */}
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/20">
          <h2 className="text-4xl font-bold text-center mb-6">Welcome Back</h2>

          {/* Login Form */}
          <form className="space-y-6">
            {/* Email Input */}
            <div className="flex flex-col">
              <label className="font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-white/30 bg-white/20 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <label className="font-medium">Password</label>
                <Link to="/forgot-password" className="text-blue-400 text-sm hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="border border-white/30 bg-white/20 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-5 h-5 cursor-pointer accent-blue-500" />
              <label>Remember Me</label>
            </div>

            {/* Sign In Button */}
            <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-semibold transition shadow-md">
              Sign In
            </button>
          </form>

          {/* Signup Link */}
          <div className="text-center mt-6">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
