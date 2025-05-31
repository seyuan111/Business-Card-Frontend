import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";
import NavBar from "../components/NavBar";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5555/users/register", {
        email: formData.email,
        password: formData.password,
      });

      // Store JWT token in localStorage
      localStorage.setItem("token", response.data.token);

      // Optionally store user data
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to a protected route or home
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
              <h2 className="text-2xl font-bold text-gray-600 mt-2">Sign Up to Card-Ology</h2>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
              <label className="text-sm font-medium text-gray-600">Password</label>
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
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="border border-gray-300 bg-white p-3 w-full rounded-lg focus:ring-2 focus:ring-[#e63946] text-black"
                  required
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
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-[#e63946] hover:bg-[#d62828] text-white rounded-lg text-lg font-semibold transition shadow-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
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