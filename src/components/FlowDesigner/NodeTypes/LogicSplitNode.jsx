import React from "react";
import { Handle, Position } from "reactflow";
import { GitBranch } from "lucide-react";
import { useFlowDesignerStore } from "../../../store/flowDesignerStore";

const selectedStyle = {
  border: "2px solid #2563eb",
  boxShadow: "0 0 0 2px #dbeafe",
};

export default function LogicSplitNode({ id, data, selected }) {
  const { setSelectedNodeId } = useFlowDesignerStore();

  return (
    <div
      className={`rounded-lg shadow bg-blue-100 border-l-4 border-blue-500 p-3 min-w-[210px]`}
      style={selected ? selectedStyle : undefined}
      onClick={() => setSelectedNodeId(id)}
    >
      <div className="font-bold text-blue-700 mb-1 flex items-center gap-2">
        <GitBranch className="text-blue-500" size={16} /> # Logic Split Node
      </div>
      <div className="flex flex-col gap-1 text-blue-700 text-xs">
        {data.conditions?.map((c, i) => (
          <div key={i}>
            If {c || <span className="opacity-60">[condition]</span>}
          </div>
        ))}
        <div className="text-blue-400 mt-2 text-xs">Else: {data.elseTarget || <span className="opacity-60">[Target Node]</span>}</div>
      </div>
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  );
}