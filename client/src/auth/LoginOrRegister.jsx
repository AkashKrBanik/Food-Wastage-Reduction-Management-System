"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginOrRegister() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const checkUser = () => {
    if (localStorage.getItem("email")) {
      try {
        axios.post(`${import.meta.env.VITE_DEV_URL}/auth/jwt`, {}, {
          withCredentials: true,
        }).then((response) => {
          console.log(response);
          navigate("/home");
        }).catch((error) => {
          console.error(error);
        });
      }
      finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    checkUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "" };

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Validate name for register form
    if (isRegister && !formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const url = isRegister
        ? `${import.meta.env.VITE_DEV_URL}/auth/register`
        : `${import.meta.env.VITE_DEV_URL}/auth/login`;

      const response = await axios.post(url, formData, {
        withCredentials: true,
      });
      console.log(response);

      if (isRegister) {
        showNotification(
          "success",
          "Account created successfully! Please log in."
        );
        setIsRegister(false);
        setFormData({ ...formData, name: "" });
        console.log("Passed If");
      } else {
        // Store user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("email", response.data.user.email);

        showNotification("success", "Login successful! Welcome back.");
        console.log("Before router");
        navigate("/");
        console.log("Passed else")
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      {/* Notification Toast */}
      {notification.show && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 duration-200 rounded-full text-white text-sm font-medium shadow-lg z-50 ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-white">
            {isRegister ? "Create Account" : "Sign In"}
          </h1>
          <p className="mt-2 text-gray-400">
            {isRegister
              ? "Enter your details to create your account"
              : "Welcome back! Please enter your details"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div className="space-y-1">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border-0 bg-gray-800/80 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-400 text-sm pl-1">{errors.name}</p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl border-0 bg-gray-800/80 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm pl-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl border-0 bg-gray-800/80 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm pl-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium text-base transition-colors flex items-center justify-center disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isRegister ? "Creating account..." : "Signing in..."}
              </>
            ) : (
              <>{isRegister ? "Create Account" : "Sign In"}</>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-gray-400 pt-4">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setFormData({ ...formData, name: "" });
              setErrors({ name: "", email: "", password: "" });
            }}
            className="text-blue-500 font-medium"
          >
            {isRegister ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

