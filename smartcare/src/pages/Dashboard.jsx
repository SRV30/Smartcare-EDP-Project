import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";
import { BarChart, Clock, Map, Heart, Activity, Thermometer } from "lucide-react";
import { simulateHealthData } from "../api/auth";

const Dashboard = () => {
  const [data, setData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [readableLocation, setReadableLocation] = useState("Fetching location...");
  // eslint-disable-next-line no-unused-vars
  const [stream, setStream] = useState([]);
  const [userId, setUserId] = useState(null);
  const [avg, setAvg] = useState({
    heartRate: "-",
    spo2: "-",
    temperature: "-",
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcare_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const mappedUser = {
        ...parsed,
        _id: parsed._id || parsed.id,
      };
      setUserId(mappedUser._id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const { data } = await simulateHealthData(userId);
      setStream(data.stream);
      setAvg(data.average);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to fetch health data:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchLocationName = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setReadableLocation(data.display_name);
    } catch (err) {
      console.error("Error fetching location name:", err);
      setReadableLocation("Location unavailable");
    }
  };

  const calculateHealthScore = () => {
    if (!data) return "Calculating...";
    let score = 0;

    if (data.heartRate >= 60 && data.heartRate <= 100) score += 30;
    else if (data.heartRate > 50 && data.heartRate < 110) score += 15;

    if (data.spo2 >= 95) score += 40;
    else if (data.spo2 >= 90) score += 20;

    if (data.temperature >= 36.1 && data.temperature <= 37.2) score += 30;
    else if (data.temperature >= 35.5 && data.temperature <= 38) score += 15;

    return `${score} / 100`;
  };

  const getHealthMessage = () => {
    const score = parseInt(calculateHealthScore());
    if (isNaN(score)) return "Awaiting data...";
    if (score >= 85) return "🟢 Excellent";
    if (score >= 60) return "🟡 Moderate";
    return "🔴 Needs Attention";
  };

  const getHealthScoreColor = () => {
    const score = parseInt(calculateHealthScore());
    if (isNaN(score)) return "text-gray-400";
    if (score >= 85) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/health-data");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching health data:", err);
      }
    };

    const fetchLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            setLocation({ lat, lon });
            await fetchLocationName(lat, lon);
          },
          (err) => {
            console.error("Location error:", err);
            setReadableLocation("Location permission denied");
          }
        );
      } else {
        setReadableLocation("Geolocation not supported");
      }
    };

    fetchHealthData();
    fetchLocation();
    fetchData();
    const interval = setInterval(fetchData, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, [fetchData]);

  const vitalCards = [
    {
      label: "Heart Rate",
      value: avg.heartRate ? `${avg.heartRate} bpm` : "Loading...",
      icon: <Heart className="text-rose-400" size={22} />,
      color: "from-rose-500/20 to-rose-500/5",
    },
    { 
      label: "Blood Oxygen (SpO2)", 
      value: avg.spo2 ? `${avg.spo2}%` : "Loading...",
      icon: <Activity className="text-blue-400" size={22} />,
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      label: "Body Temperature",
      value: avg.temperature ? `${avg.temperature} °C` : "Loading...",
      icon: <Thermometer className="text-amber-400" size={22} />,
      color: "from-amber-500/20 to-amber-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top navigation bar */}
      <header className="bg-gray-900 px-6 py-4 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="text-sky-400" size={28} />
            <h1 className="text-2xl font-bold text-sky-400">SmartCare</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-1">Health Dashboard</h2>
          <p className="text-gray-400">
            Monitor your vital signs and health metrics in real-time
          </p>
        </div>

        {/* Vital signs section */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Vital Signs</h3>
            <div className="ml-auto flex items-center text-sm text-gray-400">
              <Clock size={16} className="mr-2" />
              <span>Last updated: {lastUpdated || "N/A"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vitalCards.map((item, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${item.color} border border-gray-800 rounded-2xl shadow-lg overflow-hidden`}
              >
                <div className="bg-gray-900/90 backdrop-blur-sm p-6">
                  <div className="flex items-center mb-3">
                    {item.icon}
                    <h4 className="text-lg font-medium text-gray-200 ml-2">{item.label}</h4>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {loading ? <span className="text-gray-500">Loading...</span> : item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Location and Health Score section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Location card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 p-6">
              <div className="flex items-center mb-4">
                <Map className="text-indigo-400" size={22} />
                <h3 className="text-lg font-medium text-gray-200 ml-2">Current Location</h3>
              </div>
              <p className="text-sm text-gray-300 line-clamp-2">{readableLocation}</p>
            </div>
          </div>

          {/* Health Score card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-6">
              <div className="flex items-center mb-4">
                <BarChart className="text-emerald-400" size={22} />
                <h3 className="text-lg font-medium text-gray-200 ml-2">Health Score</h3>
              </div>
              <div className="flex items-end">
                <p className={`text-4xl font-bold ${getHealthScoreColor()}`}>{calculateHealthScore()}</p>
                <p className="text-sm text-gray-400 ml-3 mb-1">{getHealthMessage()}</p>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Score is calculated based on your current vital signs (Heart Rate, SpO2 & Body Temperature).
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/health")}
            className="bg-sky-600 hover:bg-sky-700 transition-colors text-white px-6 py-3 rounded-xl font-medium flex items-center"
          >
            <Activity size={18} className="mr-2" />
            Health Monitor
          </button>
          <button
            onClick={() => navigate("/heartrate")}
            className="bg-gray-800 hover:bg-gray-700 transition-colors text-white px-6 py-3 rounded-xl font-medium flex items-center"
          >
            <Heart size={18} className="mr-2" />
            Detailed Statistics
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;