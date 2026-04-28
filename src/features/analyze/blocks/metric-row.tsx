type Metric = {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
};

const trendColor: Record<NonNullable<Metric["trend"]>, string> = {
  up: "text-emerald-500",
  down: "text-rose-500",
  flat: "text-muted-foreground",
};

export function MetricRow({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="my-4 grid gap-px overflow-hidden rounded-lg ring-1 ring-border/60 sm:grid-cols-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="flex flex-col gap-1 bg-background/40 px-5 py-4"
        >
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {m.label}
          </span>
          <span className="text-2xl font-semibold tabular-nums text-foreground">
            {m.value}
          </span>
          {m.delta ? (
            <span
              className={`text-xs tabular-nums ${
                m.trend ? trendColor[m.trend] : "text-muted-foreground"
              }`}
            >
              {m.delta}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
