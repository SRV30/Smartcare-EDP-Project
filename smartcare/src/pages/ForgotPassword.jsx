import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Password reset link sent to your email");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="relative bg-black/80 backdrop-blur-sm shadow-2xl rounded-2xl p-10 w-full max-w-md border border-sky-500/20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-sky-500/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-blue-600/20 blur-3xl"></div>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <KeyRound size={28} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your email to receive a password reset link
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <div className="relative">
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                <Mail size={18} />
              </div>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 pl-10 bg-gray-900/80 border-2 border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
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
                <span>Sending...</span>
              </div>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
          
          <div className="text-center text-sm text-gray-400">
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer hover:text-sky-400 transition-colors duration-200 flex items-center justify-center"
            >
              <span className="border-b border-transparent hover:border-sky-400">Back to Login</span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;