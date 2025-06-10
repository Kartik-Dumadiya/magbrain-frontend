import React, { useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { MessageSquare, MoreHorizontal, Edit2, Plus, ChevronRight, X, Sigma, Sparkles, Pencil } from "lucide-react";
import { useFlowDesignerStore } from "../../../store/flowDesignerStore";

function renderEquationLabel(mode, conditions) {
  if (!conditions?.length) return "Set a condition";
  return conditions
    .map(cond => `${cond.var || "?"} ${cond.op || "="} "${cond.value || "?"}"`)
    .join(mode === "all" ? " AND " : " OR ");
}

const ConversationNode = ({ id, data, selected }) => {
  const { setSelectedNodeId, setNodeData } = useFlowDesignerStore();
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [configuringIdx, setConfiguringIdx] = useState(null);
  const [focusPromptIdx, setFocusPromptIdx] = useState(null);
  const promptRefs = useRef([]);
  const [editingName, setEditingName] = useState(false);
  const nameInputRef = useRef(null);

  // Focus on prompt input when requested
  useEffect(() => {
    if (focusPromptIdx !== null && promptRefs.current[focusPromptIdx]) {
      promptRefs.current[focusPromptIdx].focus();
      setFocusPromptIdx(null);
    }
  }, [focusPromptIdx]);

  // Add transition
  const handleAddTransition = (type) => {
    let newTrans;
    if (type === "prompt") {
      newTrans = { type: "prompt", label: "", icon: "prompt" };
    } else {
      newTrans = { type: "equation", icon: "equation", mode: "any", conditions: [] };
    }
    setNodeData(id, {
      ...data,
      transitions: [...(data.transitions || []), newTrans],
    });
    setAddMenuOpen(false);
    if (type === "equation") {
      setTimeout(() => setConfiguringIdx((data.transitions?.length || 0)), 0);
    }
    if (type === "prompt") {
      setTimeout(() => setFocusPromptIdx((data.transitions?.length || 0)), 0);
    }
  };

  // Click outside handler for add menu
  useEffect(() => {
    function onClick(e) {
      if (!e.target.closest(".transition-add-menu")) setAddMenuOpen(false);
    }
    if (addMenuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [addMenuOpen]);

  // Render popup for equation config
  const renderConditionPopup = (idx) => {
    const t = data.transitions?.[idx];
    if (!t) return null;
    return (
      <div className="absolute left-full top-0 ml-2 z-50 bg-white border border-gray-200 rounded-xl shadow-xl min-w-[330px] p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <Sigma size={18} /> Configure conditions
          </span>
          <button className="text-gray-400 hover:text-gray-800" onClick={() => setConfiguringIdx(null)}>
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2 mb-3 text-xs">
          <select
            value={t.mode || "any"}
            className="border rounded px-1 py-0.5 font-semibold text-xs"
            onChange={e => {
              const arr = [...data.transitions];
              arr[idx].mode = e.target.value;
              setNodeData(id, { ...data, transitions: arr });
            }}
          >
            <option value="any">Any</option>
            <option value="all">All</option>
          </select>
          <span className="text-gray-400">of the following conditions match</span>
        </div>
        {(t.conditions || []).map((cond, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              className="border rounded px-2 py-1 flex-1 text-xs"
              placeholder="Variable"
              value={cond.var || ""}
              onChange={e => {
                const arr = [...data.transitions];
                arr[idx].conditions[i].var = e.target.value;
                setNodeData(id, { ...data, transitions: arr });
              }}
            />
            <select
              className="border rounded px-1 py-1 text-xs"
              value={cond.op || "=="}
              onChange={e => {
                const arr = [...data.transitions];
                arr[idx].conditions[i].op = e.target.value;
                setNodeData(id, { ...data, transitions: arr });
              }}
            >
              <option value="==">=</option>
              <option value="!=">≠</option>
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
            </select>
            <input
              className="border rounded px-2 py-1 flex-1 text-xs"
              placeholder="Value"
              value={cond.value || ""}
              onChange={e => {
                const arr = [...data.transitions];
                arr[idx].conditions[i].value = e.target.value;
                setNodeData(id, { ...data, transitions: arr });
              }}
            />
            <button
              className="text-gray-400 hover:text-red-500"
              onClick={() => {
                const arr = [...data.transitions];
                arr[idx].conditions.splice(i, 1);
                setNodeData(id, { ...data, transitions: arr });
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          className="text-blue-600 text-xs font-semibold hover:underline mt-2"
          onClick={() => {
            const arr = [...data.transitions];
            if (!arr[idx].conditions) arr[idx].conditions = [];
            arr[idx].conditions.push({ var: "", op: "==", value: "" });
            setNodeData(id, { ...data, transitions: arr });
          }}
        >+ Add Condition</button>
      </div>
    );
  };

  // Get the icon for transition type
  const getTransitionTypeIcon = (type) => {
    if (type === "prompt") {
      return <Sparkles size={16} className="text-blue-500" title="Prompt" />;
    }
    if (type === "equation") {
      return <Sigma size={16} className="text-blue-700" title="Equation" />;
    }
    return null;
  };

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`
        bg-white rounded-2xl shadow-xl border border-gray-200 w-[320px] transition
        ${selected ? "ring-2 ring-blue-500 z-50" : "z-0"}
        cursor-pointer relative
      `}
    >
      {/* Input Handle (Larger, Border Only, No Fill) */}
      <Handle
        type="target"
        position={Position.Left}
        id={`target-handle-${id}`}
        className="w-6 h-6 bg-transparent border-2 border-blue-400 rounded-full absolute"
        style={{
          background: "transparent",
          borderWidth: 2,
          borderColor: "#60A5FA",
          width: 12,
          height: 12,
          left: -6,
          top: "50%",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 ">
        <div className="flex items-center gap-2 ">
          {/* <MessageSquare size={20} className="text-blue-500" /> */}
          <p className="text-gray-600 text-lg flex items-center">#</p>
          {!editingName ? (
            <span
              className="flex font-semibold text-gray-900 cursor-pointer items-center"
              onClick={e => {
                e.stopPropagation();
                setEditingName(true);
              }}
              title={data.nodeName || "Conversation"}
            >
              {data.nodeName || "Conversation"}
            </span>
          ) : (
            <input
              ref={nameInputRef}
              className="text-base font-semibold text-gray-900 bg-gray-100 rounded px-1 py-0.5 flex-1 outline-none border border-gray-200"
              value={data.nodeName || ""}
              onClick={e => e.stopPropagation()}
              onChange={e => setNodeData(id, { ...data, nodeName: e.target.value })}
              onBlur={() => setEditingName(false)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === "Escape" || e.key == "any") setEditingName(false);
              }}
              maxLength={40}
              spellCheck={false}
            />
          )}
          <button
            className="ml-1 hover:text-gray-900 text-gray-600"
            onClick={e => {
              e.stopPropagation();
              setEditingName(true);
            }}
            tabIndex={-1}
            title="Edit name"
            type="button"
          >
            <Pencil size={13} />
          </button>
        </div>
        <MoreHorizontal size={20} className="text-gray-400" />
      </div>

      {/* Message textarea */}
      <div className="px-5 pb-3">
        <textarea
          className="w-full min-h-[64px] text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 p-2 resize-none"
          placeholder="[Bot message here]"
          value={data.message || ""}
          onChange={e => data.onChange?.(id, { ...data, message: e.target.value })}
        />
      </div>

      {/* Transitions */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-2 relative">
          <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
            <ChevronRight size={16} /> Transitions
          </span>
          <div className="relative transition-add-menu">
            <button
              onClick={e => { e.stopPropagation(); setAddMenuOpen(v => !v); }}
              className="p-1 rounded-full text-blue-500 hover:bg-blue-100 transition"
              title="Add Transition"
              type="button"
            >
              <Plus size={18} />
            </button>
            {addMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                <button
                  className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-50 text-gray-800"
                  onClick={e => { e.stopPropagation(); handleAddTransition("prompt"); }}
                >
                  <Sparkles size={16} className="text-blue-600" />
                  Prompt
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-50 text-gray-800"
                  onClick={e => { e.stopPropagation(); handleAddTransition("equation"); }}
                >
                  <Sigma size={16} className="text-blue-600" />
                  Equation
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 relative">
          {data.transitions?.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 relative group"
            >

              {/* Output handle */}
              <Handle
                type="source"
                position={Position.Right}
                id={`edge-${i}`}
                className="w-6 h-6 bg-transparent border-2 border-blue-400 rounded-full absolute top-7"
                style={{
                  background: "transparent",
                  borderWidth: 2,
                  borderColor: "#60A5FA", // tailwind blue-400
                  width: 9,
                  height: 9,
                }}
              />
              
              {/* Transition type icon */}
              {getTransitionTypeIcon(t.type)}
              {/* Prompt type transition */}
              {t.type === "prompt" ? (
                <input
                  ref={el => promptRefs.current[i] = el}
                  className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs bg-white"
                  placeholder="Describe the transition condition"
                  value={t.label ?? ""}
                  onChange={e => {
                    const arr = [...data.transitions];
                    arr[i].label = e.target.value;
                    setNodeData(id, { ...data, transitions: arr });
                  }}
                />
              ) : (
                // Equation type transition
                <button
                  className="flex-1 text-xs text-blue-700 text-left underline hover:no-underline"
                  onClick={e => { e.stopPropagation(); setConfiguringIdx(i); }}
                >
                  {renderEquationLabel(t.mode, t.conditions)}
                </button>
              )}
              {/* Edit/Delete buttons */}
              <button
                className="text-gray-400 hover:text-blue-500"
                onClick={e => {
                  e.stopPropagation();
                  if (t.type === "prompt") setFocusPromptIdx(i);
                  else if (t.type === "equation") setConfiguringIdx(i);
                }}
                title="Edit"
                type="button"
              >
                <Edit2 size={16} />
              </button>
              <button
                className="text-gray-400 hover:text-red-500"
                onClick={() => data.onDeleteTransition?.(id, i)}
                title="Delete"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M12.375 4.95H15.75V6.3H14.4V15.075C14.4 15.254 14.3289 15.4257 14.2023 15.5523C14.0757 15.6789 13.904 15.75 13.725 15.75H4.275C4.09598 15.75 3.92429 15.6789 3.7977 15.5523C3.67112 15.4257 3.6 15.254 3.6 15.075V6.3H2.25V4.95H5.625V2.925C5.625 2.74598 5.69612 2.57429 5.8227 2.4477C5.94929 2.32112 6.12098 2.25 6.3 2.25H11.7C11.879 2.25 12.0507 2.32112 12.1773 2.4477C12.3039 2.57429 12.375 2.74598 12.375 2.925V4.95ZM13.05 6.3H4.95V14.4H13.05V6.3ZM6.975 8.325H8.325V12.375H6.975V8.325ZM9.675 8.325H11.025V12.375H9.675V8.325ZM6.975 3.6V4.95H11.025V3.6H6.975Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              {/* Condition popup for equation type */}
              {configuringIdx === i && t.type === "equation" && renderConditionPopup(i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationNode;