import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "@v-ems/element";
import { unitCatalog, unitTypes, type UnitType } from "./unit-catalog";

export const PALETTE_MIME = "application/vems-unit-type";

export function Palette() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Units
      </div>
      {unitTypes.map((type) => (
        <PaletteItem key={type} type={type} />
      ))}
    </div>
  );
}

function PaletteItem({ type }: { type: UnitType }) {
  const def = unitCatalog[type];
  return (
    <Card
      draggable
      onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData(PALETTE_MIME, type);
        e.dataTransfer.effectAllowed = "copy";
      }}
      className="flex cursor-grab select-none items-center gap-2 p-2 text-sm transition-colors hover:bg-accent active:cursor-grabbing"
    >
      <div
        className={[
          "flex size-7 items-center justify-center rounded-md bg-muted",
          def.accent,
        ].join(" ")}
      >
        <HugeiconsIcon icon={def.icon} size={16} />
      </div>
      <span className="font-medium">{def.displayName}</span>
    </Card>
  );
}
