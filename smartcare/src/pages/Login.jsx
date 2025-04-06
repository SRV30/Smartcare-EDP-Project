import React, { useState } from "react";
import { loginPatient } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginPatient(formData);
      localStorage.setItem("smartcare_token", res.data.token);
      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
              SmartCare
            </h2>
            <p className="mt-2 text-sm text-gray-400">Secure Patient Login</p>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 peer"
              />
              <label className="absolute -top-2 left-3 px-1 text-xs text-gray-400 bg-gray-900 transition-all duration-200 peer-focus:text-sky-400">
                Email
              </label>
            </div>

            <div className="relative group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 peer pr-12"
              />
              <label className="absolute -top-2 left-3 px-1 text-xs text-gray-400 bg-gray-900 transition-all duration-200 peer-focus:text-sky-400">
                Password
              </label>
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-sky-400 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
          >
            Sign In
          </button>

          <div className="flex justify-between text-sm text-gray-400">
            <span
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer hover:text-sky-400 transition-colors duration-200"
            >
              Forgot Password?
            </span>
            <span
              onClick={() => navigate("/signup")}
              className="cursor-pointer hover:text-sky-400 transition-colors duration-200"
            >
              Create Account
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;