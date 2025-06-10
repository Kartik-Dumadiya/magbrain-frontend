import React from "react";
import { Handle, Position } from "reactflow";
import { Flag } from "lucide-react";
import { useFlowDesignerStore } from "../../../store/flowDesignerStore";

const selectedStyle = {
  border: "2px solid #f43f5e",
  boxShadow: "0 0 0 2px #fda4af",
};

export default function EndingNode({ id, data, selected }) {
  const { setSelectedNodeId } = useFlowDesignerStore();

  return (
    <div
      className={`rounded-lg shadow bg-rose-100 border-l-4 border-rose-400 p-3 min-w-[150px]`}
      style={selected ? selectedStyle : undefined}
      onClick={() => setSelectedNodeId(id)}
    >
      <div className="font-bold text-red-700 mb-1 flex items-center gap-2">
        <Flag className="text-red-500" size={16} /> # Ending
      </div>
      <div className="text-xs text-gray-600">
        {data.label || <span className="text-gray-400">End Call</span>}
      </div>
      {/* Only one target handle (for incoming connection) */}
      <Handle type="target" position={Position.Top} className="!bg-rose-400" />
    </div>
  );
}