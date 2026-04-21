import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type XYPosition,
} from "@xyflow/react";
import { generateId } from "@v-ems/element";
import { unitCatalog, type UnitData, type UnitSpecValue, type UnitType } from "./unit-catalog";

export type UnitNode = Node<UnitData>;
export type PowerEdge = Edge;

type SimulationState = {
  nodes: UnitNode[];
  edges: PowerEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  onNodesChange: (changes: NodeChange<UnitNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<PowerEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  addUnit: (type: UnitType, position: XYPosition) => void;
  updateNodeData: (id: string, patch: Partial<UnitData>) => void;
  updateSpec: (id: string, key: string, value: UnitSpecValue) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  duplicateNode: (id: string) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  clear: () => void;
};

const seedNodes = (): UnitNode[] => [
  {
    id: "n-solar",
    type: "unit",
    position: { x: 60, y: 80 },
    data: {
      type: "solar",
      label: "Roof array",
      spec: { ...unitCatalog.solar.defaultSpec },
    },
  },
  {
    id: "n-inverter",
    type: "unit",
    position: { x: 340, y: 160 },
    data: {
      type: "inverter",
      label: "Inverter",
      spec: { ...unitCatalog.inverter.defaultSpec },
    },
  },
  {
    id: "n-battery",
    type: "unit",
    position: { x: 340, y: 320 },
    data: {
      type: "battery",
      label: "Home battery",
      spec: { ...unitCatalog.battery.defaultSpec },
    },
  },
  {
    id: "n-load",
    type: "unit",
    position: { x: 620, y: 240 },
    data: {
      type: "load",
      label: "House load",
      spec: { ...unitCatalog.load.defaultSpec },
    },
  },
  {
    id: "n-grid",
    type: "unit",
    position: { x: 60, y: 320 },
    data: {
      type: "grid",
      label: "Utility grid",
      spec: { ...unitCatalog.grid.defaultSpec },
    },
  },
];

const seedEdges = (): PowerEdge[] => [
  { id: "e-solar-inv", source: "n-solar", target: "n-inverter", type: "power" },
  { id: "e-inv-bat", source: "n-inverter", target: "n-battery", type: "power" },
  { id: "e-inv-load", source: "n-inverter", target: "n-load", type: "power" },
  { id: "e-grid-inv", source: "n-grid", target: "n-inverter", type: "power" },
];

export const useSimulationStore = create<SimulationState>((set, get) => ({
  nodes: seedNodes(),
  edges: seedEdges(),
  selectedNodeId: null,
  selectedEdgeId: null,

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({
      edges: addEdge({ ...connection, type: "power", id: `e-${generateId()}` }, get().edges),
    }),

  addUnit: (type, position) => {
    const def = unitCatalog[type];
    const id = `n-${generateId()}`;
    const newNode: UnitNode = {
      id,
      type: "unit",
      position,
      data: {
        type,
        label: def.displayName,
        spec: { ...def.defaultSpec },
      },
    };
    set({ nodes: [...get().nodes, newNode], selectedNodeId: id });
  },

  updateNodeData: (id, patch) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...patch } } : n,
      ),
    }),

  updateSpec: (id, key, value) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, spec: { ...n.data.spec, [key]: value } } }
          : n,
      ),
    }),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  duplicateNode: (id) => {
    const node = get().nodes.find((n) => n.id === id);
    if (!node) return;
    const copyId = `n-${generateId()}`;
    set({
      nodes: [
        ...get().nodes,
        {
          ...node,
          id: copyId,
          position: { x: node.position.x + 40, y: node.position.y + 40 },
          data: { ...node.data, spec: { ...node.data.spec } },
          selected: false,
        },
      ],
      selectedNodeId: copyId,
    });
  },

  deleteNode: (id) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    }),

  deleteEdge: (id) =>
    set({
      edges: get().edges.filter((e) => e.id !== id),
      selectedEdgeId: get().selectedEdgeId === id ? null : get().selectedEdgeId,
    }),

  clear: () => set({ nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null }),
}));
