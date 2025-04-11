import React, { useEffect, useState } from "react";
import LinkedCaregivers from "./SendLinkRequest";
import PendingRequests from "./PendingRequests";

const PatientDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcare_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user.name} ({user.role})
      </h1>
      {user.role === "patient" && <LinkedCaregivers user={user} />}
      {(user.role === "caregiver" || user.role === "hospital") && (
        <PendingRequests user={user} />
      )}
      {/* {user.role === "admin" && <AdminSection user={user} />} */}
    </div>
  );
};

export default PatientDashboard;
