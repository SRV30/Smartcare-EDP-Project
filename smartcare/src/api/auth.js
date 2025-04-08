import axios from "axios";

// Check environment and set baseURL accordingly
const API = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "https://smartcare-backend-bice.vercel.app/api",
});

// Register patient
export const registerPatient = (formData) => API.post("/auth/register", formData);

// Login patient
export const loginPatient = (formData) => API.post("/auth/login", formData);
