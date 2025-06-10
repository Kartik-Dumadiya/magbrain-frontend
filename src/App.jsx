import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import SigninPage from "./pages/SigninPage";
import SignupPage from './pages/SignupPage';
import ProfilePage from "./pages/ProfilePage";
import AgentsPage from "./pages/AgentsPage";
import AgentPageRouter from "./pages/AgentPageRouter";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="agent/:bot_id" element={<AgentPageRouter />} />

        {/* Redirect "/" to "/agents" */}
        <Route path="/" element={<Navigate to="/agents" replace />} />

        {/* Private Routes (Wrapped in Layout) */}
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="voice-ai" element={<Dashboard />} />
          <Route path="analytics" element={<Dashboard />} />
          <Route path="billing" element={<Dashboard />} />
          <Route path="api-key" element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          {/* Add more routes here */}
        </Route>

        {/* (Optional) Catch-all: redirect any unknown path to /agents */}
        <Route path="*" element={<Navigate to="/agents" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;