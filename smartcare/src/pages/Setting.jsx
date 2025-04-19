import React, { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import {
  LogOut,
  User,
  Shield,
  Bell,
  Key,
  Settings as SettingsIcon,
  ChevronRight,
  Home,
  HelpCircle,
} from "lucide-react";
import LinkedCaregivers from "./SendLinkRequest";
import PendingRequests from "./PendingRequests";

const Setting = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("account");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* Header with nav for mobile */}
      <header className="bg-gray-900/90 backdrop-blur-sm border-b border-sky-900/30 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-sky-500 rounded-lg p-1.5 mr-3">
              <SettingsIcon size={18} className="text-black" />
            </div>
            <h1 className="text-xl font-bold text-sky-400">Settings</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden bg-gray-800 hover:bg-gray-700 rounded-lg p-2 text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? 
                  <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></> : 
                  <><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>
                }
              </svg>
            </button>
            <div className="flex items-center bg-gray-800 py-1.5 px-3 rounded-full">
              <div className="bg-sky-500 text-black font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-medium text-sm">
                {user.name}
                <span className="text-xs ml-1 text-sky-400">
                  ({user.role})
                </span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Introduction section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Account <span className="text-sky-400">Settings</span>
              </h1>
              <p className="text-gray-400 mt-2">
                Manage your SmartCare preferences and account details
              </p>
            </div>
          </div>

          {/* User Links */}
          {user.role === "patient" && (
            <div className="bg-gray-900 border border-sky-900/30 rounded-xl p-5 mb-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-sky-900/50 rounded-lg flex items-center justify-center mr-3">
                  <User size={18} className="text-sky-400" />
                </div>
                <h2 className="text-lg font-semibold text-sky-400">
                  Linked Caregivers
                </h2>
              </div>
              <LinkedCaregivers user={user} />
            </div>
          )}

          {(user.role === "caregiver" || user.role === "hospital") && (
            <div className="bg-gray-900 border border-sky-900/30 rounded-xl p-5 mb-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-sky-900/50 rounded-lg flex items-center justify-center mr-3">
                  <Bell size={18} className="text-sky-400" />
                </div>
                <h2 className="text-lg font-semibold text-sky-400">
                  Pending Requests
                </h2>
              </div>
              <PendingRequests user={user} />
            </div>
          )}
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm">
            <div className="h-full w-3/4 max-w-xs bg-gray-900 border-r border-gray-800 p-5">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="bg-sky-500 rounded-lg p-1.5 mr-2">
                    <SettingsIcon size={16} className="text-black" />
                  </div>
                  <h3 className="font-bold text-sky-400">Settings Menu</h3>
                </div>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <ul className="space-y-1">
                <li>
                  <a href="/" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg">
                    <Home size={18} className="text-gray-500" />
                    Dashboard
                  </a>
                </li>
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg transition-all ${
                        activeTab === tab.id
                          ? "bg-sky-950 text-sky-400"
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
                <li className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-all">
                    <LogOut size={18} className="text-gray-500" />
                    <LogoutButton />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar for desktop */}
          <div className="hidden md:block md:w-64 flex-shrink-0">
            <div className="bg-gray-900 rounded-xl border border-sky-900/30 overflow-hidden shadow-lg">
              <ul>
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 w-full px-4 py-3.5 text-left transition-all ${
                        activeTab === tab.id
                          ? "bg-sky-950 text-sky-400 border-l-4 border-sky-400"
                          : "hover:bg-gray-800 text-gray-300"
                      }`}
                    >
                      <span
                        className={`${
                          activeTab === tab.id
                            ? "text-sky-400"
                            : "text-gray-500"
                        } flex-shrink-0`}
                      >
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                      {activeTab === tab.id && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </button>
                  </li>
                ))}

                <li className="border-t border-gray-800">
                  <div className="flex items-center gap-3 px-4 py-3.5 text-gray-300 hover:bg-gray-800 transition-all">
                    <LogOut size={18} className="text-gray-500 flex-shrink-0" />
                    <LogoutButton />
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mt-6 bg-sky-900/20 border border-sky-900/30 rounded-xl p-4 shadow-lg">
              <div className="flex items-center mb-3">
                <HelpCircle size={18} className="text-sky-400 mr-2" />
                <h3 className="font-medium text-sky-400">Need Help?</h3>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Contact our support team for assistance with your account settings.
              </p>
              <a 
                href="#" 
                className="text-sm text-sky-400 hover:text-sky-300 flex items-center"
              >
                Support Center
                <ChevronRight size={14} className="ml-1" />
              </a>
            </div>
          </div>

          {/* Mobile tab selector */}
          <div className="md:hidden mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-sky-950 text-sky-400 border border-sky-900/50"
                      : "bg-gray-900 border border-gray-800 text-gray-300"
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
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-gray-900 rounded-xl border border-sky-900/30 p-5 sm:p-6 shadow-lg">
              {activeTab === "account" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-sky-400 flex items-center">
                    <User size={18} className="mr-2" />
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-800/80">
                      <h3 className="text-lg font-medium mb-4 text-white">
                        Profile Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-gray-400 text-sm mb-1.5">
                            Name
                          </label>
                          <input
                            type="text"
                            value={user.name}
                            disabled
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white capitalize focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1.5">
                            Role
                          </label>
                          <input
                            type="text"
                            value={user.role}
                            disabled
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white capitalize focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1.5">
                            Email
                          </label>
                          <input
                            type="email"
                            value={user.email || "user@example.com"}
                            disabled
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1.5">
                            Member Since
                          </label>
                          <input
                            type="text"
                            value="Feb 2025"
                            disabled
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700/50 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                          Cancel
                        </button>
                        <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors">
                          Edit Profile
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-800/80">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-lg font-medium text-white">
                            Session Management
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">
                            Sign out from your current session
                          </p>
                        </div>
                        <div>
                          <button className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg transition-colors">
                            <LogOut size={16} />
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
                  <h2 className="text-xl font-semibold mb-6 text-sky-400 flex items-center">
                    <Shield size={18} className="mr-2" />
                    Security Settings
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-800/80">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-lg font-medium text-white">Change Password</h3>
                          <p className="text-gray-400 text-sm mt-1">
                            Update your account password
                          </p>
                        </div>
                        <button className="bg-sky-600 hover:bg-sky-700 px-4 py-2.5 rounded-lg text-white transition-colors flex items-center">
                          <Key size={16} className="mr-2" />
                          Update Password
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-800/80">
                      <h3 className="text-lg font-medium mb-4 text-white">Two-Factor Authentication</h3>
                      <p className="text-gray-300 mb-4">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                        <div>
                          <p className="font-medium text-white">SMS Authentication</p>
                          <p className="text-gray-400 text-sm">Receive a code via text message</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-800/80">
                      <h3 className="text-lg font-medium mb-4 text-white">Login History</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                          <div>
                            <p className="font-medium text-white">Current Session</p>
                            <p className="text-gray-400 text-xs">April 19, 2025 • Chrome on Windows</p>
                          </div>
                          <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md">Active</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                          <div>
                            <p className="font-medium text-white">Previous Login</p>
                            <p className="text-gray-400 text-xs">April 15, 2025 • Safari on macOS</p>
                          </div>
                          <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-md">Ended</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-sky-400 flex items-center">
                    <Bell size={18} className="mr-2" />
                    Notification Preferences
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-800/80">
                      <h3 className="text-lg font-medium mb-4 text-white">Communication Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                          <div>
                            <h4 className="font-medium text-white">Email Notifications</h4>
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

                        <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                          <div>
                            <h4 className="font-medium text-white">SMS Notifications</h4>
                            <p className="text-gray-400 text-sm">
                              Receive updates via text message
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                          <div>
                            <h4 className="font-medium text-white">Health Alerts</h4>
                            <p className="text-gray-400 text-sm">
                              Get notified for critical health changes
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-800/80">
                      <h3 className="text-lg font-medium mb-4 text-white">Notification Frequency</h3>
                      <div className="space-y-3">
                        <div className="p-3 border border-gray-700 rounded-lg bg-gray-900">
                          <div className="flex items-center mb-3">
                            <input id="freq-real" name="notification-frequency" type="radio" defaultChecked className="h-4 w-4 text-sky-500 focus:ring-sky-400" />
                            <label htmlFor="freq-real" className="ml-2 text-white font-medium">Real-time</label>
                          </div>
                          <p className="text-xs text-gray-400 ml-6">Receive notifications as events occur</p>
                        </div>
                        
                        <div className="p-3 border border-gray-700 rounded-lg bg-gray-900">
                          <div className="flex items-center mb-3">
                            <input id="freq-hourly" name="notification-frequency" type="radio" className="h-4 w-4 text-sky-500 focus:ring-sky-400" />
                            <label htmlFor="freq-hourly" className="ml-2 text-white font-medium">Hourly digest</label>
                          </div>
                          <p className="text-xs text-gray-400 ml-6">Receive a summary every hour</p>
                        </div>
                        
                        <div className="p-3 border border-gray-700 rounded-lg bg-gray-900">
                          <div className="flex items-center mb-3">
                            <input id="freq-daily" name="notification-frequency" type="radio" className="h-4 w-4 text-sky-500 focus:ring-sky-400" />
                            <label htmlFor="freq-daily" className="ml-2 text-white font-medium">Daily digest</label>
                          </div>
                          <p className="text-xs text-gray-400 ml-6">Receive a daily summary of all notifications</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-sky-900/20 border border-sky-900/30 rounded-xl text-center text-sm text-gray-400">
              SmartCare Health Monitoring System • Version 2.4.1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;