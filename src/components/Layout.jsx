import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
        {/* Main Content (Dynamic) */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      
    </div>
  );
};

export default Layout;