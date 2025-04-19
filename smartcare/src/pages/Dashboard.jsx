import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Activity,
  Thermometer,
  Clock,
  Map,
  BarChart,
  User,
  Bell,
  Settings,
} from "lucide-react";
import { simulateHealthData } from "../api/auth";
import ApprovedPatientHealthData from "./ApprovedPatientHealthData";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [avg, setAvg] = useState({
    heartRate: "-",
    spo2: "-",
    temperature: "-",
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [readableLocation, setReadableLocation] = useState(
    "Fetching location..."
  );

  const navigate = useNavigate();

  // Load user & enforce auth
  useEffect(() => {
    const raw = localStorage.getItem("smartcare_user");
    if (!raw) return navigate("/login");
    const parsed = JSON.parse(raw);
    const mapped = { ...parsed, _id: parsed._id || parsed.id };
    setUser(mapped);
    setUserId(mapped._id);
  }, [navigate]);

  // Geolocation → human address
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setReadableLocation("Location services not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setLocation({ lat: coords.latitude, lon: coords.longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const json = await res.json();
          setReadableLocation(json.display_name);
        } catch {
          setReadableLocation("Location data unavailable");
        }
      },
      () => setReadableLocation("Location permission denied")
    );
  }, []);

  // Fetch / simulate health data
  const fetchHealth = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await simulateHealthData(userId);
      setAvg(data.average);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Kick off and poll every minute
  useEffect(() => {
    if (!userId) return;
    fetchHealth();
    const iv = setInterval(fetchHealth, 60000);
    return () => clearInterval(iv);
  }, [userId, fetchHealth]);

  // Health score helpers
  const calculateHealthScore = () => {
    const hr = parseInt(avg.heartRate, 10);
    const sp = parseInt(avg.spo2, 10);
    const tp = parseFloat(avg.temperature);
    let score = 0;

    if (hr >= 60 && hr <= 100) score += 30;
    else if (hr >= 50 && hr <= 110) score += 15;

    if (sp >= 95) score += 40;
    else if (sp >= 90) score += 20;

    if (tp >= 36.1 && tp <= 37.2) score += 30;
    else if (tp >= 35.5 && tp <= 38) score += 15;

    return `${score} / 100`;
  };

  const getHealthMessage = () => {
    const s = parseInt(calculateHealthScore());
    if (isNaN(s)) return "Awaiting data...";
    if (s >= 85) return "🟢 Excellent";
    if (s >= 60) return "🟡 Moderate";
    return "🔴 Needs Attention";
  };

  const getHealthScoreColor = () => {
    const s = parseInt(calculateHealthScore());
    if (isNaN(s)) return "text-gray-400";
    if (s >= 85) return "text-emerald-400";
    if (s >= 60) return "text-amber-400";
    return "text-red-400";
  };

  // Vital cards configuration
  const vitalCards = [
    {
      label: "Heart Rate",
      value: `${avg.heartRate} bpm`,
      icon: <Heart className="text-rose-400" size={22} />,
      gradient: "from-rose-500/20 to-transparent",
      borderColor: "border-rose-900/50",
      normalRange: "60-100 bpm",
    },
    {
      label: "SpO2",
      value: `${avg.spo2}%`,
      icon: <Activity className="text-sky-400" size={22} />,
      gradient: "from-sky-500/20 to-transparent",
      borderColor: "border-sky-900/50",
      normalRange: "95-100%",
    },
    {
      label: "Temperature",
      value: `${avg.temperature} °C`,
      icon: <Thermometer className="text-amber-400" size={22} />,
      gradient: "from-amber-500/20 to-transparent",
      borderColor: "border-amber-900/50",
      normalRange: "36.1-37.2°C",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black px-4 py-4 border-b border-sky-900/40 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-sky-500 rounded-lg p-1.5">
              <Activity className="text-black" size={20} />
            </div>
            <h1 className="text-xl font-bold text-sky-400">SmartCare</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-sky-400 transition-colors">
              <Bell size={20} />
            </button>
            <button className="text-gray-400 hover:text-sky-400 transition-colors">
              <Settings size={20} />
            </button>
            <div className="h-8 w-8 bg-sky-900 rounded-full flex items-center justify-center">
              <User size={16} className="text-sky-300" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Health Dashboard
            </h2>
            <p className="text-gray-400">Monitor your vitals in real time</p>
          </div>
          {lastUpdated && (
            <div className="flex items-center mt-4 sm:mt-0 text-sm text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-md border border-gray-800">
              <Clock size={14} className="mr-1.5" />
              <span>Updated: {lastUpdated}</span>
            </div>
          )}
        </div>

        {/* Patient Dashboard */}
        {user?.role === "patient" && (
          <>
            {/* Vital Signs Section */}
            <section className="mb-12">
              <h3 className="text-lg font-semibold text-sky-400 mb-4">
                Vital Signs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {vitalCards.map((card, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${card.gradient} border ${card.borderColor} rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-sky-900/20`}
                  >
                    <div className="bg-gray-900/90 backdrop-blur-sm p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {card.icon}
                          <h4 className="text-base font-medium text-gray-200 ml-2">
                            {card.label}
                          </h4>
                        </div>
                        <span className="text-xs text-gray-500">
                          {card.normalRange}
                        </span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold">
                        {loading ? (
                          <span className="text-gray-500 animate-pulse">
                            ...
                          </span>
                        ) : (
                          card.value
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Health Status and Location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Health Score */}
              <div className="bg-gray-900 border border-sky-900/30 rounded-xl shadow-lg overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <BarChart className="text-sky-400" size={20} />
                    <h3 className="ml-2 text-lg font-medium text-gray-200">
                      Health Score
                    </h3>
                  </div>
                  <div className="flex items-end mb-3">
                    <p
                      className={`text-3xl font-bold ${getHealthScoreColor()}`}
                    >
                      {calculateHealthScore()}
                    </p>
                    <p className="ml-3 mb-1 text-sm text-gray-400">
                      {getHealthMessage()}
                    </p>
                  </div>
                  <div className="mt-2 h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        parseInt(calculateHealthScore()) >= 85
                          ? "bg-emerald-500"
                          : parseInt(calculateHealthScore()) >= 60
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${parseInt(calculateHealthScore())}%` }}
                    ></div>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Score based on your current vital measurements.
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gray-900 border border-sky-900/30 rounded-xl shadow-lg overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <Map className="text-sky-400" size={20} />
                    <h3 className="ml-2 text-lg font-medium text-gray-200">
                      Current Location
                    </h3>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-800">
                    <p className="text-gray-300 break-words">
                      {readableLocation === "Fetching location..." ? (
                        <span className="flex items-center text-gray-500">
                          <span className="h-2 w-2 bg-sky-500 rounded-full mr-2 animate-pulse"></span>
                          {readableLocation}
                        </span>
                      ) : (
                        readableLocation
                      )}
                    </p>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Location data is used for emergency response only.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Caregiver or Hospital Dashboard */}
        {(user?.role === "caregiver" || user?.role === "hospital") && (
          <div className="mb-12">
            <ApprovedPatientHealthData />
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/health")}
            className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-lg font-medium flex items-center justify-center transition-colors duration-300"
          >
            <Activity size={18} className="mr-2" />
            {user?.role === "patient"
              ? "Health Monitor"
              : "Analyze Patient Health"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
