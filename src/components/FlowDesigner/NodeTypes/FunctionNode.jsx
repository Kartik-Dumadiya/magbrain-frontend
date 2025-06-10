import React from "react";
import { Handle, Position } from "reactflow";
import { Settings2 } from "lucide-react";
import { useFlowDesignerStore } from "../../../store/flowDesignerStore";

const selectedStyle = {
  border: "2px solid #64748b",
  boxShadow: "0 0 0 2px #f1f5f9",
};

export default function FunctionNode({ id, data, selected }) {
  const { setSelectedNodeId } = useFlowDesignerStore();

  return (
    <div
      className={`rounded-lg shadow bg-gray-100 border-l-4 border-gray-400 p-3 min-w-[190px]`}
      style={selected ? selectedStyle : undefined}
      onClick={() => setSelectedNodeId(id)}
    >
      <div className="font-bold text-gray-700 mb-1 flex items-center gap-2">
        <Settings2 className="text-gray-500" size={16} /> # Function
      </div>
      <div className="text-sm text-gray-700">
        {data.functionName || <span className="text-gray-400">[Function Name]</span>}
      </div>
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}