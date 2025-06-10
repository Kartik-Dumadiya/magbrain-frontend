import React, { useEffect } from "react";
import NodeSidebar from "../components/FlowDesigner/NodeSidebar";
import FlowCanvas from "../components/FlowDesigner/FlowCanvas";
import NodeProperties from "../components/FlowDesigner/NodeProperties";
import { useFlowDesignerStore } from "../store/flowDesignerStore";
import { fetchFlow, saveFlow } from "../api/flowDesignerApi";
import { toast } from "react-toastify";

export default function FlowAgentDesignerPage({ agent }) {
  const { setAll } = useFlowDesignerStore();

  useEffect(() => {
    fetchFlow(agent.bot_id)
      .then((res) => {
        const { nodes, edges, metadata, name, _id } = res.data.flow || {};
        setAll({
          nodes: nodes || [
            {
              id: "begin",
              type: "begin",
              position: { x: 100, y: 60 },
              data: {},
            },
          ],
          edges: edges || [],
          metadata: metadata || { voice: "English", language: "English", globalPrompt: "" },
          flowName: name || agent.name || "Untitled Agent",
          flowId: _id || null,
        });
      })
      .catch(async (err) => {
        if (err.response?.status === 404) {
          // Flow not found, create a default flow
          try {
            const defaultFlow = {
              name: agent.name || "Untitled Agent",
              nodes: [
                {
                  id: "begin",
                  type: "begin",
                  position: { x: 100, y: 60 },
                  data: {},
                },
              ],
              edges: [],
              metadata: { voice: "English", language: "English", globalPrompt: "" },
              agentId: agent.bot_id,
            };
            const res = await saveFlow(defaultFlow);
            setAll({
              nodes: defaultFlow.nodes,
              edges: defaultFlow.edges,
              metadata: defaultFlow.metadata,
              flowName: defaultFlow.name,
              flowId: res.data.flow._id,
            });
            toast.success("Created new flow for agent");
          } catch (createErr) {
            console.error("Error creating default flow:", createErr);
            toast.error("Failed to create default flow");
            // Fallback to empty state
            setAll({
              nodes: [
                {
                  id: "begin",
                  type: "begin",
                  position: { x: 100, y: 60 },
                  data: {},
                },
              ],
              edges: [],
              metadata: { voice: "English", language: "English", globalPrompt: "" },
              flowName: agent.name || "Untitled Agent",
              flowId: null,
            });
          }
        } else {
          console.error("Error fetching flow:", err);
          toast.error("Failed to load flow data");
          setAll({
            nodes: [
              {
                id: "begin",
                type: "begin",
                position: { x: 100, y: 60 },
                data: {},
              },
            ],
            edges: [],
            metadata: { voice: "English", language: "English", globalPrompt: "" },
            flowName: agent.name || "Untitled Agent",
            flowId: null,
          });
        }
      });
  }, [agent.bot_id, agent.name, setAll]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <div className="w-1/6 border-r bg-white/95">
        <NodeSidebar />
      </div>
      <div className="flex-1 min-w-0">
        <FlowCanvas />
      </div>
      <div className="w-1/4 border-l bg-white/95 flex flex-col">
        <NodeProperties agent={agent} />
      </div>
    </div>
  );
}