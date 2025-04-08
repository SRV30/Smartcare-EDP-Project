import React, { useState } from "react";
import { registerPatient } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ""
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
      
      // Navigate after toast shows
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 transition-all duration-300 hover:shadow-sky-500/10">
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-sky-500/20 mb-4">
            <svg className="w-8 h-8 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6m-3-3h6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create your account</h2>
          <p className="text-sky-300 text-sm">Join us to start your healthcare journey</p>
        </div>

        {validationErrors.form && (
          <div className="p-3 rounded-lg bg-red-900/40 border border-red-800 text-red-200 text-sm">
            {validationErrors.form}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                className={`w-full pl-10 pr-4 py-3 bg-gray-900 text-white rounded-lg border ${
                  validationErrors.name ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-sky-500"
                } focus:outline-none focus:ring-2 transition-all duration-200`}
                onChange={handleChange}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.name}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                className={`w-full pl-10 pr-4 py-3 bg-gray-900 text-white rounded-lg border ${
                  validationErrors.email ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-sky-500"
                } focus:outline-none focus:ring-2 transition-all duration-200`}
                onChange={handleChange}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full pl-10 pr-12 py-3 bg-gray-900 text-white rounded-lg border ${
                  validationErrors.password ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-sky-500"
                } focus:outline-none focus:ring-2 transition-all duration-200`}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.password}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:from-sky-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating your account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-sky-400 hover:text-sky-300 font-medium cursor-pointer transition-colors duration-200"
            >
              Sign in
            </span>
          </div>
        </form>

        <div className="pt-6 border-t border-gray-700">
          <p className="text-xs text-center text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-sky-400 hover:text-sky-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-sky-400 hover:text-sky-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;