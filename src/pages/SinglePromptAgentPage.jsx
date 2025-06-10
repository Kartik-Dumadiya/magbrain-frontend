/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import LLMChatPanel from "../components/LLMChatPanel";

// Example model and language options
const modelOptions = [
  "gpt-4.1", "gpt-4", "gpt-3.5", "magbrain-llm"
];
const voiceOptions = [
  { label: "Cimo", value: "cimo" },
];
const languageOptions = [
  { label: "English", value: "en", icon: "🇺🇸" },
  // Add more languages as needed
];

const defaultAgentName = "Single-Prompt Agent";

// Color theme
const colors = {
  primary: "#4f46e5", // Indigo
  primaryLight: "#818cf8",
  secondary: "#f97316", // Orange
  background: "#f8fafc",
  card: "#ffffff",
  text: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  hoverBg: "#f1f5f9",
  success: "#10b981",
  error: "#ef4444",
};

export default function SinglePromptAgentPage() {
  const { bot_id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Fetch agent info
  useEffect(() => {
    axios.get(`http://localhost:3000/agents/${bot_id}`, { withCredentials: true })
      .then(res => setAgent(res.data.agent))
      .catch(() => setAgent(null))
      .finally(() => setLoading(false));
  }, [bot_id]);

  // Handle input changes
  const handleChange = (field, value) => {
    setAgent(a => ({ ...a, [field]: value }));
  };

  // Save agent (PUT)
  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:3000/agents/${bot_id}`, agent, { withCredentials: true });
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    } catch (err) {
      alert("Error saving agent!");
        console.error(err);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" 
          style={{ borderColor: `${colors.primary} transparent ${colors.primary} ${colors.primary}` }}
        />
        <p className="mt-4 text-lg font-medium text-slate-700">Loading agent data...</p>
      </motion.div>
    </div>
  );
  
  if (!agent) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 flex flex-col items-center justify-center h-screen"
    >
      <div className="p-8 bg-red-50 rounded-lg border border-red-200 text-red-600 flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold mb-2">Agent Not Found</h2>
        <p>We couldn't find the agent you're looking for.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors duration-200 rounded-md font-medium"
        >
          Go Back
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Toast Notification */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-md shadow-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Agent saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-700 text-xl mr-3 flex items-center justify-center h-8 w-8 rounded-full hover:bg-slate-100 transition-colors duration-200"
            title="Back"
          >
            &lt;
          </motion.button>
          {editName ? (
            <input
              className="text-xl font-semibold border-b-2 border-indigo-300 focus:border-indigo-500 focus:outline-none px-1 py-1"
              value={agent.name || defaultAgentName}
              onChange={e => handleChange("name", e.target.value)}
              onBlur={() => setEditName(false)}
              autoFocus
              style={{ minWidth: 150 }}
            />
          ) : (
            <div className="flex items-center">
              <span
                className="text-xl font-semibold cursor-pointer group flex items-center"
                onClick={() => setEditName(true)}
              >
                {agent.name || defaultAgentName}
                <span className="ml-2 text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" title="Rename">✎</span>
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <span className="font-medium text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
            Agent ID: <span className="font-mono">{agent.bot_id?.slice(0, 6)}...</span>
          </span>
          <span className="font-medium text-sm text-slate-500 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full">
            <svg width="16" height="16" className="inline-block" fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" stroke="#CBD5E1" strokeWidth="2"/><circle cx="8" cy="8" r="3" fill="#A3A3A3"/>
            </svg>
            $0.115/min
          </span>
          <span className="font-medium text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
            970-1300ms latency
          </span>
        </div>
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold text-slate-700 shadow-sm transition-all duration-200"
          >
            Create
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold text-slate-700 shadow-sm transition-all duration-200"
          >
            Simulation
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={saving}
            onClick={handleSave}
            className={`ml-3 rounded-lg text-white px-6 py-2 font-semibold transition-all duration-200 shadow-sm ${saving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            style={{ background: saving ? colors.primaryLight : colors.primary }}
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : "Publish"}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Settings & Prompt */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 flex flex-col px-8 py-6 bg-slate-50"
        >
          {/* Top Selectors */}
          <div className="flex items-center gap-5 mb-5">
            {/* Model */}
            <div className="relative">
              <select
                className="border border-slate-200 px-4 py-2 pr-10 rounded-lg font-semibold bg-white appearance-none shadow-sm hover:border-indigo-300 transition-colors duration-200"
                value={agent.model_name}
                onChange={e => handleChange("model_name", e.target.value)}
              >
                {modelOptions.map(m => <option value={m} key={m}>{m.toUpperCase()}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            {/* Voice */}
            <div className="relative">
              <select
                className="border border-slate-200 px-4 py-2 pr-10 rounded-lg font-semibold bg-white appearance-none shadow-sm hover:border-indigo-300 transition-colors duration-200"
                value={agent.voice || "cimo"}
                onChange={e => handleChange("voice", e.target.value)}
              >
                {voiceOptions.map(v => <option value={v.value} key={v.value}>{v.label}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            {/* Language */}
            <div className="relative">
              <select
                className="border border-slate-200 px-4 py-2 pr-10 rounded-lg font-semibold bg-white appearance-none shadow-sm hover:border-indigo-300 transition-colors duration-200"
                value={agent.language || "en"}
                onChange={e => handleChange("language", e.target.value)}
              >
                {languageOptions.map(l => (
                  <option value={l.value} key={l.value}>
                    {l.icon ? l.icon + " " : ""}{l.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Prompt textarea */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative mb-6"
          >
            <textarea
              className="w-full h-52 border border-slate-200 rounded-lg p-4 text-md font-mono resize-none shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 focus:outline-none transition-all duration-200"
              placeholder="Type in a universal prompt for your agent, such as its role, conversational style, objective, etc."
              value={agent.prompt || ""}
              onChange={e => handleChange("prompt", e.target.value)}
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white px-2 py-1 rounded-md opacity-70">
              {agent.prompt?.length || 0} characters
            </div>
          </motion.div>
          
          {/* Welcome message */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-3"
          >
            <label className="font-semibold mb-2 block text-slate-700">Welcome Message</label>
            <input
              className="border border-slate-200 w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 focus:outline-none transition-all duration-200"
              value={agent.welcome_message || ""}
              onChange={e => handleChange("welcome_message", e.target.value)}
              placeholder="Enter a welcome message for your agent"
            />
          </motion.div>
        </motion.div>
        
        {/* Center: Accordion Settings */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-[350px] bg-white border-x border-slate-200 px-5 py-6 overflow-y-auto"
        >
          <AgentAccordionSettings />
        </motion.div>
        
        {/* Right: Test Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="w-[480px] bg-white px-5 py-6 flex flex-col items-center"
        >
          <TestAgentPanel agent={agent}/>
        </motion.div>
      </div>
    </div>
  );
}

// Accordion section
function AgentAccordionSettings() {
  const sections = [
    { id: "functions", name: "Functions", icon: "⚙️" },
    { id: "knowledge", name: "Knowledge Base", icon: "📚" },
    { id: "speech", name: "Speech Settings", icon: "🔊" },
    { id: "call", name: "Call Settings", icon: "📞" },
    { id: "analysis", name: "Post-Call Analysis", icon: "📊" },
    { id: "security", name: "Security & Fallback Settings", icon: "🔒" },
    { id: "webhook", name: "Webhook Settings", icon: "🔗" }
  ];
  
  const [open, setOpen] = useState(null);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-slate-700">Agent Configuration</h2>
      {sections.map((sec, idx) => (
        <motion.div 
          key={sec.id} 
          className="mb-3"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
        >
          <motion.button
            whileHover={{ backgroundColor: "#f1f5f9" }}
            onClick={() => setOpen(open === idx ? null : idx)}
            className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left rounded-lg hover:bg-slate-50 border border-slate-200 shadow-sm transition-colors duration-200"
          >
            <span className="flex items-center">
              <span className="mr-2">{sec.icon}</span>
              {sec.name}
            </span>
            <motion.span
              animate={{ rotate: open === idx ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.span>
          </motion.button>
          <AnimatePresence>
            {open === idx && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-2 ml-2 p-3 text-slate-600 text-sm bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center mb-2">
                    <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mr-2">{sec.icon}</span>
                    <h3 className="font-medium">{sec.name}</h3>
                  </div>
                  <p>{sec.name} configuration options will appear here.</p>
                  <div className="mt-2 flex justify-end">
                    <button className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-200">
                      Configure {sec.name.toLowerCase()} →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// Test Panel
function TestAgentPanel( { agent}) {
  const [testActive, setTestActive] = useState(false);
  const [testMode, setTestMode] = useState('audio');

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">Test Your Agent</h2>
      <div className="mb-6 flex gap-2 w-full">
        <button 
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${testMode === 'audio' 
            ? 'bg-orange-100 text-orange-700 border border-orange-200' 
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          onClick={() => setTestMode('audio')}
        >
          Test Audio
        </button>
        <button 
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${testMode === 'llm' 
            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          onClick={() => setTestMode('llm')}
        >
          Test LLM
        </button>
        <button className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors duration-200">
          <span>{"{}"}</span>
        </button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center p-2 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 h-full">
        {testMode === 'llm' ? (
          <LLMChatPanel agent={agent} />
        ) : testActive ? (
          // ... your existing audio test code ...
          <motion.div> ... </motion.div>
        ) : (
          // ... your existing non-active audio test UI ...
          <motion.div> ... </motion.div>
        )}
      </div>
    </div>
  );
}