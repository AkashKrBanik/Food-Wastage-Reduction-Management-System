import React, { useState } from "react";
import { Link, useLocation, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home, Add, Profile, LoginOrRegister, Requests } from "./pages/index";
import PrivateRoute from "./auth/PrivateRoute";
import FoodDetails from "./pages/FoodDetails";
import { LucideHome, PlusCircle, ClipboardList, User, NotebookText, Menu, X, } from "lucide-react";
import SmartRec from "./pages/SmartRec";

const App = () => {
  const location = useLocation();
  const user = localStorage.getItem("email");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) {
    return <LoginOrRegister />;
  }

  const links = [
    { to: "/", label: "Home", icon: <LucideHome size={20} /> },
    { to: "/add", label: "Add", icon: <PlusCircle size={20} /> },
    { to: "/requests", label: "Requests", icon: <ClipboardList size={20} /> },
    { to: "/smartrecipe", label: "Smart Recipe", icon: <NotebookText size={20} /> },
    { to: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full bg-black text-white shadow-lg transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative md:w-64`}
      >
        <button
          className="absolute top-4 right-4 md:hidden text-white"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={24} />
        </button>
        <div className="flex flex-col gap-4 items-center pt-16 px-2 border-r border-white/30">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 w-full px-6 py-3 rounded-lg transition ${location.pathname === to
                  ? "bg-white text-black"
                  : "hover:bg-gray-700"
                }`}
              onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
            >
              {icon}
              <span className="text-base">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Hamburger Menu for Mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-black text-white p-2 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-scroll bg-gray-100 p-0">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Home />} />

          {/* Protected Route */}
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <Add />
              </PrivateRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginOrRegister />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/smartrecipe" element={<SmartRec />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;