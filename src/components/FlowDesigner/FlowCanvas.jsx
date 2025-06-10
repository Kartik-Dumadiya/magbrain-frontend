import React, { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from "reactflow";
import ConversationNode from "./NodeTypes/ConversationNode";
import FunctionNode from "./NodeTypes/FunctionNode";
import LogicSplitNode from "./NodeTypes/LogicSplitNode";
import EndingNode from "./NodeTypes/EndingNode";
import BeginNode from "./NodeTypes/BeginNode";
import { useFlowDesignerStore } from "../../store/flowDesignerStore";
import "reactflow/dist/style.css";

const nodeTypes = {
  conversation: ConversationNode,
  function: FunctionNode,
  logic: LogicSplitNode,
  ending: EndingNode,
  begin: BeginNode,
};

function FlowCanvasInner() {
  const { nodes, edges, setNodes, setEdges, setSelectedNodeId, addEdge } = useFlowDesignerStore();
  const { fitView } = useReactFlow();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (!hasFitted.current && nodes && nodes.length > 1) {
      fitView({ padding: 0.2, duration: 800 });
      hasFitted.current = true;
    }
  }, [nodes, fitView]);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      const { source, sourceHandle, target, targetHandle } = params;
      const edge = {
        id: `e-${source}-${sourceHandle || "default"}-${target}-${targetHandle || "default"}`,
        source,
        sourceHandle: sourceHandle || null,
        target,
        targetHandle: targetHandle || null,
        animated: true,
        style: { stroke: "#0E121B", strokeWidth: 1.5 },
      };
      addEdge(edge);
    },
    [addEdge]
  );

  const onNodeClick = useCallback(
    (_, node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);


  return (
    <div className="flex-1 h-full bg-gray-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#0E121B", strokeWidth: 1.5 },
        }}
      >

        <Controls
          // Tailwind: bg-white, border, border-gray-900, rounded
          className="bg-white, border, border-gray-900, rounded"
        />
        <Background variant="dots" gap={16} size={1} color="#6B7280" />
      </ReactFlow>
    </div>
  );
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}