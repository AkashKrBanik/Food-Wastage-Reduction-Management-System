import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getItem = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_DEV_URL}/food/getItem/${id}`
        );
        setFoodItem(data[0]); // Access first item from the response array
      } catch (err) {
        setError("Failed to fetch food details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getItem();
  }, [id]);

  const requestDonation = async () => {
    if (localStorage.getItem("email") === foodItem.donorMail) {
      return;
    }
    await axios.post(`${import.meta.env.VITE_DEV_URL}/food/requestDonation`, {
      title: foodItem.title,
      userMail: localStorage.getItem("email"),
      donorMail: foodItem.donorMail,
      foodItemId: foodItem._id,
      requestedQuantity: foodItem.quantity,
      message: "I need this food for a community event"
    }).then((res) => {
      alert("Donation request sent successfully!");
      navigate("/");
    }).catch((err) => {
      console.error(err);
      alert("Failed to send donation request. Please try again.");
    })
  };

  if (loading)
    return <p className="text-center text-lg text-gray-500">Loading...</p>;

  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!foodItem)
    return <p className="text-center text-red-500">Food item not found.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black dark:bg-gray-900">
      <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-700 mx-4 sm:mx-auto">
        {/* Responsive Layout: Stacked on small screens, Side-by-side on large screens */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={foodItem.images}
              alt="Food Item"
              className="w-full max-w-md h-64 object-cover rounded-md shadow-lg"
            />
          </div>

          {/* Food Details */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center md:text-left">
              {foodItem.foodItem}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-center md:text-left">
              {foodItem.description}
            </p>
            <div className="mt-6 space-y-3 text-lg text-gray-700 dark:text-gray-200">
              <p>
                <strong>Quantity:</strong> {foodItem.quantity} kg
              </p>
              <p>
                <strong>Location:</strong> {foodItem.location}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {new Date(foodItem.expiryDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
          <button
            onClick={requestDonation}
            className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Request Donation
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
