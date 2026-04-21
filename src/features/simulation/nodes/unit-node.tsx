import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent, Badge } from "@v-ems/element";
import { unitCatalog } from "../unit-catalog";
import type { UnitNode as UnitNodeType } from "../store";

function UnitNodeImpl({ data, selected }: NodeProps<UnitNodeType>) {
  const def = unitCatalog[data.type];
  return (
    <Card
      className={[
        "w-44 border transition-shadow",
        selected ? "ring-2 ring-ring" : "shadow-sm",
      ].join(" ")}
    >
      <Handle type="target" position={Position.Left} className="!size-2.5 !bg-primary" />
      <CardContent className="flex items-center gap-2 p-3">
        <div
          className={[
            "flex size-8 items-center justify-center rounded-md bg-muted",
            def.accent,
          ].join(" ")}
        >
          <HugeiconsIcon icon={def.icon} size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{data.label}</div>
          <Badge variant="secondary" className="mt-0.5 text-[10px]">
            {def.displayName}
          </Badge>
        </div>
      </CardContent>
      <Handle type="source" position={Position.Right} className="!size-2.5 !bg-primary" />
    </Card>
  );
}

export const UnitNode = memo(UnitNodeImpl);
