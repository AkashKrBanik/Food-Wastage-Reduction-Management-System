import React from "react";

const NotificationCard = ({ notification, onDelete, onMarkAsRead }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md flex justify-between items-center ${
        notification.isRead ? "bg-gray-700" : "bg-blue-700"
      }`}
    >
      {/* Notification Content */}
      <div>
        <p className="text-sm text-white">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {/* Mark as Read Button (only for unread notifications) */}
        {!notification.isRead && (
          <button
            onClick={() => onMarkAsRead(notification._id)}
            className="text-xs bg-green-600 hover:bg-green-500 text-white py-1 px-2 rounded"
          >
            Mark as Read
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={() => onDelete(notification._id)}
          className="text-xs bg-red-600 hover:bg-red-500 text-white py-1 px-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;