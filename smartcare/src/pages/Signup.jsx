import React from "react";

const Signup = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-blue-100">
      <div className="w-full max-w-sm p-15 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
        <p className="text-gray-500 text-center mb-6">Join Smart Care today</p>

        <form className="space-y-2  ">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
              placeholder="Enter your name" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
              placeholder="Enter your email" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
              placeholder="Create a password" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">Already have an account?</p>
        <a href="/login" className="block text-center text-blue-500 font-medium mt-2">
        <button 
          className="w-full mt-2 border border-blue-500 text-blue-500 p-3 rounded-lg hover:bg-blue-100 transition"
        >
          Login
        </button>
        </a>
      </div>
    </div>
  );
};

export default Signup;
