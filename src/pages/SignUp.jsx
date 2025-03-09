import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import NavBar from "../components/NavBar";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-[#e6f0fa] via-[#f9e6f0] to-[#e6f0fa] text-gray-700">
      {/* Navbar */}
      <NavBar />

      {/* Centered Content */}
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200 relative">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 transition"
          >
            <BiArrowBack size={24} />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mt-2">Sign In to Card-Ology</h2>
            </div>
          </div>

          {/* Signup Form */}
          <form className="space-y-4">
            {/* Username or Email Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Username or Email Address</label>
              <input
                type="text"
                placeholder="Enter your username or email"
                className="border border-gray-300 bg-white p-3 w-full rounded-lg focus:ring-2 focus:ring-[#e63946] text-black"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Password</label>
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

            {/* Confirm Password Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="border border-gray-300 bg-white p-3 w-full rounded-lg focus:ring-2 focus:ring-[#e63946] text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#e63946] hover:bg-[#d62828] text-white rounded-lg text-lg font-semibold transition shadow-md"
            >
              Sign Up
            </button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
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

export default Signup;