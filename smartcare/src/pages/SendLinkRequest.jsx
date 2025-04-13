import React, { useEffect, useState } from "react";
import { sendLinkRequest } from "../api/auth";
import { toast } from "sonner";
import { UserPlus, Users, Mail, AlertCircle } from "lucide-react";

const LinkedCaregivers = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [linkedCaregivers, setLinkedCaregivers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcare_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser?.caregivers?.length > 0) {
        setLinkedCaregivers(parsedUser.caregivers);
      }
    }
  }, []);

  const handleSendRequest = async () => {
    if (!email) return toast.error("Please enter caregiver email");
    if (!user?.id) return toast.error("User not logged in or ID missing");

    setIsLoading(true);
    
    try {
      console.log("Sending request with:", user._id, email);

      const res = await sendLinkRequest({
        patientId: user.id,
        targetEmail: email,
      });

      toast.success(res.data.msg || "Request sent successfully");
      setEmail("");
    } catch (err) {
      const msg = err.response?.data?.msg || "Something went wrong";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500 mb-2"></div>
          <p>Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-black text-white rounded-xl shadow-lg border border-gray-800">
      <div className="flex items-center justify-center mb-6">
        <Users className="w-6 h-6 mr-2 text-sky-400" />
        <h2 className="text-xl font-semibold">Linked Caregivers</h2>
      </div>

      {linkedCaregivers.length > 0 ? (
        <div className="mb-6">
          <p className="text-sky-400 text-sm font-medium mb-3">Connected Care Providers</p>
          <ul className="space-y-3">
            {linkedCaregivers.map((caregiver) => (
              <li 
                key={caregiver._id} 
                className="bg-gray-900 p-3 rounded-lg flex items-center border border-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center mr-3">
                  {caregiver.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{caregiver.name}</p>
                  <p className="text-gray-400 text-sm">{caregiver.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mb-6 py-8 bg-gray-900 rounded-lg flex flex-col items-center justify-center border border-gray-800">
          <AlertCircle className="w-10 h-10 text-sky-400 mb-2" />
          <p className="text-gray-400">No caregivers linked to your account</p>
        </div>
      )}

      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <p className="text-sky-400 text-sm font-medium mb-3">Add New Caregiver</p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Enter caregiver email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSendRequest}
            disabled={isLoading}
            className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 transition-colors flex items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedCaregivers;