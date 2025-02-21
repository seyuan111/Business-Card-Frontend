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
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/20 relative">
          
          {/* Back Button */}
          <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-white hover:text-gray-400 transition">
            <BiArrowBack size={24} />
          </button>

          {/* Title */}
          <h2 className="text-4xl font-bold text-center mb-6">Create an Account</h2>

          {/* Signup Form */}
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

            {/* Username Input */}
            <div className="flex flex-col">
              <label className="font-medium">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="border border-white/30 bg-white/20 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <label className="font-medium">Password</label>
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

            {/* Confirm Password Input */}
            <div className="flex flex-col">
              <label className="font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="border border-white/30 bg-white/20 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-semibold transition shadow-md">
              Sign Up
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
