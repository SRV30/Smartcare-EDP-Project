import React from "react";
import { NavLink } from "react-router-dom";
import { Home, User, Settings } from "lucide-react";

const FooterNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-sky-500/20 text-white flex justify-around items-center h-16 z-50 px-2 shadow-lg shadow-black/50">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-full py-1 rounded-lg transition-all duration-300 ${
            isActive 
              ? "text-sky-400 bg-sky-900/20" 
              : "text-gray-400 hover:text-sky-300 hover:bg-gray-800/40"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Home 
              size={20} 
              className={`mb-1 ${isActive ? 'stroke-sky-400' : 'stroke-gray-400'}`} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className="text-xs font-medium">Home</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-full py-1 rounded-lg transition-all duration-300 ${
            isActive 
              ? "text-sky-400 bg-sky-900/20" 
              : "text-gray-400 hover:text-sky-300 hover:bg-gray-800/40"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <User 
              size={20} 
              className={`mb-1 ${isActive ? 'stroke-sky-400' : 'stroke-gray-400'}`} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className="text-xs font-medium">Profile</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-full py-1 rounded-lg transition-all duration-300 ${
            isActive 
              ? "text-sky-400 bg-sky-900/20" 
              : "text-gray-400 hover:text-sky-300 hover:bg-gray-800/40"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Settings 
              size={20} 
              className={`mb-1 ${isActive ? 'stroke-sky-400' : 'stroke-gray-400'}`} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className="text-xs font-medium">Settings</span>
          </>
        )}
      </NavLink>
    </div>
  );
};

export default FooterNavbar;