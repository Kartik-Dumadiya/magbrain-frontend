import React from "react";
import { useUser } from "../context/UserContext";

const Dashboard = () => {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white shadow rounded p-6 max-w-md">
        <h2 className="text-lg font-semibold mb-2">Welcome, {user?.name || "User"}!</h2>
        <div className="mb-2"><strong>Email:</strong> {user?.email}</div>
        <div className="mb-2"><strong>Company:</strong> {user?.company || <span className="italic text-gray-400">Not set</span>}</div>
      </div>
    </div>
  );
};

export default Dashboard;