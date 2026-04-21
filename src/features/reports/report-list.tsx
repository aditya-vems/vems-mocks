import { Badge, ScrollArea, Separator } from "@v-ems/element";
import { useReportsStore } from "./store";

export function ReportList() {
  const reports = useReportsStore((s) => s.reports);
  const activeId = useReportsStore((s) => s.activeId);
  const setActive = useReportsStore((s) => s.setActive);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Reports
        </span>
        <Badge variant="secondary" className="text-[10px]">
          {reports.length}
        </Badge>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <ul className="flex flex-col gap-0.5 p-2">
          {reports.map((r) => {
            const isActive = r.id === activeId;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setActive(r.id)}
                  className={[
                    "flex w-full flex-col gap-0.5 rounded-md px-2 py-2 text-left text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/60",
                  ].join(" ")}
                >
                  <span className="truncate font-medium">{r.title}</span>
                  <span className="text-[11px] text-muted-foreground">{r.updatedAt}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}
