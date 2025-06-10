import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SinglePromptAgentPage from "./SinglePromptAgentPage";
import FlowAgentDesignerPage from "./FlowAgentDesignerPage";
import MultiPromptAgentPage from "./MultiPromptAgentPage";
import axios from "axios";

export default function AgentPageRouter() {
  const { bot_id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/agents/${bot_id}`, { withCredentials: true })
      .then(res => { setAgent(res.data.agent); setLoading(false); })
      .catch(() => setLoading(false));
  }, [bot_id]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!agent) return <div className="text-center text-red-500 mt-16">Agent not found.</div>;

  switch (agent.agent_type) {
    case "single-prompt":
      return <SinglePromptAgentPage agent={agent} />;
    case "conversation-flow":
      return <FlowAgentDesignerPage agent={agent} />;
    case "multi-prompt":
      return <MultiPromptAgentPage agent={agent} />;
    default:
      return <div className="text-center text-red-500 mt-16">Unknown agent type.</div>;
  }
}