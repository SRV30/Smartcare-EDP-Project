import axios from "axios";

// ✅ Create axios instance
const API = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "https://smartcare-backend-bice.vercel.app/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("smartcare_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// utils/auth.js or wherever
export const getCurrentUser = () => {
  const user = localStorage.getItem("smartcare_user");
  return user ? JSON.parse(user) : null;
};
export const setCurrentUser = (user) => {
  localStorage.setItem("smartcare_user", JSON.stringify(user));
};

// 🔽 AUTH ROUTES
export const registerPatient = (formData) =>
  API.post("/auth/register", formData);
export const loginPatient = (formData) => API.post("/auth/login", formData);

// 🧪 SIMULATE HEALTH DATA
export const simulateHealthData = (userId) =>
  API.post("/health/simulate", { userId });

// 🔗 PATIENT ↔ CAREGIVER/HOSPITAL LINKING
export const sendLinkRequest = ({ patientId, targetEmail }) =>
  API.post("/link/request-link", { patientId, targetEmail });

export const getPendingRequests = (userId) =>
  API.get(`/link/pending-requests/${userId}`);

export const approvePatientRequest = ({ approverId, patientId }) =>
  API.post("/link/approve-request", { approverId, patientId });

export const getLinkedPatientsWithHealthData = (userId) =>
  API.get(`/link/linked-patients/${userId}`);

export const getApprovedPatients = async (caregiverId) => {
  return API.get(`/link/approved/${caregiverId}`);
};

// 📥 Save or update BMI data
export const saveOrUpdateBmi = ({ userId, height, weight }) =>
  API.post("/bmi/save", { userId, height, weight });

// 📤 Get BMI data by userId
export const getBmiData = (userId) => API.get(`/bmi/${userId}`);

