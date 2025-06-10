import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pencil SVG Icon
const PencilIcon = ({ className }) => (
  <svg
    className={className}
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <rect x="2" y="2" width="20" height="20" rx="6" fill="#eef2ff" />
    <path d="M12 20h9" stroke="#6366f1" strokeWidth={2} />
    <path d="M16.5 6.5l1 1a1 1 0 010 1.4l-7 7a1 1 0 01-.7.3h-2v-2a1 1 0 01.3-.7l7-7a1 1 0 011.4 0z" stroke="#6366f1" />
  </svg>
);

const COLORS = {
  bg: "bg-gradient-to-tr from-blue-50 via-white to-blue-100",
  card: "bg-white/95 shadow-2xl rounded-2xl border border-blue-100",
  input: "border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60",
  inputDisabled: "bg-gray-100/70 text-gray-500",
  label: "text-blue-700 font-medium",
  button: "rounded-xl px-5 py-2 font-semibold transition-all duration-200",
  edit: "bg-indigo-500 hover:bg-indigo-600 text-white shadow",
  save: "bg-green-500 hover:bg-green-600 text-white shadow",
  cancel: "bg-gray-200 hover:bg-gray-300 text-blue-900 shadow",
  logout: "bg-red-500 hover:bg-red-600 text-white shadow-lg",
  divider: "border-l border-blue-100 mx-4 h-[80%] self-center",
  message: "text-green-700 bg-green-100 rounded-lg px-3 py-1 mb-2 animate-fade-in",
  error: "text-red-700 bg-red-100 rounded-lg px-3 py-1 mb-2 animate-shake",
};

