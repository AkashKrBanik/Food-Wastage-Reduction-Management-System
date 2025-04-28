import React, { useState, useEffect, useCallback } from "react";
import { LogOut, Bell, ClipboardList, Inbox } from "lucide-react";
import axios from "axios";
import SkeletonLoader from "../Components/SkeletonLoader"; // Skeleton loader for better UX
import NotificationCard from "../Components/NotificationCard";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for API calls

  const logout = async () => {
    try {
      const email = localStorage.getItem("email");
      await axios.post(
        `${import.meta.env.VITE_DEV_URL}/auth/logout`,
        { email },
        { withCredentials: true }
      );
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fetch Donations
  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem("email");
      const { data } = await axios.get(
        `${import.meta.env.VITE_DEV_URL}/food/donations?email=${email}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Claims
  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem("email");
      const { data } = await axios.get(
        `${import.meta.env.VITE_DEV_URL}/food/claims?email=${email}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setClaims(data);
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_DEV_URL}/auth/notifications`, { email },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(data);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when the active tab changes
  useEffect(() => {
    if (activeTab === "donations") {
      fetchDonations();
    } else if (activeTab === "claims") {
      fetchClaims();
    } else if (activeTab === "notifications") {
      fetchNotifications();
    }
  }, [activeTab, fetchDonations, fetchClaims, fetchNotifications]);

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_DEV_URL}/auth/notifications/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setNotifications((prev) => prev.filter((notif) => notif._id !== id)); // Remove from state
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_DEV_URL}/auth/notifications/${id}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      ); // Update state
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white flex flex-col sm:flex-row items-center sm:justify-between px-4 sm:px-6 py-4">
        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <img
            src="user.png" // Replace with actual profile image
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-gray-700"
          />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              {localStorage.getItem("name")}
            </h2>
            <p className="text-gray-400 text-sm">{localStorage.getItem("email")}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-4 sm:mt-0">
          <button
            className={`py-2 px-4 rounded-lg ${activeTab === "notifications"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="w-5 h-5 inline-block mr-2" /> Notifications
          </button>
          <button
            className={`py-2 px-4 rounded-lg ${activeTab === "donations"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            onClick={() => setActiveTab("donations")}
          >
            <ClipboardList className="w-5 h-5 inline-block mr-2" /> Donations
          </button>
          <button
            className={`py-2 px-4 rounded-lg ${activeTab === "claims"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            onClick={() => setActiveTab("claims")}
          >
            <Inbox className="w-5 h-5 inline-block mr-2" /> Claims
          </button>

        </div>

        {/* Logout Button */}
        <button
          className="mt-4 sm:mt-0 py-2 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center gap-2"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-900 text-white p-4 sm:p-6">
        {loading ? (
          <SkeletonLoader /> // Show skeleton loader while data is loading
        ) : (
          <>
            {activeTab === "donations" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Your Donations</h2>
                {donations.length > 0 ? (
                  <ul className="space-y-4">
                    {donations.map((donation) => (
                      <li
                        key={donation._id}
                        className="p-4 bg-gray-800 rounded-lg shadow"
                      >
                        <h3 className="text-lg font-semibold">{donation.foodItem}</h3>
                        <p className="text-sm text-gray-400">
                          Quantity: {donation.quantity}
                        </p>
                        <p className="text-sm text-gray-400">
                          Location: {donation.location}
                        </p>
                        <p className="text-sm text-gray-400">
                          Expiry Date:{" "}
                          {new Date(donation.expiryDate).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No donations found.</p>
                )}
              </div>
            )}

            {activeTab === "claims" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Your Claims</h2>
                {claims.length > 0 ? (
                  <ul className="space-y-4">
                    {claims.map((claim) => (
                      <li
                        key={claim._id}
                        className="p-4 bg-gray-800 rounded-lg shadow"
                      >
                        <h3 className="text-lg font-semibold">{claim.foodItem}</h3>
                        <p className="text-sm text-gray-400">
                          Quantity: {claim.quantity}
                        </p>
                        <p className="text-sm text-gray-400">
                          Location: {claim.location}
                        </p>
                        <p className="text-sm text-gray-400">
                          Expiry Date:{" "}
                          {new Date(claim.expiryDate).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No claims found.</p>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
                {notifications.length > 0 ? (
                  <ul className="space-y-4">
                    {notifications.map((notification) => (
                      <NotificationCard
                        key={notification._id}
                        notification={notification}
                        onDelete={handleDeleteNotification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No notifications found.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;