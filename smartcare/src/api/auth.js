import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend server URL
});

// Register patient
export const registerPatient = (formData) => API.post("/auth/register", formData);

// Login patient
export const loginPatient = (formData) => API.post("/auth/login", formData);
