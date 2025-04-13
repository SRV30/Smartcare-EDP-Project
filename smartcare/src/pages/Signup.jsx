import React, { useState } from "react";
import { registerPatient } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, UserPlus, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!formData.role) {
      errors.role = "Role is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await registerPatient(formData);

      toast.success("🎉 " + (res.data.message || "Registration successful!"));
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      toast.error("❌ " + errorMessage);
      setValidationErrors({ form: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="relative bg-black/80 backdrop-blur-sm shadow-2xl rounded-2xl p-10 w-full max-w-md border border-sky-500/20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-sky-500/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-blue-600/20 blur-3xl"></div>
        
        <div className="text-center space-y-2 relative z-10">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <UserPlus size={28} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
            Join SmartCare
          </h2>
          <p className="text-sm text-gray-400">Create your account to get started</p>
        </div>

        {validationErrors.form && (
          <div className="mt-6 p-4 rounded-lg bg-red-900/20 border border-red-500/40 text-red-200 text-sm flex items-start">
            <div className="mr-2 mt-0.5">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span>{validationErrors.form}</span>
          </div>
        )}

        <form className="space-y-6 mt-8 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="relative">
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                <User size={18} />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                className={`w-full px-4 py-3 pl-10 bg-gray-900/80 border-2 ${
                  validationErrors.name 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-800 focus:border-sky-500 focus:ring-sky-500/20"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-300`}
                onChange={handleChange}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <span className="mr-1">•</span> {validationErrors.name}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                <Mail size={18} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                className={`w-full px-4 py-3 pl-10 bg-gray-900/80 border-2 ${
                  validationErrors.email 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-800 focus:border-sky-500 focus:ring-sky-500/20"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-300`}
                onChange={handleChange}
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
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full px-4 py-3 pl-10 pr-12 bg-gray-900/80 border-2 ${
                  validationErrors.password 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-800 focus:border-sky-500 focus:ring-sky-500/20"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-300`}
                onChange={handleChange}
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

            <div className="relative">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 pl-4 pr-10 bg-gray-900/80 border-2 ${
                  validationErrors.role 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-800 focus:border-sky-500 focus:ring-sky-500/20"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-300 appearance-none`}
              >
                <option value="patient">Patient</option>
                <option value="caregiver">Caregiver</option>
                <option value="hospital">Hospital</option>
                <option value="admin">Admin</option>
              </select>
              {validationErrors.role && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <span className="mr-1">•</span> {validationErrors.role}
                </p>
              )}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
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
                <span>Creating Account...</span>
              </div>
            ) : (
              <>
                <UserPlus size={20} />
                <span>Create Account</span>
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-sky-400 hover:text-sky-300 font-medium cursor-pointer transition-colors duration-200 border-b border-transparent hover:border-sky-400"
            >
              Sign in
            </span>
          </div>
        </form>

        <div className="pt-6 mt-6 border-t border-gray-800/50 relative z-10">
          <p className="text-xs text-center text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-sky-400 hover:text-sky-300 border-b border-transparent hover:border-sky-400 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-sky-400 hover:text-sky-300 border-b border-transparent hover:border-sky-400 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;