import React from "react";
import { Handle, Position } from "reactflow";

export default function BeginNode({ id, data, selected }) {
  return (
    <div
      className={`rounded-lg shadow bg-green-50 border border-green-300 p-3 min-w-[120px] text-center`}
      style={
        selected
          ? { border: "2px solid #10b981", boxShadow: "0 0 0 2px #6ee7b7" }
          : undefined
      }
    >
      <div className="font-bold text-green-700 mb-1">Begin</div>
      {/* Source handle at bottom to start the flow */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-green-400"
        id="begin-source"
      />
    </div>
  );
}