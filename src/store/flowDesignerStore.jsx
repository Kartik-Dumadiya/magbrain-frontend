import { create } from "zustand";
import { nanoid } from "nanoid";

const initialMetadata = { voice: "English", language: "English", globalPrompt: "" };
const initialNodes = [
  {
    id: "begin",
    type: "begin",
    position: { x: 100, y: 60 },
    data: {},
  },
];

export const useFlowDesignerStore = create((set, get) => ({
  nodes: initialNodes,
  edges: [],
  selectedNodeId: null,
  metadata: { ...initialMetadata },
  flowName: "Conversational Flow Agent",
  flowId: null,

  setNodes: (updater) =>
    set((state) => {
      const newNodes = typeof updater === "function" ? updater(state.nodes) : updater;
      return { nodes: newNodes };
    }),

  setEdges: (updater) =>
    set((state) => {
      const newEdges = typeof updater === "function" ? updater(state.edges) : updater;
      return { edges: newEdges };
    }),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id !== id) return n;
        let newData = data;
        if (n.type === "conversation") {
          newData = {
            ...data,
            onChange: data.onChange || n.data?.onChange || ((id, newData) => get().setNodeData(id, newData)),
            onAddTransition: data.onAddTransition || n.data?.onAddTransition || ((id) => {
              const n2 = get().nodes.find((node) => node.id === id);
              if (n2)
                get().setNodeData(id, {
                  ...n2.data,
                  transitions: [...(n2.data.transitions || []), { label: "", icon: "arrow" }],
                });
            }),
            onEditTransition: data.onEditTransition || n.data?.onEditTransition || (() => { }),
            onDeleteTransition: data.onDeleteTransition || n.data?.onDeleteTransition || ((id, idx) => {
              const n2 = get().nodes.find((node) => node.id === id);
              if (n2)
                get().setNodeData(id, {
                  ...n2.data,
                  transitions: (n2.data.transitions || []).filter((_, i) => i !== idx),
                });
            }),
          };
        }
        return { ...n, data: newData };
      }),
    })),

  setMetadata: (metadata) => set({ metadata }),
  setFlowName: (name) => set({ flowName: name }),
  resetSelection: () => set({ selectedNodeId: null }),
  resetStore: () =>
    set((state) => ({
      nodes: initialNodes,
      edges: [],
      selectedNodeId: null,
      metadata: { ...initialMetadata },
      // Keep the current flowId!
      flowName: "Untitled Agent",
    })),

  addNode: (type) => {
    const id = nanoid(8);
    let node = {
      id,
      type,
      position: { x: 250 + Math.random() * 80, y: 100 + Math.random() * 200 },
      data: {},
    };
    if (type === "conversation") {
      node.data = {
        message: "",
        transitions: [{ type: "prompt", label: "", icon: "arrow" }],
        onChange: (id, newData) => {
          get().setNodeData(id, newData);
        },
        onAddTransition: (id) => {
          const n = get().nodes.find((n) => n.id === id);
          if (n)
            get().setNodeData(id, {
              ...n.data,
              transitions: [...(n.data.transitions || []), { label: "", icon: "arrow" }],
            });
        },
        onEditTransition: (id, idx) => { },
        onDeleteTransition: (id, idx) => {
          const n = get().nodes.find((n) => n.id === id);
          if (n)
            get().setNodeData(id, {
              ...n.data,
              transitions: (n.data.transitions || []).filter((_, i) => i !== idx),
            });
        },
      };
    }
    if (type === "function") node.data = { functionName: "" };
    if (type === "logic") node.data = { conditions: [], elseTarget: "" };
    if (type === "ending") node.data = { label: "End Call" };
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  addEdge: (edge) =>
    set((state) => {
      if (state.edges.some((e) => e.source === edge.source && e.target === edge.target && e.sourceHandle === edge.sourceHandle && e.targetHandle === edge.targetHandle)) {
        return state;
      }
      return { edges: [...state.edges, edge] };
    }),

  setAll: ({ nodes, edges, metadata, flowName, flowId }) =>
    set({
      nodes:
        nodes && Array.isArray(nodes) && nodes.length > 0
          ? nodes.map((n) => {
            let data = n.data || {};
            if (n.type === "conversation") {
              data = {
                ...data,
                onChange: (id, newData) => {
                  get().setNodeData(id, newData);
                },
                onAddTransition: (id) => {
                  const node = get().nodes.find((node) => node.id === id);
                  if (node)
                    get().setNodeData(id, {
                      ...node.data,
                      transitions: [
                        ...(node.data.transitions || []),
                        { label: "", icon: "arrow" },
                      ],
                    });
                },
                onEditTransition: (id, idx) => { },
                onDeleteTransition: (id, idx) => {
                  const node = get().nodes.find((node) => node.id === id);
                  if (node)
                    get().setNodeData(id, {
                      ...node.data,
                      transitions: (node.data.transitions || []).filter(
                        (_, i) => i !== idx
                      ),
                    });
                },
              };
            }
            return {
              ...n,
              id: n.id,
              position:
                n.position &&
                  typeof n.position.x === "number" &&
                  typeof n.position.y === "number"
                  ? { ...n.position }
                  : { x: 100, y: 100 },
              data,
            };
          })
          : initialNodes,
      edges: edges && Array.isArray(edges) ? edges : [],
      metadata: metadata && Object.keys(metadata).length > 0 ? metadata : { ...initialMetadata },
      flowName: flowName || "Untitled Agent",
      flowId: flowId || null,
    }),
}));