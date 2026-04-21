import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  ChartLineData01Icon,
  ChartBarLineIcon,
  ChartAreaIcon,
} from "@hugeicons/core-free-icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v-ems/element";
import { graphs, graphIds } from "@/shared/mock-data/graphs";
import type { GraphAttrs, GraphKind } from "./graph-node";

export function GraphNodeView({ node, updateAttributes, deleteNode, selected, editor }: NodeViewProps) {
  const attrs = node.attrs as GraphAttrs;
  const dataset = graphs[attrs.graphId] ?? graphs[graphIds[0]];
  const editable = editor.isEditable;

  return (
    <NodeViewWrapper className="my-4 block">
      <Card
        className={[
          "group relative overflow-hidden border transition-all",
          selected ? "ring-2 ring-ring" : "",
        ].join(" ")}
      >
        <CardContent className="p-4">
          <div className="mb-3 flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{attrs.title}</div>
              {dataset.subtitle ? (
                <div className="truncate text-xs text-muted-foreground">{dataset.subtitle}</div>
              ) : null}
            </div>
            <Badge variant="secondary" className="capitalize">
              {attrs.kind}
            </Badge>
            {editable ? (
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Select
                  value={attrs.graphId}
                  onValueChange={(v: string) => updateAttributes({ graphId: v })}
                >
                  <SelectTrigger className="h-8 w-44 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {graphIds.map((id) => (
                      <SelectItem key={id} value={id}>
                        {graphs[id].title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Chart options">
                      <HugeiconsIcon icon={kindIcon(attrs.kind)} size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Chart type</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={attrs.kind}
                      onValueChange={(v: string) => updateAttributes({ kind: v as GraphKind })}
                    >
                      <DropdownMenuRadioItem value="line">Line</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="bar">Bar</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="area">Area</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteNode()}>
                      <HugeiconsIcon icon={Delete02Icon} size={14} />
                      <span className="ml-2">Remove graph</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : null}
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(attrs.kind, dataset)}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </NodeViewWrapper>
  );
}

function renderChart(kind: GraphKind, dataset: (typeof graphs)[string]) {
  const common = {
    data: dataset.data,
    margin: { top: 4, right: 12, left: -16, bottom: 0 },
  };
  const stroke = "var(--chart-3)";
  const fill = "var(--chart-2)";

  if (kind === "bar") {
    return (
      <BarChart {...common}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey={dataset.xKey} fontSize={11} stroke="var(--muted-foreground)" />
        <YAxis fontSize={11} stroke="var(--muted-foreground)" />
        <ChartTooltip />
        <Bar dataKey={dataset.yKey} fill={fill} radius={[4, 4, 0, 0]} />
      </BarChart>
    );
  }
  if (kind === "area") {
    return (
      <AreaChart {...common}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey={dataset.xKey} fontSize={11} stroke="var(--muted-foreground)" />
        <YAxis fontSize={11} stroke="var(--muted-foreground)" />
        <ChartTooltip />
        <Area
          type="monotone"
          dataKey={dataset.yKey}
          stroke={stroke}
          fill={fill}
          fillOpacity={0.3}
        />
      </AreaChart>
    );
  }
  return (
    <LineChart {...common}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
      <XAxis dataKey={dataset.xKey} fontSize={11} stroke="var(--muted-foreground)" />
      <YAxis fontSize={11} stroke="var(--muted-foreground)" />
      <ChartTooltip />
      <Line type="monotone" dataKey={dataset.yKey} stroke={stroke} strokeWidth={2} dot={false} />
    </LineChart>
  );
}

function kindIcon(kind: GraphKind) {
  if (kind === "bar") return ChartBarLineIcon;
  if (kind === "area") return ChartAreaIcon;
  return ChartLineData01Icon;
}
