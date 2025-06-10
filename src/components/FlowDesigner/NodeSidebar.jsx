import React from "react";
import { useFlowDesignerStore } from "../../store/flowDesignerStore";
import { Plus } from "lucide-react";

const nodeTypes = [
  { type: "conversation", label: "Conversation", color: "bg-[var(--bg-white-0,#fff)]", textColor: "text-[var(--state-highlighted-dark,#0E121B)]" },
  { type: "function", label: "Function", color: "bg-[var(--bg-white-0,#fff)]", textColor: "text-[var(--text-soft-400,#6B7280)]" },
  { type: "logic", label: "Logic Split Node", color: "bg-[var(--bg-white-0,#fff)]", textColor: "text-[var(--ring,#2563EB)]" },
  { type: "ending", label: "Ending", color: "bg-[var(--bg-white-0,#fff)]", textColor: "text-[var(--text-error-600,#DC2626)]" },
];

export default function NodeSidebar() {
  const { addNode } = useFlowDesignerStore();

  const handleAddNode = (type) => {
    addNode(type);
  };

  return (
    <div className="p-6 h-full flex flex-col bg-[var(--bg-weak-50,#F3F4F6)]">
      <div className="font-bold text-lg text-[var(--text-strong-950,#0E121B)] mb-7 tracking-wide">
        Add New Node
      </div>
      <div className="flex flex-col gap-4">
        {nodeTypes.map((nt) => (
          <button
            key={nt.type}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm shadow border border-[var(--stroke-strong-950,#0E121B)] hover:border-[var(--ring,#2563EB)] hover:shadow-lg hover:scale-[1.02] transition-all ${nt.color} ${nt.textColor}`}
            onClick={() => handleAddNode(nt.type)}
            type="button"
          >
            <span className="w-6 h-6 flex items-center justify-center">
              <Plus className="text-[var(--icon-sub-600,#6B7280)]" size={20} />
            </span>
            <span>{nt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}