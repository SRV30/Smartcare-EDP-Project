import React from "react";
import { NavLink } from "react-router-dom";

const FooterNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 text-white flex justify-around items-center h-16 z-50">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm ${
            isActive ? "text-sky-400" : "text-gray-400"
          }`
        }
      >
        <span>🏠</span>
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm ${
            isActive ? "text-sky-400" : "text-gray-400"
          }`
        }
      >
        <span>👤</span>
        <span>My Profile</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center text-sm ${
            isActive ? "text-sky-400" : "text-gray-400"
          }`
        }
      >
        <span>⚙️</span>
        <span>Settings</span>
      </NavLink>
    </div>
  );
};

export default FooterNavbar;
