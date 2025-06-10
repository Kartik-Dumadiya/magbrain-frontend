import React from "react";
import { FaEllipsisV } from "react-icons/fa";
import defaultAvatar from "../assets/profile.png";
import { useNavigate } from "react-router-dom";

const agentTypeMap = {
  "single-prompt": "Single Prompt",
  "conversation-flow": "Conversation Flow",
};

const AgentRow = ({ agent, user }) => {
  // For now, hardcode type & voice. You can use agent fields if they exist.
  const agentType = agent.agentType || "single-prompt";
  const voice = "Cimo";
  const editedBy = user?.name || "User";
  const editedTime = new Date(agent.updatedAt).toLocaleString();

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="py-3 px-4 flex items-center gap-3 cursor-pointer" onClick={() => window.open(`/agent/${agent.bot_id}`, '_blank')}>
        <span className="bg-gray-100 p-2 rounded-full">
          <svg width="24" height="24" fill="none"><path d="M12 2C8.13..." fill="#757575"/></svg>
        </span>
        <span className="font-medium text-gray-800">{agent.prompt || "Single-Prompt Agent"}</span>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700`}>
          {agentTypeMap[agentType] || "Single Prompt"}
        </span>
      </td>
      <td className="py-3 px-4">
        <img src={defaultAvatar} className="inline w-7 h-7 rounded-full mr-1 border" alt="Voice" />
        <span>{voice}</span>
      </td>
      <td className="py-3 px-4">-</td>
      <td className="py-3 px-4">{editedTime}</td>
      <td className="py-3 px-4 text-right">
        <button className="p-2 rounded hover:bg-gray-100"><FaEllipsisV /></button>
      </td>
    </tr>
  );
};

export default AgentRow;