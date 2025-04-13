import React, { useEffect } from "react";
import logo from "../assets/logo.jpg";
import { NavLink } from "react-router-dom";

const LandingPage = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-fade-in");
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("opacity-100");
        element.classList.remove("opacity-0");
      }, 200 * index);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 overflow-hidden">
      {/* Stylish background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* Sky blue accent elements */}
        <div className="absolute w-96 h-96 rounded-full bg-sky-500 opacity-10 blur-3xl -top-20 -right-20"></div>
        <div className="absolute w-96 h-96 rounded-full bg-sky-400 opacity-5 blur-2xl bottom-40 left-20"></div>
        <div className="absolute w-64 h-64 rounded-full bg-sky-600 opacity-10 blur-xl top-1/3 -left-20"></div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Content container */}
      <div className="z-10 flex flex-col items-center w-full max-w-4xl mx-auto">
        {/* Logo */}
        <img
          src={logo}
          alt="Smart Care"
          className="w-24 h-24 mx-auto mt-10 rounded-full shadow-lg shadow-sky-500/20 animate-fade-in opacity-0 transition-all duration-700 hover:scale-105 transform"
        />

        {/* Main content card */}
        <div className="w-full max-w-md bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mt-8 text-center border border-gray-800 animate-fade-in opacity-0 transition-all duration-700">
          {/* Title with gradient */}
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-sky-300 to-sky-500 text-transparent bg-clip-text">
            Smart Care
          </h1>

          {/* Tagline */}
          <p className="text-gray-300 mb-8 animate-fade-in opacity-0 transition-all duration-700">
            Monitor your health in real-time with our intelligent wearable
            technology. Take control of your wellness journey today.
          </p>

          {/* CTA Button */}
          <NavLink to="/login" className="w-full">
            <button className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-6 py-4 rounded-lg w-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/30 animate-fade-in opacity-0 flex items-center justify-center font-semibold">
              <span>Get Started</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </NavLink>

          {/* Feature icons */}
          <div className="flex justify-center space-x-12 mt-10 animate-fade-in opacity-0 transition-all duration-700">
            <div className="flex flex-col items-center group">
              <div className="text-sky-400 mb-2 p-3 rounded-full bg-gray-800 group-hover:bg-sky-500/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-300 group-hover:text-sky-300 transition-colors">
                Secure
              </span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="text-sky-400 mb-2 p-3 rounded-full bg-gray-800 group-hover:bg-sky-500/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-300 group-hover:text-sky-300 transition-colors">
                Fast
              </span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="text-sky-400 mb-2 p-3 rounded-full bg-gray-800 group-hover:bg-sky-500/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-300 group-hover:text-sky-300 transition-colors">
                Smart
              </span>
            </div>
          </div>
        </div>

        {/* Additional feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12 animate-fade-in opacity-0 transition-all duration-700">
          <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-sky-800 transition-all duration-300">
            <div className="text-sky-400 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Health Monitoring
            </h3>
            <p className="text-gray-400 text-sm">
              Track vitals and activity in real-time with advanced sensors
            </p>
          </div>

          <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-sky-800 transition-all duration-300">
            <div className="text-sky-400 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Smart Insights
            </h3>
            <p className="text-gray-400 text-sm">
              Receive personalized health recommendations based on your data
            </p>
          </div>

          <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-sky-800 transition-all duration-300 mb-10">
            <div className="text-sky-400 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Mobile Access
            </h3>
            <p className="text-gray-400 text-sm">
              Access your health dashboard anytime, anywhere on any device
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
