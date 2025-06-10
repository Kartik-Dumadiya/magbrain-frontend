import React, { useEffect, useState } from "react";
import { useFlowDesignerStore } from "../../store/flowDesignerStore";
import { saveFlow, updateFlow } from "../../api/flowDesignerApi";
import { updateAgent } from "../../api/agentApi";
import { toast } from "react-toastify";
import { Edit2, Sparkles, Sigma } from "lucide-react";

const voices = ["English", "Spanish", "French", "German"];
const languages = ["English", "Spanish", "French", "German"];

// Helper for transition icon
function TransitionTypeIcon({ type }) {
  if (type === "prompt") {
    return <Sparkles size={16} className="text-blue-500" title="Prompt" />;
  }
  if (type === "equation") {
    return <Sigma size={16} className="text-blue-700" title="Equation" />;
  }
  return null;
}

export default function NodeProperties({ agent }) {
  const {
    selectedNodeId,
    nodes,
    setNodeData,
    metadata,
    setMetadata,
    flowId,
    flowName,
    setFlowName,
    edges,
    resetSelection,
    deleteNode,
    resetStore,
  } = useFlowDesignerStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const [agentName, setAgentName] = useState(agent.name || flowName);

  const handleAgentNameChange = async (e) => {
    const newName = e.target.value;
    setFlowName(newName);
    setAgentName(newName);
    try {
      await updateAgent(agent.bot_id, { name: newName });
    } catch (err) {
      toast.error("Failed to update agent name!");
      console.error("Error updating agent name:", err);
    }
  };

  useEffect(() => {
    setAgentName(agent.name || flowName);
  }, [agent.name, flowName]);

  const handleSave = async () => {
    const payload = {
      name: flowName,
      nodes,
      edges,
      metadata,
      agentId: agent.bot_id,
    };
    try {
      if (flowId) {
        await updateFlow(flowId, payload);
        toast.success("Flow updated!");
      } else {
        const res = await saveFlow(payload);
        useFlowDesignerStore.setState({ flowId: res.data.flow._id });
        toast.success("Flow saved!");
      }
    } catch (err) {
      toast.error("Error saving flow!");
      console.error("Error saving flow:", err);
    }
  };

  function renderNodeForm() {
    if (!selectedNode) return null;
    switch (selectedNode.type) {
      case "conversation":
        return (
          <div>
            <label className="font-semibold text-[var(--text-strong-950,#0E121B)] mb-1 block">Bot Message</label>
            <textarea
              className="w-full rounded-md bg-[var(--bg-white-0,#fff)] p-3 text-sm border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring,#2563EB)] min-h-[120px] resize-none"
              value={selectedNode.data.message || ""}
              placeholder="[Bot message here]"
              onChange={(e) =>
                setNodeData(selectedNode.id, { ...selectedNode.data, message: e.target.value })
              }
            />
            <div className="mt-4 font-semibold text-[var(--text-strong-950,#0E121B)]">Transitions</div>
            {selectedNode.data.transitions?.map((t, idx) => (
              <div key={idx} className="flex items-center gap-1 rounded-md bg-[var(--bg-weak-50,#F3F4F6)] p-2 py-3 relative">
                <div className="flex items-center gap-2 min-w-[26px]">
                  <TransitionTypeIcon type={t.type} />
                </div>
                {/* Prompt transition: show label input. Equation: show summary or a button */}
                {t.type === "prompt" ? (
                  <input
                    className="flex-1 bg-transparent border-none text-xs text-[var(--text-sub-600,#6B7280)] focus:outline-none"
                    value={t.label || ""}
                    placeholder="Set a condition"
                    onChange={(e) => {
                      const arr = [...(selectedNode.data.transitions || [])];
                      arr[idx] = { ...arr[idx], label: e.target.value };
                      setNodeData(selectedNode.id, { ...selectedNode.data, transitions: arr });
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    className="flex-1 text-xs text-blue-700 text-left underline hover:no-underline bg-transparent"
                    // You can add logic to open a popup for editing equation transitions
                  >
                    {(!t.conditions || !t.conditions.length)
                      ? "Set a condition"
                      : t.conditions
                          .map(
                            (cond) =>
                              `${cond.var || "?"} ${cond.op || "="} "${cond.value || "?"}"`
                          )
                          .join(t.mode === "all" ? " AND " : " OR ")}
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <button
                    className="text-[var(--icon-sub-600,#6B7280)] hover:text-[#68123d]"
                    onClick={() => {
                      // You can trigger edit logic here if needed
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="text-[var(--icon-sub-600,#6B7280)] hover:text-red-500"
                    onClick={() => {
                      const arr = (selectedNode.data.transitions || []).filter((_, i) => i !== idx);
                      setNodeData(selectedNode.id, { ...selectedNode.data, transitions: arr });
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.375 4.95H15.75V6.3H14.4V15.075C14.4 15.254 14.3289 15.4257 14.2023 15.5523C14.0757 15.6789 13.904 15.75 13.725 15.75H4.275C4.09598 15.75 3.92429 15.6789 3.7977 15.5523C3.67112 15.4257 3.6 15.254 3.6 15.075V6.3H2.25V4.95H5.625V2.925C5.625 2.74598 5.69612 2.57429 5.8227 2.4477C5.94929 2.32112 6.12098 2.25 6.3 2.25H11.7C11.879 2.25 12.0507 2.32112 12.1773 2.4477C12.3039 2.57429 12.375 2.74598 12.375 2.925V4.95ZM13.05 6.3H4.95V14.4H13.05V6.3ZM6.975 8.325H8.325V12.375H6.975V8.325ZM9.675 8.325H11.025V12.375H9.675V8.325ZM6.975 3.6V4.95H11.025V3.6H6.975Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <button
              className="text-[var(--icon-sub-600,#6B7280)] text-sm mt-1 flex items-center gap-1"
              onClick={() =>
                setNodeData(selectedNode.id, {
                  ...selectedNode.data,
                  transitions: [
                    ...(selectedNode.data.transitions || []),
                    { type: "prompt", label: "" }, // Default to prompt, can be changed later
                  ],
                })
              }
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.25 9.25V4.75H10.75V9.25H15.25V10.75H10.75V15.25H9.25V10.75H4.75V9.25H9.25Z" fill="var(--icon-sub-600,#6B7280)" />
              </svg>
              Add Transition
            </button>
          </div>
        );
      case "function":
        return (
          <div>
            <label className="font-semibold text-[var(--text-strong-950,#0E121B)] mb-1 block">Function Name</label>
            <input
              className="w-full border rounded-lg p-2 bg-[var(--bg-white-0,#fff)] text-sm"
              value={selectedNode.data.functionName || ""}
              onChange={(e) =>
                setNodeData(selectedNode.id, { ...selectedNode.data, functionName: e.target.value })
              }
            />
          </div>
        );
      case "logic":
        return (
          <div>
            <div className="font-semibold text-[var(--text-strong-950,#0E121B)] mb-1">Conditions</div>
            {selectedNode.data.conditions?.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2 my-1">
                <input
                  className="flex-1 border rounded px-2 py-1 text-sm bg-[var(--bg-white-0,#fff)]"
                  value={c}
                  placeholder="Condition"
                  onChange={(e) => {
                    const arr = [...(selectedNode.data.conditions || [])];
                    arr[idx] = e.target.value;
                    setNodeData(selectedNode.id, { ...selectedNode.data, conditions: arr });
                  }}
                />
                <button
                  className="text-red-500 px-2"
                  onClick={() => {
                    const arr = (selectedNode.data.conditions || []).filter((_, i) => i !== idx);
                    setNodeData(selectedNode.id, { ...selectedNode.data, conditions: arr });
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              className="text-[var(--icon-sub-600,#6B7280)] text-sm mt-1"
              onClick={() =>
                setNodeData(selectedNode.id, {
                  ...selectedNode.data,
                  conditions: [...(selectedNode.data.conditions || []), ""],
                })
              }
            >
              + Add Condition
            </button>
            <div className="mt-4 font-semibold text-[var(--text-strong-950,#0E121B)]">Else Target Node ID</div>
            <input
              className="w-full border rounded px-2 py-1 bg-[var(--bg-white-0,#fff)] mt-1 text-sm"
              value={selectedNode.data.elseTarget || ""}
              onChange={(e) =>
                setNodeData(selectedNode.id, { ...selectedNode.data, elseTarget: e.target.value })
              }
            />
          </div>
        );
      case "ending":
        return (
          <div>
            <label className="font-semibold text-[var(--text-strong-950,#0E121B)] mb-1 block">Label</label>
            <input
              className="w-full border rounded-lg p-2 bg-[var(--bg-white-0,#fff)] text-sm"
              value={selectedNode.data.label || ""}
              onChange={(e) =>
                setNodeData(selectedNode.id, { ...selectedNode.data, label: e.target.value })
              }
            />
          </div>
        );
      default:
        return null;
    }
  }

  if (!selectedNode) {
    return (
      <div className="p-6 flex-1 flex flex-col overflow-y-auto">
        <div className="mb-5">
          <label className="font-bold text-[var(--text-strong-950,#0E121B)] text-lg block mb-2">Agent Name</label>
          <input
            className="w-full border rounded-lg p-2 font-semibold text-lg bg-[var(--bg-white-0,#fff)]"
            value={agentName}
            onChange={handleAgentNameChange}
            placeholder="Name this agent"
          />
        </div>
        <div className="mb-5">
          <label className="font-semibold text-[var(--text-strong-950,#0E121B)] block mb-1">Voice & Language</label>
          <select
            className="w-full border rounded p-2 mb-2 bg-[var(--bg-white-0,#fff)] text-sm"
            value={metadata.voice}
            onChange={(e) => setMetadata({ ...metadata, voice: e.target.value })}
          >
            {voices.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <select
            className="w-full border rounded p-2 bg-[var(--bg-white-0,#fff)] text-sm"
            value={metadata.language}
            onChange={(e) => setMetadata({ ...metadata, language: e.target.value })}
          >
            {languages.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="mb-5">
          <label className="font-semibold text-[var(--text-strong-950,#0E121B)] block mb-1">Global Prompt</label>
          <textarea
            className="w-full border rounded-lg p-2 min-h-[90px] bg-[var(--bg-white-0,#fff)] text-sm"
            value={metadata.globalPrompt}
            onChange={(e) => setMetadata({ ...metadata, globalPrompt: e.target.value })}
          />
        </div>
        <button
          className="mt-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow hover:from-blue-600 hover:to-indigo-700 transition"
          onClick={handleSave}
        >
          Save Flow
        </button>
        <button
          className="mt-4 text-[var(--text-soft-400,#6B7280)] text-xs underline"
          onClick={resetStore}
        >
          Clear & Reset
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 flex-1 flex flex-col overflow-y-auto">
      <div className="mb-5">
        <div className="font-bold text-lg text-[var(--text-strong-950,#0E121B)]">Node Properties</div>
      </div>
      {renderNodeForm()}
      <button
        className="mt-8 bg-[var(--bg-weak-50,#F3F4F6)] text-red-700 px-5 py-2 rounded-lg font-bold shadow hover:bg-red-200"
        onClick={() => {
          deleteNode(selectedNodeId);
          resetSelection();
        }}
      >
        Delete Node
      </button>
    </div>
  );
}