/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const agentTypes = [
  {
    key: "conversation-flow",
    icon: (
      <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#f1f5fd"/><path d="M7 11h4v2H7v-2zm6 0h4v2h-4v-2z" fill="#3b82f6"/></svg>
    ),
    title: "Conversation Flow Agent",
    desc: "For tasks with complex transitions"
  },
  {
    key: "single-prompt",
    icon: (
      <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#ecfdf5"/><rect x="9" y="7" width="6" height="10" rx="1" fill="#10b981"/></svg>
    ),
    title: "Single Prompt Agent",
    desc: "For short calls and straightforward tasks"
  },
  {
    key: "multi-prompt",
    icon: (
      <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#fefce8"/><rect x="6" y="7" width="3" height="10" rx="1" fill="#f59e42"/><rect x="10.5" y="9" width="3" height="6" rx="1" fill="#f59e42"/><rect x="15" y="11" width="3" height="2" rx="1" fill="#f59e42"/></svg>
    ),
    title: "Multi-Prompt Agent",
    desc: "For lengthy calls and complex tasks"
  },
  {
    key: "custom-llm",
    icon: (
      <svg className="w-7 h-7 text-purple-500" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#f5f3ff"/><path d="M8 12h8M12 8v8" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="#a78bfa" strokeWidth="2"/></svg>
    ),
    title: "Custom LLM",
    desc: "Attach your custom LLM link"
  }
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
  exit: { opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.18 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: i => ({
    opacity: 1,
    x: 5,
    transition: { delay: 0.1 * i , duration: 0 }
  })
};

export default function CreateAgentDropdown({ onSelect }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.045 }}
        whileTap={{ scale: 0.97 }}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition flex items-center gap-2 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Create an Agent
        </span>
        <span className="ml-2">
          <svg className="w-4 h-4 text-white opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-blue-100 z-50 py-2 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
          >
            {agentTypes.map((t, i) => (
              <motion.button
                key={t.key}
                className="flex items-center w-full px-5 py-4 group hover:bg-blue-50/70 transition duration-700 text-left gap-4"
                onClick={() => {
                  setOpen(false);
                  onSelect && onSelect(t.key);
                }}
                custom={i}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={itemVariants}
              >
                <span className="transition group-hover:scale-110">{t.icon}</span>
                <div>
                  <div className="font-semibold text-base text-gray-900 group-hover:text-blue-700 transition">{t.title}</div>
                  <div className="text-xs text-gray-500 group-hover:text-blue-500 transition">{t.desc}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}