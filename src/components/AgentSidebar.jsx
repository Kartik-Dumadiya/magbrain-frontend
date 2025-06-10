/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, Folder, Star, Clock, Archive, Settings } from "lucide-react";

const folderColors = [
  "bg-gradient-to-tr from-indigo-100 to-blue-100",
  "bg-gradient-to-tr from-purple-100 to-indigo-50",
  "bg-gradient-to-tr from-pink-100 to-purple-50",
  "bg-gradient-to-tr from-cyan-100 to-blue-50"
];

const AgentSidebar = ({ onAdd }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const folders = [
    { id: 1, name: "Favorites", icon: <Star size={18} />, color: folderColors[0] },
    { id: 2, name: "Recent", icon: <Clock size={18} />, color: folderColors[1] },
    { id: 3, name: "Archived", icon: <Archive size={18} />, color: folderColors[2] },
    { id: 4, name: "Custom Folder", icon: <Folder size={18} />, color: folderColors[3] },
  ];

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="flex flex-col bg-white/90 shadow-xl h-full rounded-2xl min-w-[270px] max-w-[350px] p-6"
      style={{ boxShadow: "8px 0 32px 0 rgba(130,138,255,0.10)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.96 }}
            className="p-2 rounded-full hover:bg-blue-100 transition-all cursor-pointer"
            style={{ boxShadow: "0 2px 8px 0 rgba(129,140,248,0.07)" }}
          >
            <ChevronLeft className="text-blue-600" size={20} />
          </motion.div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 drop-shadow">
            All Agents
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.97 }}
          className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow font-semibold hover:shadow-lg transition-all"
          onClick={onAdd}
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {/* Folders */}
      <div className="mt-6">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-4 px-2">
          Folders
        </h3>
        <div className="space-y-2">
          {folders.map((folder, idx) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + idx * 0.07, duration: 0.28 }}
              onMouseEnter={() => setHoveredItem(folder.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`transition-all`}
            >
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 py-3 px-3 rounded-xl cursor-pointer group 
                  ${hoveredItem === folder.id
                    ? "bg-gradient-to-r from-blue-100 to-cyan-50 shadow"
                    : "hover:bg-blue-50/80"
                  }
                `}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${folder.color} transition-all`}>
                  <span className={hoveredItem === folder.id ? "text-blue-700" : "text-blue-500"}>
                    {folder.icon}
                  </span>
                </div>
                <span className={`text-base font-medium transition-colors ${
                  hoveredItem === folder.id ? "text-blue-700" : "text-gray-700"
                }`}>
                  {folder.name}
                </span>
                {hoveredItem === folder.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full ml-auto shadow"
                  >
                    {Math.floor(Math.random() * 10 + 1)}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="mt-auto pt-4">
        <motion.button
          whileHover={{ backgroundColor: "#E0E7FF" }}
          className="flex items-center w-full gap-4 py-3 px-3 rounded-xl text-blue-700 hover:text-blue-900 font-semibold hover:bg-blue-50 transition-colors group bg-white border border-blue-100 shadow"
        >
          <Settings size={20} />
          <span className="text-base">Settings</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AgentSidebar;