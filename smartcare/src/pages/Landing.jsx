import React, { useEffect } from "react";
import logo from '../assets/logo.jpg';
import { NavLink } from "react-router-dom";
const LandingPage = () => {
  useEffect(() => {
    // Fade in elements sequentially
    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('opacity-100');
        element.classList.remove('opacity-0');
      }, 300 * index);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 overflow-hidden">
      {/* Floating background circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-64 h-64 rounded-full bg-blue-500 opacity-10 blur-xl -top-20 -right-20"></div>
        <div className="absolute w-96 h-96 rounded-full bg-purple-500 opacity-10 blur-xl -bottom-40 -left-20"></div>
      </div>
      
      {/* Content with z-index to appear above background */}
      <div className="z-10 flex flex-col items-center w-full">
        <img 
          src={logo} 
          alt="Logo" 
          className="w-32 h-32 mx-auto mt-10 animate-fade-in opacity-0 transition-all duration-700 hover:scale-110 transform"
        />
        
        <div className="max-w-md w-full bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mt-8 text-center border border-gray-700 animate-fade-in opacity-0 transition-all duration-700">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Smart Care</h1>
          
          <p className="text-gray-300 mb-8 animate-fade-in opacity-0 transition-all duration-700">
            Monitor your health in real-time with our Smart Wearable integration.
            Take control of your wellness journey today.
          </p>
          <NavLink to="/login" className="w-full">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg w-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in opacity-0 flex items-center justify-center">
            <span>Get Started</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          </NavLink>
          
          <div className="flex justify-center space-x-6 mt-8 animate-fade-in opacity-0 transition-all duration-700">
            <div className="flex flex-col items-center">
              <div className="text-blue-400 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-blue-400 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">Fast</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-blue-400 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">Smart</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mt-6 animate-fade-in opacity-0 transition-all duration-700">
          © 2025 Smart Care. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;