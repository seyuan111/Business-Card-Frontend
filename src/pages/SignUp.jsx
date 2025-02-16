import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import NavBar from "../components/NavBar";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="w-full flex flex-col justify-center items-center min-h-screen relative p-4">

        {/* Signup Form */}
        <div className="bg-neutral-600 mt-20 p-6 md:p-10 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto relative">
          {/* Back Button */}
          <BiArrowBack
            onClick={() => navigate(-1)}
            className="cursor-pointer text-[20px] text-white"
          />

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-white mb-6">Sign Up</h2>

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

            {/* Username Input */}
            <div className="flex flex-col">
              <label className="text-white font-medium">Username:</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="border bg-gray-100 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <label className="text-white font-medium">Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="border bg-gray-100 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col">
              <label className="text-white font-medium">Confirm Password:</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="border bg-gray-100 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button className="w-full py-3 border-2 hover:bg-black text-white rounded-md text-lg font-semibold transition">
              Sign Up
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-white">
              Already have an account? {" "}
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