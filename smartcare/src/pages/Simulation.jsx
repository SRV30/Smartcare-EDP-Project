import React, { useEffect, useState, useCallback } from "react";
import HealthChart from "./HealthChart";
import { simulateHealthData } from "../api/auth";

const Dashboard = () => {
  const [stream, setStream] = useState([]);
  const [avg, setAvg] = useState({
    heartRate: "-",
    spo2: "-",
    temperature: "-",
  });
  const [userId, setUserId] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcare_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const mappedUser = {
        ...parsed,
        _id: parsed._id || parsed.id,
      };
      setUserId(mappedUser._id);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await simulateHealthData(userId);
      setStream(data.stream);
      setAvg(data.average);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && unlocked) {
      fetchData();
      const interval = setInterval(() => fetchData(), 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userId, fetchData, unlocked]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 text-white">
      {!unlocked ? (
        <div className="bg-gray-800/80 backdrop-blur p-8 rounded-xl shadow-2xl text-center max-w-md mx-auto border border-gray-700">
          <div className="rounded-full bg-yellow-500/20 w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Connection Required
          </h2>
          <p className="text-gray-300 mb-6">
            Please ensure your SmartCare watch is properly worn and within range
            for accurate monitoring.
          </p>
          <button
            onClick={() => setUnlocked(true)}
            className="w-5 py-3 bg-gray-900 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          ></button>
        </div>
      ) : (
        <div className="w-full max-w-5xl space-y-8">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Health Dashboard
              </h1>
              <p className="text-blue-400 mt-1">Real-time monitoring system</p>
            </div>
            <div className="mt-4 sm:mt-0 bg-blue-500/20 px-4 py-2 rounded-full flex items-center">
              <span className="animate-pulse mr-2 h-3 w-3 rounded-full bg-blue-400"></span>
              <span className="text-blue-300 text-sm">Live Data</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-700/50 flex flex-col items-center">
              <div className="rounded-full bg-red-500/20 w-12 h-12 flex items-center justify-center mb-3">
                <span className="text-xl">❤️</span>
              </div>
              <h3 className="text-gray-400 font-medium mb-1">Heart Rate</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-red-400">
                  {avg.heartRate}
                </span>
                <span className="text-gray-400 ml-2">bpm</span>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-700/50 flex flex-col items-center">
              <div className="rounded-full bg-blue-500/20 w-12 h-12 flex items-center justify-center mb-3">
                <span className="text-xl">🫁</span>
              </div>
              <h3 className="text-gray-400 font-medium mb-1">
                Oxygen Saturation
              </h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-blue-400">
                  {avg.spo2}
                </span>
                <span className="text-gray-400 ml-2">%</span>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-700/50 flex flex-col items-center">
              <div className="rounded-full bg-orange-500/20 w-12 h-12 flex items-center justify-center mb-3">
                <span className="text-xl">🌡️</span>
              </div>
              <h3 className="text-gray-400 font-medium mb-1">Temperature</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-orange-400">
                  {avg.temperature}
                </span>
                <span className="text-gray-400 ml-2">°C</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-700/50 mb-50">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-2">📊</span>
              Health Metrics Timeline
            </h2>
            <div className="h-80">
              <HealthChart stream={stream} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
