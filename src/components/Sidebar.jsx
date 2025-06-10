/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaBook,
  FaMicrophone,
  FaChartBar,
  FaCreditCard,
  FaKey,
  FaQuestionCircle,
} from "react-icons/fa";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import profile from "../assets/profile.png";

const menuItems = [
  { name: "Agents", icon: <FaUser />, path: "/agents" },
  { name: "Knowledge Base", icon: <FaBook />, path: "/knowledge-base" },
  { name: "Voice AI", icon: <FaMicrophone />, path: "/voice-ai" },
  { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
  { name: "Billing", icon: <FaCreditCard />, path: "/billing" },
  { name: "API Key", icon: <FaKey />, path: "/api-key" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useUser();

  return (
    <motion.aside
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.40, type: "keyframes", stiffness: 80 }}
      className="w-64 min-w-64 bg-gradient-to-b from-[#212336] via-[#27293d] to-[#282f4b] text-white h-screen flex flex-col shadow-2xl sticky top-0 z-40"
      style={{ maxWidth: 260, minWidth: 260 }}
    >
      {/* Sidebar Header */}
      <div className="p-6 text-2xl font-bold flex items-center gap-2 tracking-tight bg-[#232649] border-b border-[#2e305a] shadow-sm select-none">
        <span className="text-indigo-400 animate-pulse">●</span>
        <span>MagBrain <span className="text-blue-400">AI</span></span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-2">
        {menuItems.map((item, index) => (
          <motion.div
            whileHover={{ scale: 1.045 }}
            key={item.name}
            transition={{ type: "spring", stiffness: 300 }}
            className="px-3"
          >
            <Link
              to={item.path}
              className={`p-3 my-1 flex items-center rounded-lg font-medium transition-all duration-200 group
                ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg ring-2 ring-indigo-300"
                    : "bg-transparent text-gray-200 hover:bg-indigo-500/30"
                }
                `}
              style={{
                boxShadow:
                  location.pathname === item.path
                    ? "0 2px 8px 0 rgba(54,69,180,0.15)"
                    : undefined,
              }}
            >
              <span
                className={`mr-3 text-lg transition-all ${
                  location.pathname === item.path
                    ? "text-white drop-shadow"
                    : "text-indigo-300 group-hover:text-indigo-100"
                }`}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.name}</span>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Profile or Auth Buttons Section */}
      <div className="p-4 border-t border-[#2e305a] bg-[#232649] flex flex-col gap-2 shadow-inner relative">
        {!loading ? (
          user ? (
            <motion.div
              className="flex items-center cursor-pointer hover:bg-indigo-600/80 active:bg-indigo-700 rounded-lg p-2 transition-all group"
              onClick={() => navigate("/profile")}
              whileTap={{ scale: 0.98 }}
              initial={false}
            >
              <img
                src={profile}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-3 border-2 border-white/80 shadow"
                style={{ minWidth: 40, minHeight: 40 }}
              />
              <div className="flex flex-col min-w-0">
                <p
                  className="font-semibold text-white truncate max-w-[120px] group-hover:text-blue-200"
                  title={user.name}
                >
                  {user.name}
                </p>
                <p
                  className="text-xs text-gray-300 truncate max-w-[120px] group-hover:text-blue-100"
                  title={user.email}
                >
                  {user.email}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/signin"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-600 transition font-semibold shadow"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg text-center hover:bg-gray-600 transition font-semibold shadow"
              >
                Signup
              </Link>
            </div>
          )
        ) : (
          <div className="text-gray-400 text-sm flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-400 to-blue-400 animate-pulse inline-block" />
            Loading...
          </div>
        )}
        <div className="mt-4 flex items-center justify-between">
          <Link
            to="/help"
            className="flex items-center text-sm text-blue-200 hover:text-blue-400 font-semibold gap-1 transition"
          >
            <FaQuestionCircle className="mr-1" /> Help Center
          </Link>
        </div>
        {/* Glow effect at the bottom */}
        <span className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400/20 via-indigo-400/10 to-transparent blur-md opacity-80 pointer-events-none" />
      </div>
      {/* Animations */}
      <style>{`
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </motion.aside>
  );
};

export default Sidebar;