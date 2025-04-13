import React, { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import {
  LogOut,
  User,
  Shield,
  Bell,
  Key,
  Settings as SettingsIcon,
} from "lucide-react";
import LinkedCaregivers from "./SendLinkRequest";
import PendingRequests from "./PendingRequests";

const Setting = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcare_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-sky-400 mb-4"></div>
          <div className="h-4 w-24 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "account", label: "Account", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-400 mt-2">
                Manage your SmartCare preferences and account details
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-800 p-2 rounded-full">
                <SettingsIcon size={22} className="text-sky-400" />
              </div>
              <div className="flex items-center bg-gray-800 p-1 pr-4 rounded-full">
                <div className="bg-sky-500 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center mr-2">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">
                  {user.name}
                  <span className="text-xs ml-1 text-sky-400">
                    ({user.role})
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* User Links */}
          {user.role === "patient" && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 mb-8">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">
                Linked Caregivers
              </h2>
              <LinkedCaregivers user={user} />
            </div>
          )}

          {(user.role === "caregiver" || user.role === "hospital") && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 mb-8">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">
                Pending Requests
              </h2>
              <PendingRequests user={user} />
            </div>
          )}
        </div>

        <div className="flex gap-8">
          <div className="w-64">
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <ul>
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-all ${
                        activeTab === tab.id
                          ? "bg-sky-950 text-sky-400 border-l-4 border-sky-400"
                          : "hover:bg-gray-800 text-gray-300"
                      }`}
                    >
                      <span
                        className={
                          activeTab === tab.id
                            ? "text-sky-400"
                            : "text-gray-500"
                        }
                      >
                        {tab.icon}
                      </span>
                      {tab.label}
                    </button>
                  </li>
                ))}

                <li className="border-t border-gray-800">
                  <div className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 transition-all">
                    <LogOut size={18} className="text-gray-500" />
                    <LogoutButton />
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-gray-900 rounded-lg border border-gray-800 p-6">
            {activeTab === "account" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-sky-400">
                  Account Settings
                </h2>

                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3">
                      Profile Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={user.name}
                          disabled
                          className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white capitalize"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          value={user.role}
                          disabled
                          className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white capitalize"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium">
                          Session Management
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Sign out from your current session
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button className="flex items-center gap-2  px-4 py-2 rounded-md text-white transition-colors">
                          <LogoutButton />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-sky-400">
                  Security Settings
                </h2>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <p className="text-gray-400 text-sm">
                        Update your account password
                      </p>
                    </div>
                    <button className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-md text-white transition-colors">
                      <Key size={16} className="inline mr-2" />
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-sky-400">
                  Notification Preferences
                </h2>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-gray-400 text-sm">
                          Receive updates via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-gray-400 text-sm">
                          Receive updates via text message
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
