import { useState, type ReactNode } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, DragDropVerticalIcon } from "@hugeicons/core-free-icons";
import { ChartBlock, type SeriesPoint } from "./blocks/chart-block";
import { ScenarioTable } from "./blocks/scenario-table";
import { Callout } from "./blocks/callout";
import { MetricRow } from "./blocks/metric-row";
import { ProseEditor } from "./prose-editor";

type ProseBlock = {
  id: string;
  type: "prose";
  content: string;
  placeholder?: string;
};
type ChartBlockData = {
  id: string;
  type: "chart";
  kind: "line" | "area" | "bar";
  data: SeriesPoint[];
  xKey: string;
  yKey: string;
  unit?: string;
  title?: string;
  caption?: string;
};
type ScenarioBlockData = {
  id: string;
  type: "scenario";
  title?: string;
  caption?: string;
  rows: {
    name: string;
    yield: string;
    delta: string;
    trend: "up" | "down" | "flat";
  }[];
};
type MetricBlockData = {
  id: string;
  type: "metric";
  metrics: {
    label: string;
    value: string;
    delta?: string;
    trend?: "up" | "down" | "flat";
  }[];
};
type CalloutBlockData = {
  id: string;
  type: "callout";
  kind: "info" | "success" | "warning";
  content: ReactNode;
};
type DividerBlockData = { id: string; type: "divider" };

export type Block =
  | ProseBlock
  | ChartBlockData
  | ScenarioBlockData
  | MetricBlockData
  | CalloutBlockData
  | DividerBlockData;

function BlockContent({
  block,
  editable,
  onUpdate,
}: {
  block: Block;
  editable: boolean;
  onUpdate?: () => void;
}) {
  switch (block.type) {
    case "prose":
      return (
        <ProseEditor
          content={block.content}
          editable={editable}
          placeholder={block.placeholder}
          onUpdate={onUpdate}
        />
      );
    case "chart":
      return (
        <ChartBlock
          kind={block.kind}
          data={block.data}
          xKey={block.xKey}
          yKey={block.yKey}
          unit={block.unit}
          title={block.title}
          caption={block.caption}
        />
      );
    case "scenario":
      return (
        <ScenarioTable
          rows={block.rows}
          title={block.title}
          caption={block.caption}
        />
      );
    case "metric":
      return <MetricRow metrics={block.metrics} />;
    case "callout":
      return <Callout kind={block.kind}>{block.content}</Callout>;
    case "divider":
      return <hr className="my-8 border-border/60" />;
  }
}

function SortableBlock({
  block,
  editable,
  onDelete,
  onUpdate,
}: {
  block: Block;
  editable: boolean;
  onDelete: (id: string) => void;
  onUpdate?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 30 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group/block relative"
    >
      {editable ? (
        <>
          <button
            type="button"
            aria-label="Drag to reorder"
            {...attributes}
            {...listeners}
            className="absolute -left-9 top-1.5 flex size-7 cursor-grab items-center justify-center rounded-md text-muted-foreground/70 opacity-0 transition-all hover:bg-accent hover:text-foreground active:cursor-grabbing group-hover/block:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
          >
            <HugeiconsIcon
              icon={DragDropVerticalIcon}
              strokeWidth={2}
              className="size-4"
            />
          </button>
          <button
            type="button"
            aria-label="Delete block"
            onClick={() => onDelete(block.id)}
            className="absolute -right-9 top-1.5 flex size-7 items-center justify-center rounded-md text-muted-foreground/70 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover/block:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
          >
            <HugeiconsIcon
              icon={Delete01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </button>
        </>
      ) : null}
      <div className="rounded-md transition-colors group-hover/block:bg-accent/20">
        <BlockContent block={block} editable={editable} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

type BlocksCanvasProps = {
  blocks: Block[];
  editable: boolean;
  onChange: (blocks: Block[]) => void;
  onUpdate?: () => void;
};

export function BlocksCanvas({
  blocks,
  editable,
  onChange,
  onUpdate,
}: BlocksCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleDragStart(e: { active: { id: string | number } }) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(blocks, oldIndex, newIndex));
  }

  function handleDelete(id: string) {
    onChange(blocks.filter((b) => b.id !== id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              editable={editable && activeId !== block.id}
              onDelete={handleDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
