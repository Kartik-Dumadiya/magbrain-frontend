import React, { useState } from "react";
import { agentTypeTabs, templateOptions } from "../data/templateOptions";

// You may replace with an <X /> icon from lucide-react if you wish
export default function AgentTemplateModal({ open, agentType, onClose, onSelect }) {
  const [selectedTab, setSelectedTab] = useState(agentType || "single-prompt");

  if (!open) return null;
  const templates = templateOptions[selectedTab] || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-[90vw] min-w-[900px] min-h-[440px] flex p-0 relative animate-fade-in border border-blue-100">
        {/* Close button */}
        <button
          className="absolute top-6 right-7 text-gray-400 hover:text-blue-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Left: Tabs */}
        <div className="w-64 bg-gradient-to-b from-blue-50 to-white py-10 px-8 border-r border-blue-100 rounded-l-2xl">
          <div className="text-lg font-bold mb-8 text-blue-700">Select Template</div>
          <div className="flex flex-col gap-2">
            {agentTypeTabs.map((tab) => (
              <button
                key={tab.key}
                className={`text-base px-4 py-2 rounded-xl font-medium text-left transition ${
                  selectedTab === tab.key
                    ? "bg-blue-100 text-blue-800 shadow"
                    : "text-blue-500 hover:bg-blue-50"
                }`}
                disabled={selectedTab === tab.key}
                onClick={() => setSelectedTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Right: Templates */}
        <div className="flex-1 px-12 py-10 grid grid-cols-3 gap-8 overflow-y-auto bg-white rounded-r-2xl">
          {templates.map((tpl) => (
            <button
              key={tpl.key}
              onClick={() => onSelect(selectedTab, tpl.key)}
              className="border border-blue-100 rounded-2xl shadow-sm bg-gradient-to-br from-white via-blue-50 to-cyan-50 flex flex-col items-center hover:shadow-lg hover:border-blue-400 focus:border-blue-400 transition px-6 py-8 group"
            >
              <div className="w-full flex-1 flex items-center justify-center mb-2">
                {tpl.icon}
              </div>
              <div className="text-center w-full">
                <div className="font-semibold text-base text-blue-700 group-hover:text-blue-900 mt-2">
                  {tpl.title}
                </div>
                {tpl.subtitle && (
                  <div className="text-xs text-blue-400 font-semibold mb-1 mt-1">
                    {tpl.subtitle}
                  </div>
                )}
                <div className="text-sm text-gray-600 mt-1">
                  {tpl.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Animation */}
      <style>{`
        .animate-fade-in { animation: fadeInModal .22s; }
        @keyframes fadeInModal { from { opacity:0; transform: translateY(24px);} to {opacity:1; transform: none;} }
      `}</style>
    </div>
  );
}