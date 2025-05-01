import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [items, setItems] = useState([]);

  const getItems = async () => {
    const email = localStorage.getItem("email");
    // console.log(import.meta.env.VITE_DEV_URL);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_DEV_URL}/food`, {
        email,
      });
      setItems(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">

      {/* Food Items Section */}
      <main className="py-12 px-6" id="food-items">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Available Food Items
        </h2>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item, index) => (
              <FoodItem key={index} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No food items available at the moment.
          </p>
        )}
      </main>
    </div>
  );
};

export default Home;

const FoodItem = ({ item }) => {
  const expirydate = new Date(item.expiryDate);
  const today = new Date();
  const timediff = expirydate - today;
  const daysleft = Math.ceil(timediff / (1000 * 60 * 60 * 24));

  const getExpiryStatus = () => {
    if (daysleft <= 0) return { text: "Expired", color: "bg-red-500" };
    if (daysleft <= 3) return { text: "Expiring Soon", color: "bg-yellow-500" };
    return { text: `Expires in ${daysleft} days`, color: "bg-green-500" };
  };

  const { text, color } = getExpiryStatus();

  return (
    <Link to={`/food/${item._id}`} className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
      {/* Food Image */}
      <div className="w-full h-40 bg-gray-700">
        <img
          src={item.images}
          alt={item.foodItem}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Food Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.foodItem}</h3>
        <p className="text-sm text-gray-400 mb-1">Quantity: {item.quantity}</p>
        <p className="text-sm text-gray-400 mb-1">Location: {item.location}</p>
        <p className="text-sm text-gray-400 mb-3">
          Expiry Date: {new Date(item.expiryDate).toLocaleDateString()}
        </p>

        {/* Expiry Badge */}
        <span
          className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full ${color}`}
        >
          {text}
        </span>
      </div>
    </Link>
  );
};