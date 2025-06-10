import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      toast.error("All fields are required.", { theme: "colored" });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/signup",
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message || "Signup successful!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      setTimeout(() => {
        window.location.href = "/agents";
      }, 1500);
    } catch (error) {
      const errMsg =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Something went wrong. Please try again.";
      setError(errMsg);
      toast.error(errMsg, {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-[350px] gap-2 flex flex-col items-center justify-center animate-fade-in"
      autoComplete="off"
    >
      {error && (
        <div className="text-red-500 text-sm mb-2 animate-shake">{error}</div>
      )}
      <div className="w-[250px] relative">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onFocus={() => setFocusedField("name")}
          onBlur={() => setFocusedField(null)}
          placeholder="Name"
          className={`w-full px-4 py-2 rounded-lg bg-[#EDEDED] focus:outline-none transition-all duration-300
            ${focusedField === "name" ? "ring ring-blue-300 shadow-lg transform scale-105" : ""}
          `}
          required
        />
        <div
          className={`absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-300 ease-out
          ${focusedField === "name" ? "w-full" : "w-0"}`}
        ></div>
      </div>
      <div className="w-[250px] relative">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          placeholder="Email"
          className={`w-full px-4 py-2 rounded-lg bg-[#EDEDED] focus:outline-none transition-all duration-300
            ${focusedField === "email" ? "ring ring-blue-300 shadow-lg transform scale-105" : ""}
          `}
          required
        />
        <div
          className={`absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-300 ease-out
          ${focusedField === "email" ? "w-full" : "w-0"}`}
        ></div>
      </div>
      <div className="w-[250px] relative">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
          placeholder="Password"
          className={`w-full px-4 py-2 rounded-lg bg-[#EDEDED] focus:outline-none transition-all duration-300
            ${focusedField === "password" ? "ring ring-blue-300 shadow-lg transform scale-105" : ""}
          `}
          required
        />
        <div
          className={`absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-300 ease-out
          ${focusedField === "password" ? "w-full" : "w-0"}`}
        ></div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-1/3 bg-blue-500 text-white py-2 px-4 rounded-lg transition-all duration-300
        transform hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2
        ${loading ? "opacity-70 cursor-wait" : "hover:bg-blue-600"}
        `}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-1 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Signing up...
          </>
        ) : (
          "SIGN UP"
        )}
      </button>
      <style>{`
        .animate-fade-in {
          animation: fadeInUp 0.7s;
        }
        .animate-shake {
          animation: shake 0.35s;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes shake {
          0% { transform: translateX(0);}
          20% { transform: translateX(-6px);}
          40% { transform: translateX(6px);}
          60% { transform: translateX(-6px);}
          80% { transform: translateX(6px);}
          100% { transform: translateX(0);}
        }
      `}</style>
    </form>
  );
};

export default SignupForm;