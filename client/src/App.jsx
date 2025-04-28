import React from "react";
import {
  Link,
  useLocation,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Home, Add, Profile, LoginOrRegister, Requests } from "./pages/index";
import PrivateRoute from "./auth/PrivateRoute";
import FoodDetails from "./pages/FoodDetails";
import {
  LucideHome,
  PlusCircle,
  ClipboardList,
  User,
  LogIn,
  NotebookText,
} from "lucide-react";
import SmartRec from "./pages/SmartRec";

const App = () => {
  const location = useLocation();
  const user = localStorage.getItem("email");
  if (!user) {
    return <LoginOrRegister />
  }
  const links = [
    { to: "/", label: "Home", icon: <LucideHome size={20} /> },
    { to: "/add", label: "Add", icon: <PlusCircle size={20} /> },
    { to: "/requests", label: "Requests", icon: <ClipboardList size={20} /> },
    { to: '/smartrecipe', label: "Smart Recipe", icon: <NotebookText size={20} /> },
    { to: "/profile", label: "Profile", icon: <User size={20} /> },
    // { to: "/login", label: "Login", icon: <LogIn size={20} /> },
  ];
  return (
    <div className="flex">
      <div className="w-1/6 min-w-[140px] min-h-screen h-full bg-black flex flex-col gap-4 items-center pt-16 text-white shadow-lg px-2 border-r border-white/30">
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 w-full px-6 py-3 rounded-lg transition ${location.pathname === to
              ? "bg-white text-black"
              : "hover:bg-gray-700"
              }`}
          >
            {icon}
            <span className="text-base">{label}</span>
          </Link>
        ))}
      </div>
      <div className="flex-1 h-screen overflow-y-scroll">
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
