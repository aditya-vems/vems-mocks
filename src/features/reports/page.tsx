import { Separator } from "@v-ems/element";
import { ReportList } from "./report-list";
import { ReportEditor } from "./editor";

export function ReportsPage() {
  return (
    <div className="flex h-full w-full">
      <aside className="w-64 shrink-0 border-r bg-sidebar">
        <ReportList />
      </aside>
      <Separator orientation="vertical" />
      <section className="min-w-0 flex-1">
        <ReportEditor />
      </section>
    </div>
  );
}
