import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

export function PowerEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, selected, markerEnd } = props;
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 10,
  });

  return (
    <BaseEdge
      path={path}
      markerEnd={markerEnd}
      style={{
        stroke: selected ? "var(--ring)" : "var(--muted-foreground)",
        strokeWidth: selected ? 2 : 1.5,
      }}
    />
  );
}
