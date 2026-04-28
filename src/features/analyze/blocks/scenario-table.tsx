type ScenarioRow = {
  name: string;
  yield: string;
  delta: string;
  trend: "up" | "down" | "flat";
};

const trendColor: Record<ScenarioRow["trend"], string> = {
  up: "text-emerald-500",
  down: "text-rose-500",
  flat: "text-muted-foreground",
};

const trendSign: Record<ScenarioRow["trend"], string> = {
  up: "▲",
  down: "▼",
  flat: "—",
};

type ScenarioTableProps = {
  title?: string;
  caption?: string;
  rows: ScenarioRow[];
};

export function ScenarioTable({ title, caption, rows }: ScenarioTableProps) {
  return (
    <figure className="my-4 flex flex-col gap-3 rounded-lg border border-border/60 bg-background/40">
      {title ? (
        <figcaption className="px-5 pt-4 text-sm font-medium text-foreground">
          {title}
        </figcaption>
      ) : null}
      <div>
        <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-border/60 px-5 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>Scenario</span>
          <span className="text-right">Annual Yield</span>
          <span className="text-right">Delta vs Baseline</span>
        </div>
        <div className="flex flex-col">
          {rows.map((r, i) => (
            <div
              key={r.name}
              className={`grid grid-cols-[1.5fr_1fr_1fr] gap-4 px-5 py-3 text-sm ${
                i < rows.length - 1
                  ? "border-b border-border/40"
                  : ""
              }`}
            >
              <span className="text-foreground">{r.name}</span>
              <span className="text-right tabular-nums text-foreground">
                {r.yield}
              </span>
              <span
                className={`text-right tabular-nums ${trendColor[r.trend]}`}
              >
                <span className="mr-1 text-[10px]">{trendSign[r.trend]}</span>
                {r.delta}
              </span>
            </div>
          ))}
        </div>
      </div>
      {caption ? (
        <figcaption className="px-5 pb-4 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
