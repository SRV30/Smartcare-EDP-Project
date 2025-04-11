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
  const [unlocked, setUnlocked] = useState(false); // 🔒 Lock state

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
      fetchData(); // Initial fetch
      const interval = setInterval(() => fetchData(), 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userId, fetchData, unlocked]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 space-y-6 text-white">
      {!unlocked ? (
        <div className="text-center space-y-4">
          <div className="text-xl sm:text-2xl font-bold text-yellow-300">
            ⚠️ Please wear the SmartCare watch properly!
          </div>
          <button
            onClick={() => setUnlocked(true)}
            className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 transition rounded-lg text-white font-semibold shadow"
          ></button>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-sky-400">
            📡 Real-time Health Stream
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow w-full max-w-md text-center space-y-2">
            <div className="text-lg font-medium text-sky-300">
              📊 Average Values:
            </div>
            <div>
              ❤️ Avg Heart Rate:{" "}
              <span className="text-red-400">{avg.heartRate}</span> bpm
            </div>
            <div>
              🫁 Avg SpO2: <span className="text-blue-400">{avg.spo2}</span> %
            </div>
            <div>
              🌡️ Avg Temperature:{" "}
              <span className="text-orange-400">{avg.temperature}</span> °C
            </div>
          </div>

          <HealthChart stream={stream} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
