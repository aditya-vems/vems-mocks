import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type SeriesPoint = Record<string, number | string>;

type ChartKind = "line" | "area" | "bar";

type ChartBlockProps = {
  kind: ChartKind;
  data: SeriesPoint[];
  xKey: string;
  yKey: string;
  yLabel?: string;
  caption?: string;
  title?: string;
  unit?: string;
};

function tickStyle() {
  return {
    fill: "var(--muted-foreground)",
    fontSize: 11,
  };
}

function tooltipFormatter(value: unknown, unit?: string) {
  return [`${value}${unit ? ` ${unit}` : ""}`];
}

export function ChartBlock({
  kind,
  data,
  xKey,
  yKey,
  caption,
  title,
  unit,
}: ChartBlockProps) {
  const stroke = "var(--primary)";
  const fillId = `fill-${yKey}`;

  return (
    <figure className="my-4 flex flex-col gap-3 rounded-lg border border-border/60 bg-background/40 p-5">
      {title ? (
        <figcaption className="text-sm font-medium text-foreground">
          {title}
        </figcaption>
      ) : null}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {kind === "line" ? (
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey={xKey}
                tick={tickStyle()}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={tickStyle()}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip
                cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                  padding: "6px 10px",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                formatter={(v) => tooltipFormatter(v, unit)}
              />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke={stroke}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: stroke }}
              />
            </LineChart>
          ) : kind === "area" ? (
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey={xKey}
                tick={tickStyle()}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={tickStyle()}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip
                cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                  padding: "6px 10px",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                formatter={(v) => tooltipFormatter(v, unit)}
              />
              <Area
                type="monotone"
                dataKey={yKey}
                stroke={stroke}
                strokeWidth={2}
                fill={`url(#${fillId})`}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey={xKey}
                tick={tickStyle()}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={tickStyle()}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip
                cursor={{ fill: "var(--accent)", opacity: 0.4 }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                  padding: "6px 10px",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                formatter={(v) => tooltipFormatter(v, unit)}
              />
              <Bar
                dataKey={yKey}
                fill={stroke}
                radius={[3, 3, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      {caption ? (
        <figcaption className="text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
