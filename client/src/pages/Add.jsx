import React, { useState } from "react";
import axios from "axios";

const Add = () => {
  const inputStyle =
    "w-full h-12 px-4 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
  const labelStyle = "block text-sm font-medium text-gray-300 mb-1";
  const [formData, setFormData] = useState({
    donorMail: localStorage.getItem("email"),
    title: "",
    foodItem: "",
    description: "",
    quantity: "",
    location: "",
    expiryDate: "",
    file: null
  });
  const [progress, setProgress] = useState(0);

  const calculateProgress = () => {
    const totalFields = 5; // Total number of fields in the form
    let filledFields = 0;

    Object.keys(formData).forEach((key) => {
      if (formData[key] && key !== "donorMail") filledFields++;
    });

    setProgress((filledFields / totalFields) * 100);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    calculateProgress();
  };

  const handlefile = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    calculateProgress();
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      alert("You must be logged in to add food donations.");
      return;
    }
    if (!formData.title || !formData.foodItem || !formData.quantity || !formData.location || !formData.expiryDate || !formData.file) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("foodItem", formData.foodItem);
      formDataToSend.append("donorMail", formData.donorMail);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("expiryDate", formData.expiryDate);
      formDataToSend.append("file", formData.file);

      const { data } = await axios.post(`${import.meta.env.VITE_DEV_URL}/food/add`, formDataToSend, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Food donation added successfully!");
      setFormData({
        title: "",
        foodItem: "",
        donorMail: localStorage.getItem("email"),
        description: "",
        quantity: "",
        location: "",
        expiryDate: "",
        file: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      {/* Motivational Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          "Your small act of kindness can make a big difference!"
        </h1>
        <p className="text-gray-400 text-lg">
          Join us in reducing food wastage and helping those in need.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-3xl bg-gray-800 rounded-lg overflow-hidden mb-6">
        <div
          className="bg-blue-500 h-4 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Donation Form */}
      <div className="w-full max-w-3xl bg-gray-800 text-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Add Food Donation
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* title */}
          <div>
            <label htmlFor="foodItem" className={labelStyle}>
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter the title for donation"
                required
                className={inputStyle}
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                🍞
              </span>
            </div>
          </div>
          {/* Food Item */}
          <div>
            <label htmlFor="foodItem" className={labelStyle}>
              Food Item
            </label>
            <div className="relative">
              <input
                type="text"
                id="foodItem"
                name="foodItem"
                value={formData.foodItem}
                onChange={handleChange}
                placeholder="Enter the food item (e.g., Rice, Bread)"
                required
                className={inputStyle}
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                🍞
              </span>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className={labelStyle}>
              Quantity
            </label>
            <div className="relative">
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity (e.g., kg or items)"
                required
                className={inputStyle}
              />

            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className={labelStyle}>
              Pickup Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter the pickup location"
                required
                className={inputStyle}
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                📍
              </span>
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className={labelStyle}>
              Expiry Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className={inputStyle}
              />

            </div>
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className={labelStyle}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about your donation (e.g., condition, packaging)"
              required
              className={`${inputStyle} h-32 resize-none`}
            />
          </div>

          {/* Image */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="file" className={labelStyle}>
              Photo
            </label>
            <div className="relative flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg p-4">
              <span className="text-gray-400 text-sm">
                {formData.file ? formData.file.name : "No file selected"}
              </span>
              <label
                htmlFor="file"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-500 transition"
              >
                Choose File
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handlefile}
                required
                className="hidden"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium text-lg transition"
            >
              Submit Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;