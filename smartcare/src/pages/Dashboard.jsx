import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "./LogoutButton";

const Dashboard = () => {
  const [data, setData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [readableLocation, setReadableLocation] = useState("Fetching...");

  // Convert coordinates to address
  const fetchLocationName = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setReadableLocation(data.display_name);
    } catch (err) {
      console.error("Error fetching location name:", err);
      setReadableLocation("Unknown Location");
    }
  };

  useEffect(() => {
    // Fetch health data from backend
    const fetchHealthData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/health-data");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching health data:", err);
      }
    };

    // Fetch browser location
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
            setReadableLocation("Permission Denied");
          }
        );
      } else {
        setReadableLocation("Geolocation not supported");
      }
    };

    fetchHealthData();
    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-sky-400 mb-6">
        SmartCare Dashboard
      </h1>
      <LogoutButton />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-sky-300">Heart Rate</h2>
          <p className="text-2xl">
            {data ? `${data.heartRate} bpm` : "Loading..."}
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-sky-300">SpO2</h2>
          <p className="text-2xl">{data ? `${data.spo2}%` : "Loading..."}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-sky-300">
            Body Temperature
          </h2>
          <p className="text-2xl">
            {data ? `${data.temperature} °C` : "Loading..."}
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-sky-300">
            Current Location
          </h2>
          <p className="text-sm">{readableLocation}</p>
        </div>
      </div>

      <div className="">
        <h2 className="text-lg font-semibold text-sky-300 mt-6">
          Calculate your health score:
        </h2>
      
        <p className="text-sm text-gray-400 mb-4">
          Based on your heart rate, SpO2, and body temperature.
        </p>

        <div className="">
         calculate heart rate and spo2 here 
         <a href="/heartrate"></a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
