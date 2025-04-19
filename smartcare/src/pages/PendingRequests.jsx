// ApprovedPatients.jsx
import React, { useEffect, useState } from "react";
import {
  getPendingRequests,
  approvePatientRequest,
  getApprovedPatients,
} from "../api/auth";
import { toast } from "sonner";

const ApprovedPatients = () => {
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcare_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const mappedUser = {
        ...parsed,
        _id: parsed._id || parsed.id,
      };
      setUser(mappedUser);
    }
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        const pendingRes = await getPendingRequests(user._id);
        setPending(pendingRes.data.pendingRequests);

        const approvedRes = await getApprovedPatients(user._id);
        setApproved(approvedRes.data.approvedPatients);
      } catch (err) {
        console.error("❌ Error fetching requests:", err);
        toast.error("Failed to load requests");
      }
    };

    fetchData();
  }, [user]);

  const handleApprove = async (patientId) => {
    try {
      await approvePatientRequest({ approverId: user._id, patientId });
      toast.success("✅ Request approved");

      const approvedPatient = pending.find((p) => p._id === patientId);
      setApproved((prev) => [...prev, approvedPatient]);
      setPending((prev) => prev.filter((p) => p._id !== patientId));
    } catch (err) {
      console.error("❌ Approval error:", err);
      toast.error("Failed to approve request");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">👥 Pending Requests</h2>
      {pending.length > 0 ? (
        <ul className="space-y-2">
          {pending.map((patient) => (
            <li key={patient._id} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{patient.name}</p>
                <p className="text-xs text-gray-600">{patient.email}</p>
              </div>
              <button
                onClick={() => handleApprove(patient._id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No pending requests.</p>
      )}

      <h2 className="text-xl font-semibold mt-8 mb-4 text-center">✅ Approved Patients</h2>
      {approved.length > 0 ? (
        <ul className="space-y-2">
          {approved.map((patient) => (
            <li key={patient._id} className="border p-2 rounded text-sm">
              <p className="font-medium">{patient.name}</p>
              <p className="text-gray-200">{patient.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No approved patients yet.</p>
      )}
    </div>
  );
};

export default ApprovedPatients;
