import React from "react";
import { motion } from "framer-motion";

const Button = ({ label, type, animate }) => {
  const baseClass = "px-4 py-2 rounded text-white";
  const typeClass =
    type === "primary"
      ? "bg-blue-500 hover:bg-blue-600"
      : "bg-gray-200 text-gray-700";

  if (animate) {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`${baseClass} ${typeClass}`}
      >
        {label}
      </motion.button>
    );
  }

  return <button className={`${baseClass} ${typeClass}`}>{label}</button>;
};

export default Button;