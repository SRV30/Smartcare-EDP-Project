import React, { useState } from "react";
import { loginPatient } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
              SmartCare
            </h2>
            <p className="mt-2 text-sm text-gray-400">Secure Patient Login</p>
          </div>

          {validationErrors.form && (
            <div className="p-3 rounded-lg bg-red-900/40 border border-red-800 text-red-200 text-sm">
              {validationErrors.form}
            </div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                value={formData.email}
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  validationErrors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-700 focus:ring-sky-500"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                className={`w-full px-4 py-3 pr-12 bg-gray-800 border ${
                  validationErrors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-700 focus:ring-sky-500"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-sky-400 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.password}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Logging in...
              </div>
            ) : (
              "Sign In"
            )}
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
