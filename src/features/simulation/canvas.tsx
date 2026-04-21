import { useCallback, useRef } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  type NodeTypes,
  type EdgeTypes,
  type ReactFlowInstance,
} from "@xyflow/react";
import type { UnitNode as UnitNodeType, PowerEdge as PowerEdgeType } from "./store";
import "@xyflow/react/dist/style.css";
import { UnitNode } from "./nodes/unit-node";
import { PowerEdge } from "./edges/power-edge";
import { useSimulationStore } from "./store";
import { PALETTE_MIME } from "./palette";
import type { UnitType } from "./unit-catalog";

const nodeTypes: NodeTypes = { unit: UnitNode };
const edgeTypes: EdgeTypes = { power: PowerEdge };

function CanvasInner() {
  const nodes = useSimulationStore((s) => s.nodes);
  const edges = useSimulationStore((s) => s.edges);
  const onNodesChange = useSimulationStore((s) => s.onNodesChange);
  const onEdgesChange = useSimulationStore((s) => s.onEdgesChange);
  const onConnect = useSimulationStore((s) => s.onConnect);
  const addUnit = useSimulationStore((s) => s.addUnit);
  const selectNode = useSimulationStore((s) => s.selectNode);
  const selectEdge = useSimulationStore((s) => s.selectEdge);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ReactFlowInstance<UnitNodeType, PowerEdgeType> | null>(null);

  const onInit = useCallback(
    (instance: ReactFlowInstance<UnitNodeType, PowerEdgeType>) => {
      instanceRef.current = instance;
    },
    [],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData(PALETTE_MIME) as UnitType | "";
      if (!type) return;
      const instance = instanceRef.current;
      if (!instance) return;
      const position = instance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addUnit(type, position);
    },
    [addUnit],
  );

  return (
    <div ref={wrapperRef} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={(_, node) => selectNode(node.id)}
        onEdgeClick={(_, edge) => selectEdge(edge.id)}
        onPaneClick={() => {
          selectNode(null);
          selectEdge(null);
        }}
        fitView
        defaultEdgeOptions={{ type: "power" }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
}

export function SimulationCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
