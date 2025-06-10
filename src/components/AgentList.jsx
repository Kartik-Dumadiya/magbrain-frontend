import React, { useState } from "react";
import defaultAvatar from "../assets/profile.png";
import agentIcon from "../assets/robot.png";

const typeLabels = {
  "single-prompt": "Single Prompt",
  "multi-prompt": "Multi Prompt",
  "conversation-flow": "Conversation Flow",
  "custom-llm": "Custom LLM",
};

const typeBadge = (type) => (
  <span
    className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 shadow-sm"
    style={{ border: "1px solid #e5e7eb" }}
  >
    {typeLabels[type] || type}
  </span>
);

const formatDateTime = (isoString) => {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "-";
  }
};

const AgentList = ({ agents, loading, searchQuery = "", onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(null); // which row's menu is open

  // Close menu on click outside
  React.useEffect(() => {
    const handler = () => setMenuOpen(null);
    if (menuOpen !== null) {
      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
    }
  }, [menuOpen]);

  const handleMenuClick = (e, idx) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === idx ? null : idx);
  };

  // Delete handler
  const handleDeleteAgent = (e, agent) => {
    e.stopPropagation();
    setMenuOpen(null);
    onDelete?.(agent);

  };

  return (
    <div className="w-full min-h-[340px] bg-transparent">
      <table className="w-full border-spacing-0 border-separate" style={{ borderRadius: 12, overflow: "hidden" }}>
        <thead>
          <tr className="text-left text-gray-500" style={{ background: "#f5f7fa" }}>
            <th className="font-semibold py-4 px-4 rounded-tl-xl">Agent Name</th>
            <th className="font-semibold py-4 px-4">Agent Type</th>
            <th className="font-semibold py-4 px-4">Voice</th>
            <th className="font-semibold py-4 px-4">Phone</th>
            <th className="font-semibold py-4 px-4">Edited by</th>
            <th className="font-semibold py-4 px-4 rounded-tr-xl"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-gray-400 bg-white">
                Loading...
              </td>
            </tr>
          ) : agents.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-gray-400 bg-white">
                No agents found.
              </td>
            </tr>
          ) : (
            agents
              .filter(agent => agent.name?.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((agent, idx, arr) => {
                const isDropUp = idx >= arr.length - 1;

                return <tr
                  key={agent.bot_id || idx}
                  className="transition hover:bg-amber-300 border-b cursor-pointer"
                  style={{
                    background: idx % 2 === 0 ? "#fff" : "#f8fafc",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                  onClick={() => window.open(`/agent/${agent.bot_id}`, "_blank")}
                  title="Open agent details"
                >
                  {/* Agent Name & Icon */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={agentIcon}
                        alt="Agent Icon"
                        className="w-8 h-8 rounded-md bg-gray-100 border border-gray-200"
                      />
                      <span className="font-medium text-gray-900">{agent.name}</span>
                    </div>
                  </td>
                  {/* Agent Type badge */}
                  <td className="py-4 px-4 align-middle">{typeBadge(agent.agent_type)}</td>
                  {/* Voice Avatar + Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={defaultAvatar}
                        alt="Voice Avatar"
                        className="w-7 h-7 rounded-full border border-gray-200 object-cover"
                      />
                      <span className="font-medium text-gray-800">{agent.voice || "Cimo"}</span>
                    </div>
                  </td>
                  {/* Phone */}
                  <td className="py-4 px-4 text-gray-500 font-medium">-</td>
                  {/* Edited by and date */}
                  <td className="py-4 px-4 text-gray-700">
                    <div className="flex flex-col">
                      <span className="font-normal">
                        {formatDateTime(agent.updatedAt)}
                      </span>
                    </div>
                  </td>
                  {/* Actions (dots) */}
                  <td className="py-4 px-4 text-right relative">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                      aria-label="More"
                      onClick={e => handleMenuClick(e, idx)}
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                        <circle cx="10" cy="4.5" r="1.5" fill="#6B7280" />
                        <circle cx="10" cy="10" r="1.5" fill="#6B7280" />
                        <circle cx="10" cy="15.5" r="1.5" fill="#6B7280" />
                      </svg>
                    </button>
                    {/* Dropdown Menu */}
                    {menuOpen === idx && (
                      <div
                        className={`absolute right-2 z-10 min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg py-1
              ${isDropUp ? "bottom-10 mb-2" : "mt-2"}`}
                        style={isDropUp ? { bottom: "2.5rem", top: "auto" } : { top: "2.5rem", bottom: "auto" }}
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50"
                          onClick={e => handleDeleteAgent(e, agent)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AgentList;