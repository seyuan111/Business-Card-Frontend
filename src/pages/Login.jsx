import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col">
    {/* Navbar */}
    <NavBar />

    {/* Main Content */}
    <div className="w-full flex flex-col justify-center items-center min-h-screen relative p-4">

      {/* Login Box */}
      <div className="bg-neutral-700 mt-20 p-6 md:p-10 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto relative">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Log in</h2>

        {/* Form */}
        <form className="space-y-4">
          {/* Email Input */}
          <div className="flex flex-col">
            <label className="text-white font-medium">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border bg-gray-100 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input + Forgot Password */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <label className="text-white font-medium">Password:</label>
              <Link to="/forgot-password" className="text-blue-400 text-sm hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="border bg-gray-100 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-700"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4 cursor-pointer" />
            <label className="text-white">Remember Me</label>
          </div>

          {/* Submit Button */}
          <button className="w-full py-3 border-2 hover:bg-black text-white rounded-md text-lg font-semibold transition">
            Sign In
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-4">
          <p className="text-white">
            Don't have an account? {" "}
            <Link to="/signup" className="text-blue-400 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login