import React, { useState } from "react";
import { loginPatient } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await loginPatient(formData);
      localStorage.setItem("smartcare_token", res.data.token);
      localStorage.setItem("smartcare_user", JSON.stringify(res.data.user)); 
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      setValidationErrors({
        form: err.response?.data?.message || "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="relative bg-black/80 backdrop-blur-sm shadow-2xl rounded-2xl p-10 w-full max-w-md border border-sky-500/20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-sky-500/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-sky-600/20 blur-3xl"></div>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Lock size={30} className="text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
              SmartCare
            </h2>
            <p className="mt-2 text-sm text-gray-400">Secure Patient Login</p>
          </div>

          {validationErrors.form && (
            <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/40 text-red-200 text-sm flex items-start">
              <div className="mr-2 mt-0.5">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span>{validationErrors.form}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                <Mail size={18} />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                value={formData.email}
                className={`w-full px-4 py-3 pl-10 bg-gray-900/80 border-2 ${
                  validationErrors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-800 focus:border-sky-500 focus:ring-sky-500/20"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-300`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <span className="mr-1">•</span> {validationErrors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                className={`w-full px-4 py-3 pl-10 pr-12 bg-gray-900/80 border-2 ${
                  validationErrors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-800 focus:border-sky-500 focus:ring-sky-500/20"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-300`}
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-sky-400 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <span className="mr-1">•</span> {validationErrors.password}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-sky-500/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/20"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Authenticating...</span>
              </div>
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            )}
          </button>

          <div className="flex justify-between text-sm text-gray-400">
            <span
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer hover:text-sky-400 transition-colors duration-200 flex items-center"
            >
              <span className="border-b border-transparent hover:border-sky-400">Forgot Password?</span>
            </span>
            <span
              onClick={() => navigate("/signup")}
              className="cursor-pointer hover:text-sky-400 transition-colors duration-200 flex items-center"
            >
              <span className="border-b border-transparent hover:border-sky-400">Create Account</span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;