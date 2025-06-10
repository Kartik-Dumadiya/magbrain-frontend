import React from "react";

const OAuthButton = ({ icon, label }) => {
  return (
    <button
      className="flex items-center justify-center w-12 h-12 text-white bg-gray-800 rounded-full hover:bg-gray-700 transition"
      aria-label={`Sign in with ${label}`}
    >
      {icon}
    </button>
  );
};

export default OAuthButton;