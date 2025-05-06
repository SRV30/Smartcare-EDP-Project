import React, { useEffect, useState, useRef } from "react";
import { getApprovedPatients, getLatestHealthData } from "../api/auth";

const ApprovedPatientHealthData = () => {
  const [user, setUser] = useState(null);
  const [approved, setApproved] = useState([]);
  const [healthDataMap, setHealthDataMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [readableLocation, setReadableLocation] = useState("Fetching location...");
  const [alertedPatients, setAlertedPatients] = useState({});
  const [sosPatient, setSosPatient] = useState(null);
  const audioRef = useRef(new Audio("/sos-alert2.mp3"));

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcare_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({ ...parsed, _id: parsed._id || parsed.id });
    }
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const fetchApproved = async () => {
      setLoading(true);
      try {
        const approvedRes = await getApprovedPatients(user._id);
        setApproved(approvedRes.data.approvedPatients);
      } catch (err) {
        console.error("❌ Error fetching approved patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApproved();
  }, [user]);

  useEffect(() => {
    if (approved.length === 0) return;

    const fetchHealthData = async () => {
      const updatedData = {};
      for (const patient of approved) {
        try {
          const res = await getLatestHealthData(patient._id);
          updatedData[patient._id] = res.data;
        } catch (err) {
          console.error(`❌ Failed to fetch for ${patient.name}`, err);
        }
      }
      setHealthDataMap(updatedData);
    };

    fetchHealthData();
    const interval = setInterval(fetchHealthData, 10000);
    return () => clearInterval(interval);
  }, [approved]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setReadableLocation("Location access not supported");
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

  useEffect(() => {
    for (const patient of approved) {
      const data = healthDataMap[patient._id];
      if (data) {
        const needsSOS = data.heartRate > 79 && data.spo2 < 96;

        if (needsSOS && !alertedPatients[patient._id]) {
          audioRef.current.play();
          setSosPatient(patient);
          setAlertedPatients(prev => ({ ...prev, [patient._id]: true }));
        } else if (!needsSOS && alertedPatients[patient._id]) {
          setAlertedPatients(prev => {
            const copy = { ...prev };
            delete copy[patient._id];
            return copy;
          });
        }
      }
    }
  }, [healthDataMap]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  const getHeartRateStatus = (rate) => {
    if (!rate) return { color: "text-gray-400", label: "Unknown" };
    if (rate < 60) return { color: "text-yellow-400", label: "Low" };
    if (rate > 100) return { color: "text-red-500", label: "Elevated" };
    return { color: "text-green-400", label: "Normal" };
  };

  const getSpO2Status = (spo2) => {
    if (!spo2) return { color: "text-gray-400", label: "Unknown" };
    if (spo2 < 95) return { color: "text-red-500", label: "Low" };
    return { color: "text-green-400", label: "Normal" };
  };

  const getTemperatureStatus = (temp) => {
    if (!temp) return { color: "text-gray-400", label: "Unknown" };
    if (temp < 36) return { color: "text-blue-400", label: "Low" };
    if (temp > 37.5) return { color: "text-red-500", label: "Elevated" };
    return { color: "text-green-400", label: "Normal" };
  };

  const closeSos = () => setSosPatient(null);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {sosPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="bg-red-900 border border-red-600 text-white p-6 rounded-xl shadow-xl text-center max-w-md">
            <h2 className="text-3xl font-bold mb-2">🚨 SOS Alert!</h2>
            <p className="mb-4 font-medium">{sosPatient.name} needs attention:</p>
            <ul className="text-left text-sm list-disc pl-5 mb-4">
              <li>Heart Rate: {healthDataMap[sosPatient._id]?.heartRate} bpm</li>
              <li>SpO2: {healthDataMap[sosPatient._id]?.spo2}%</li>
            </ul>
            <button
              onClick={closeSos}
              className="bg-white text-red-800 font-semibold px-4 py-2 rounded hover:bg-gray-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-sky-400 sm:text-4xl">
            SmartCare Health Dashboard
          </h1>
          <p className="mt-3 text-xl text-gray-300">Real-time patient monitoring</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-sky-600 opacity-75"></div>
              <p className="mt-4 text-sky-300">Loading patient data...</p>
            </div>
          </div>
        ) : approved.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {approved.map((patient) => {
              const healthData = healthDataMap[patient._id];
              const heartRateStatus = healthData ? getHeartRateStatus(healthData.heartRate) : { color: "text-gray-400", label: "Unknown" };
              const spo2Status = healthData ? getSpO2Status(healthData.spo2) : { color: "text-gray-400", label: "Unknown" };
              const tempStatus = healthData ? getTemperatureStatus(healthData.temperature) : { color: "text-gray-400", label: "Unknown" };

              return (
                <div key={patient._id} className="bg-black rounded-xl overflow-hidden shadow-lg border border-sky-900 hover:border-sky-600 transition-all duration-300">
                  <div className="px-6 py-4 border-b border-sky-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white">{patient.name}</h2>
                        <p className="text-sm text-gray-400">{patient.email}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-sky-900 flex items-center justify-center">
                        <span className="text-sky-300 text-lg font-bold">
                          {patient.name.substring(0, 1).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    {healthData ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">❤️</span>
                            <span className="text-gray-300">Heart Rate</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-white">{healthData.heartRate} bpm</span>
                            <span className={`text-xs ${heartRateStatus.color}`}>{heartRateStatus.label}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">🫁</span>
                            <span className="text-gray-300">SpO2</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-white">{healthData.spo2}%</span>
                            <span className={`text-xs ${spo2Status.color}`}>{spo2Status.label}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">🌡️</span>
                            <span className="text-gray-300">Temperature</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-white">{healthData.temperature}°C</span>
                            <span className={`text-xs ${tempStatus.color}`}>{tempStatus.label}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-800">
                          <p className="text-xs text-gray-500">
                            Last updated: {healthData.stream && healthData.stream[9] ? formatTimestamp(healthData.stream[9].timestamp) : "Unknown"}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-gray-800">
                          <h3 className="text-sm font-medium text-sky-400 mb-1">Current Location</h3>
                          <p className="text-xs text-gray-400 line-clamp-2">{readableLocation}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 text-center">
                        <div className="animate-pulse inline-block h-4 w-4 rounded-full bg-sky-600 mr-1"></div>
                        <span className="text-gray-400">Fetching health data...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-black border border-sky-900 rounded-xl p-10 text-center shadow-lg">
            <svg className="mx-auto h-12 w-12 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-4 text-lg text-gray-300">No approved patients found</p>
            <p className="mt-2 text-sm text-gray-500">
              Patient connections will appear here once they've approved your access request.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovedPatientHealthData;
