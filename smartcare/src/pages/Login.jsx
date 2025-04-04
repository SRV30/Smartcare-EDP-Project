import React, { useState } from "react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading for demo purposes
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800">
      {/* Mobile status bar */}
      
      
      {/* App content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* App icon/logo */}
        
        
        <div className="w-full max-w-sm p-6 bg-white rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-1">Smart Care</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Login to your health companion</p>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input 
                type="email" 
                className="w-full pl-10 pr-3 py-4 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" 
                placeholder="Email address" 
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                type="password" 
                className="w-full pl-10 pr-3 py-4 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" 
                placeholder="Password" 
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:opacity-90 transition shadow-lg flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <div className="flex justify-center space-x-4">
             
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium hover:text-blue-500">
            Sign up
          </a>
        </p>
        
        {/* Home indicator for iOS feel */}
        <div className="w-32 h-1 bg-gray-300 rounded-full mt-auto mb-2"></div>
      </div>
    </div>
  );
};

export default Login;