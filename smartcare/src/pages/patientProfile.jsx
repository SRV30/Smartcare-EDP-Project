import React, { useEffect, useState } from "react";
import BMICalculator from "./BMICalculator";

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
      <BMICalculator />
    </div>
  );
};

export default PatientDashboard;
