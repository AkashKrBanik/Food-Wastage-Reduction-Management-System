import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, X, Inbox, ClipboardCheck } from "lucide-react";

const RequestCard = ({ request, onAccept, onReject, status }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{request.title}</h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${status === "Available"
            ? "bg-teal-500 text-white"
            : "bg-blue-500 text-white"
            }`}
        >
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-400">
        <strong>Requested by:</strong> {request.userMail}
      </p>
      <p className="text-sm text-gray-400">
        <strong>Quantity:</strong> {request.requestedQuantity}
      </p>
      <p className="text-sm text-gray-400">
        <strong>Message:</strong> {request.message || "No message provided"}
      </p>
      {status === "Available" && (
        <div className="flex mt-4 border-t border-gray-700 pt-2">
          <button
            onClick={() => onReject(request.foodItemId)}
            className="flex-1 py-2 text-center text-red-500 hover:bg-red-500/10 rounded-l-lg transition"
          >
            <X className="inline-block w-5 h-5" /> Reject
          </button>
          <button
            onClick={() => onAccept(request.foodItemId)}
            className="flex-1 py-2 text-center text-teal-500 hover:bg-teal-500/10 rounded-r-lg transition"
          >
            <Check className="inline-block w-5 h-5" /> Accept
          </button>
        </div>
      )}
    </div>
  );
};

const Requests = () => {
  const [available, setAvailable] = useState([]);
  const [claimed, setClaimed] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const userMail = localStorage.getItem("email");
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_DEV_URL}/food/requests`,
          { userMail },
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );
        setAvailable(data.available || []);
        setClaimed(data.claimed || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (foodItemId) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_DEV_URL}/food/acceptReq`,
        {
          id: foodItemId,
          mail: localStorage.getItem("email"),
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      console.log(data);
      setAvailable((prev) =>
        prev.filter((request) => request.foodItemId !== foodItemId)
      );
    } catch (error) {
      if (error.status === 404) {
        alert("Food item not available for claiming.");
      }
      else {
        console.error("Error accepting request:", error);
        alert("Failed to accept the request.");
      }
    }
  };

  const handleReject = async (foodItemId) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_DEV_URL}/food/rejectReq`,
        {
          id: foodItemId,
          mail: localStorage.getItem("email"),
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      console.log(data);
      setAvailable((prev) =>
        prev.filter((request) => request.foodItemId !== foodItemId)
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject the request.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Donation Requests</h2>

      {/* Available Requests Section */}
      <section className="mb-12 bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-gray-200">
            Available Requests
          </h3>
          <Inbox className="w-6 h-6 text-gray-400" />
        </div>
        {available.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {available.map((request) => (
              <RequestCard
                key={request.foodItemId}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
                status="Available"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Inbox className="w-12 h-12 mb-2" />
            <p>No available requests at the moment.</p>
          </div>
        )}
      </section>

      {/* Claimed Requests Section */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-gray-200">
            Accepted Requests
          </h3>
          <ClipboardCheck className="w-6 h-6 text-gray-400" />
        </div>
        {claimed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {claimed.map((request) => (
              <RequestCard
                key={request.foodItemId}
                request={request}
                status="Claimed"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <ClipboardCheck className="w-12 h-12 mb-2" />
            <p>No claimed requests at the moment.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Requests;