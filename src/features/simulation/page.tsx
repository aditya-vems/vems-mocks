import { useEffect } from "react";
import { Separator } from "@v-ems/element";
import { SimulationCanvas } from "./canvas";
import { Palette } from "./palette";
import { Inspector } from "./inspector";
import { useSimulationStore } from "./store";

export function SimulationPage() {
  const selectedNodeId = useSimulationStore((s) => s.selectedNodeId);
  const selectedEdgeId = useSimulationStore((s) => s.selectedEdgeId);
  const deleteNode = useSimulationStore((s) => s.deleteNode);
  const deleteEdge = useSimulationStore((s) => s.deleteEdge);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (selectedNodeId) {
        e.preventDefault();
        deleteNode(selectedNodeId);
      } else if (selectedEdgeId) {
        e.preventDefault();
        deleteEdge(selectedEdgeId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedNodeId, selectedEdgeId, deleteNode, deleteEdge]);

  return (
    <div className="flex h-full w-full">
      <aside className="w-56 shrink-0 border-r bg-sidebar">
        <Palette />
      </aside>
      <Separator orientation="vertical" />
      <section className="min-w-0 flex-1">
        <SimulationCanvas />
      </section>
      <Separator orientation="vertical" />
      <aside className="w-72 shrink-0 border-l bg-sidebar">
        <Inspector />
      </aside>
    </div>
  );
}
