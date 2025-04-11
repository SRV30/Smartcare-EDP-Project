import React, { useEffect, useState } from "react";
import { sendLinkRequest } from "../api/auth";
import { toast } from "sonner";

const LinkedCaregivers = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [linkedCaregivers, setLinkedCaregivers] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcare_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser?.caregivers?.length > 0) {
        setLinkedCaregivers(parsedUser.caregivers); // populated list
      }
    }
  }, []);

  const handleSendRequest = async () => {
    if (!email) return toast.error("Please enter caregiver email");
    if (!user?.id) return toast.error("User not logged in or ID missing");

    try {
      console.log("Sending request with:", user._id, email);

      const res = await sendLinkRequest({
        patientId: user.id,
        targetEmail: email,
      });

      toast.success(res.data.msg || "Request sent");
      setEmail("");
    } catch (err) {
      const msg = err.response?.data?.msg || "Something went wrong";
      toast.error(msg);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading user...</p>;

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        🔗 Linked Caregivers / Hospitals
      </h2>

      {linkedCaregivers.length > 0 ? (
        <ul className="mb-4">
          {linkedCaregivers.map((caregiver) => (
            <li key={caregiver._id} className="text-sm mb-1">
              👤 {caregiver.name} ({caregiver.email})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-4">No caregivers linked yet.</p>
      )}

      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter caregiver email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={handleSendRequest}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send Request
        </button>
      </div>
    </div>
  );
};

export default LinkedCaregivers;
