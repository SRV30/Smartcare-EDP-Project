// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("smartcare_token");

  if (!token) {
    toast.warning("Please login to continue");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