const ProfilePage = () => {
  const { user, setUser, fetchUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || "", company: user?.company || "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();
  const isSocialLogin = user?.provider && user.provider !== "local";

  useEffect(() => {
    setProfile({ name: user?.name || "", company: user?.company || "" });
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setMessage(""); setError("");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!editMode) return;
    if (profile.name.trim() === "") {
      setError("Name cannot be empty.");
      return;
    }
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/me`, profile, { withCredentials: true });
      setUser(res.data.user);
      setMessage("Profile updated!");
      toast.success("Profile updated!");
      setEditMode(false);
      fetchUser();
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassErr(""); setPassMsg("");
    if (!passwords.oldPassword || !passwords.newPassword) {
      setPassErr("Both fields are required");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPassErr("New password must be at least 6 characters.");
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/auth/me/password`, passwords, { withCredentials: true });
      setPassMsg("Password updated!");
      toast.success("Password updated!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setPassErr(err.response?.data?.error || "Failed to update password");
      toast.error(err.response?.data?.error || "Failed to update password");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error("Logout failed");
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      navigate("/signin");
    }
  };

  if (!user) return (
    <div className={`flex h-screen items-center justify-center ${COLORS.bg}`}>
      <div className="animate-pulse text-blue-600 text-lg font-bold">Loading...</div>
    </div>
  );

  return (
    <div className={`h-screen w-full flex items-center justify-center ${COLORS.bg} rounded-xl`}>
      <div
        className={`w-full max-w-6xl mx-auto ${COLORS.card} p-4 sm:p-6 flex flex-col sm:flex-row gap-6 sm:gap-0 items-stretch justify-center`}
        style={{ minHeight: 360, maxHeight: 520, height: "65vh" }}
      >
        {/* Profile Show Section */}
        <div className="flex flex-col items-center w-full sm:w-[30%] py-6 px-4 bg-yellow-50 rounded-lg shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-400 to-blue-300 shadow-lg flex items-center justify-center mb-3 animate-fade-in-slow">
              <span className="text-4xl font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-800 mb-1">Welcome, {user.name}</h1>
            <span className="text-blue-400 font-semibold text-sm sm:text-base mb-4">{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className={COLORS.button + " " + COLORS.logout + " w-36 text-base sm:text-lg mt-2"}
          >
            Logout
          </button>
        </div>
        <div className={COLORS.divider + " hidden sm:block"}></div>
        {/* Profile Update Section */}
        <div className="flex flex-col w-full sm:w-[35%] py-4 px-2">
          <form onSubmit={handleProfileUpdate} className="flex flex-col h-full gap-2">
            {/* TITLE WITH EDIT ICON */}
            <div className="flex items-center mb-4">
              <span className="text-lg sm:text-xl font-bold text-blue-700 mr-2">Profile Details</span>
              {!editMode && (
                <button
                  type="button"
                  aria-label="Edit profile"
                  className="ml-2 flex items-center rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-1.5 transition group relative"
                  onClick={() => { setEditMode(true); setShowTooltip(false); }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  tabIndex={0}
                >
                  <PencilIcon className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition" />
                  {/* Tooltip */}
                  {showTooltip && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/80 text-xs text-white rounded px-2 py-1 z-10 animate-fade-in pointer-events-none">
                      Edit profile
                    </div>
                  )}
                </button>
              )}
            </div>
            {/* FORM FIELDS */}
            <div>
              <div className="mb-2">
                <label className={COLORS.label + " mb-1"}>Username</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 sm:py-3 ${COLORS.input} ${editMode ? "" : COLORS.inputDisabled} rounded-xl text-base sm:text-lg transition`}
                  disabled={!editMode}
                  required
                />
              </div>
              <div className="mb-2">
                <label className={COLORS.label + " mb-1"}>Email</label>
                <input
                  value={user.email}
                  className={`w-full px-4 py-2 sm:py-3 ${COLORS.input} ${COLORS.inputDisabled} rounded-xl text-base sm:text-lg`}
                  disabled
                />
              </div>
              <div className="mb-2">
                <label className={COLORS.label + " mb-1"}>Company</label>
                <input
                  name="company"
                  value={profile.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 sm:py-3 ${COLORS.input} ${editMode ? "" : COLORS.inputDisabled} rounded-xl text-base sm:text-lg`}
                  disabled={!editMode}
                />
              </div>
              {message && <div className={COLORS.message}>{message}</div>}
              {error && <div className={COLORS.error}>{error}</div>}
            </div>
            {/* Save and Cancel at the bottom in editMode */}
            {editMode && (
              <div className="flex gap-2 mt-3 mb-1 justify-end">
                <button
                  onClick={handleProfileUpdate}
                  type="button"
                  className={COLORS.button + " " + COLORS.save}
                  style={{ minWidth: 80 }}
                >Save</button>
                <button
                  type="button"
                  className={COLORS.button + " " + COLORS.cancel}
                  onClick={() => {
                    setEditMode(false);
                    setProfile({ name: user.name, company: user.company || "" });
                    setMessage(""); setError("");
                  }}
                  style={{ minWidth: 80 }}
                >Cancel</button>
              </div>
            )}
          </form>
        </div>
        <div className={COLORS.divider + " hidden sm:block"}></div>
        {/* Password Update Section */}
        <div className={`flex flex-col justify-between w-full sm:w-[35%] py-4 px-2 relative`}>
          {isSocialLogin && (
            <div className={COLORS.notice + " absolute h-full w-full justify-center p-10 z-20 flex items-center gap-3"}>
              <svg width="80" height="80" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#fbbf24" />
                <path d="M12 8v4m0 4h.01" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Notice: Password update is not allowed for accounts created with social sign-in.
            </div>
          )}
          <form
            onSubmit={handlePasswordChange}
            className={`h-full flex flex-col transition-all duration-200 ${isSocialLogin ? "opacity-60 pointer-events-none select-none blur-[1px]" : ""}`}
            style={isSocialLogin ? { filter: "blur(1.5px)", pointerEvents: "none", userSelect: "none" } : {}}
          >
            <div>
              <h2 className="text-lg font-bold text-blue-700 mb-3">Update Password</h2>
              <div className="mb-2">
                <input
                  type="password"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  placeholder="Current Password"
                  onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  className={`w-full ${COLORS.input} rounded-xl px-4 py-2 sm:py-3 text-base sm:text-lg transition`}
                  autoComplete="current-password"
                  disabled={isSocialLogin}
                />
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  placeholder="New Password"
                  onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className={`w-full ${COLORS.input} rounded-xl px-4 py-2 sm:py-3 text-base sm:text-lg transition`}
                  autoComplete="new-password"
                  disabled={isSocialLogin}
                />
              </div>
              {passMsg && <div className={COLORS.message}>{passMsg}</div>}
              {passErr && <div className={COLORS.error + " animate-shake"}>{passErr}</div>}
            </div>
            <button
              type="submit"
              className={COLORS.button + " " + COLORS.edit + " w-full mt-2"}
              disabled={isSocialLogin}
              style={isSocialLogin ? { cursor: "not-allowed" } : {}}
            >
              Change Password
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
      {/* Animations with TailwindCSS */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s;
        }
        .animate-fade-in-slow {
          animation: fadeIn 1.2s;
        }
        .animate-shake {
          animation: shake 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px);}
          50% { transform: translateX(5px);}
          75% { transform: translateX(-5px);}
          100% { transform: translateX(0);}
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;