import { useMemo, useRef, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  initials,
} from "@v-ems/element";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  File01Icon,
  FilterMailIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { useMorph } from "@/app/morph-context";
import { useSimulations } from "@/app/simulation-context";
import type {
  Report,
  Simulation,
  SimulationStatus,
} from "@/data/simulations";

const statusDot: Record<SimulationStatus, string> = {
  active: "bg-emerald-500",
  draft: "bg-amber-500",
  archived: "bg-muted-foreground/40",
};

const statusLabel: Record<SimulationStatus, string> = {
  active: "Active",
  draft: "Draft",
  archived: "Archived",
};

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-sm font-medium tabular-nums text-foreground">
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

type UpdatedFilter = "any" | "week" | "month" | "older";

const updatedOptions: { value: UpdatedFilter; label: string }[] = [
  { value: "any", label: "Any time" },
  { value: "week", label: "Last 7 days" },
  { value: "month", label: "Last 30 days" },
  { value: "older", label: "Older" },
];

const allStatuses: SimulationStatus[] = ["active", "draft", "archived"];

const REPORTS_VISIBLE = 4;

function avatarUrl(seed: string) {
  return `https://i.pravatar.cc/96?u=${encodeURIComponent(seed)}`;
}

function ReportRow({
  report,
  onOpen,
}: {
  report: Report;
  onOpen: (report: Report) => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen(report);
      }}
      className="group/report flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50"
    >
      <HugeiconsIcon
        icon={File01Icon}
        strokeWidth={2}
        className="size-4 shrink-0 text-muted-foreground transition-colors group-hover/report:text-foreground"
      />
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {report.name}
      </span>
    </button>
  );
}

function SimulationCard({
  simulation,
  onOpenSimulation,
  onOpenReport,
}: {
  simulation: Simulation;
  onOpenSimulation: (sim: Simulation, rect: DOMRect) => void;
  onOpenReport: (sim: Simulation, report: Report, rect: DOMRect) => void;
}) {
  const visibleReports = simulation.reports.slice(0, REPORTS_VISIBLE);
  const remaining = simulation.reports.length - visibleReports.length;
  const rootRef = useRef<HTMLDivElement>(null);

  function openFromStatus(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    onOpenSimulation(simulation, rect);
  }

  function openFromReport(report: Report) {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    onOpenReport(simulation, report, rect);
  }

  return (
    <div
      ref={rootRef}
      className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-lg border border-border/60 bg-background/40 p-4 outline-none transition-colors hover:border-border hover:bg-background/70 focus-visible:border-border focus-visible:bg-background/70"
    >
      <div className="flex h-6 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span
            aria-hidden
            className={`size-2 shrink-0 rounded-full ${statusDot[simulation.status]}`}
          />
          <span className="truncate text-base font-medium leading-none text-foreground">
            {simulation.name}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={openFromStatus}
          className="group/status h-6 px-3 -mr-3 text-xs text-muted-foreground hover:text-foreground focus-visible:text-foreground"
        >
          <span className="block transition-transform duration-200 ease-out group-hover/status:-translate-x-1">
            {statusLabel[simulation.status]}
          </span>
          <span
            aria-hidden
            className="inline-flex h-full w-0 items-center overflow-hidden opacity-0 transition-[width,opacity] duration-200 ease-out group-hover/status:w-3 group-hover/status:opacity-100"
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-3.5 shrink-0"
            />
          </span>
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {simulation.reports.length}{" "}
          {simulation.reports.length === 1 ? "report" : "reports"}
        </span>
        {simulation.comparisons > 0 ? (
          <>
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
            <span className="tabular-nums">
              {simulation.comparisons}{" "}
              {simulation.comparisons === 1 ? "comparison" : "comparisons"}
            </span>
          </>
        ) : null}
      </div>

      {simulation.reports.length > 0 ? (
        <div className="-mx-2 flex flex-col">
          {visibleReports.map((r) => (
            <ReportRow
              key={r.id}
              report={r}
              onOpen={openFromReport}
            />
          ))}
          {remaining > 0 ? (
            <span className="px-2 pt-1 text-xs text-muted-foreground/70">
              +{remaining} more
            </span>
          ) : null}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/60">No reports yet</p>
      )}

      <div className="-mx-4 mt-auto flex items-center justify-between border-t border-border/40 px-4 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="size-6 shrink-0">
            <AvatarImage
              src={avatarUrl(simulation.owner)}
              alt=""
            />
            <AvatarFallback className="bg-muted text-[11px] font-medium">
              {initials(simulation.owner)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-xs text-muted-foreground">
            {simulation.owner}
          </span>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {simulation.updated}
        </span>
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { simulations, setSelectedId, setActiveReportId } = useSimulations();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<SimulationStatus>>(
    new Set(),
  );
  const [ownerFilter, setOwnerFilter] = useState<Set<string>>(new Set());
  const [updatedFilter, setUpdatedFilter] = useState<UpdatedFilter>("any");
  const cardRootRef = useRef<HTMLDivElement>(null);
  const { startMorph } = useMorph();

  const owners = useMemo(
    () => Array.from(new Set(simulations.map((s) => s.owner))).sort(),
    [simulations],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return simulations.filter((s) => {
      if (q) {
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesReport = s.reports.some((r) =>
          r.name.toLowerCase().includes(q),
        );
        if (!matchesName && !matchesReport) return false;
      }
      if (statusFilter.size > 0 && !statusFilter.has(s.status)) return false;
      if (ownerFilter.size > 0 && !ownerFilter.has(s.owner)) return false;
      return true;
    });
  }, [simulations, query, statusFilter, ownerFilter]);

  const totalReports = filtered.reduce(
    (acc, s) => acc + s.reports.length,
    0,
  );
  const totalComparisons = filtered.reduce(
    (acc, s) => acc + s.comparisons,
    0,
  );
  const activeCount = filtered.filter((s) => s.status === "active").length;
  const activeFilters =
    statusFilter.size +
    ownerFilter.size +
    (updatedFilter !== "any" ? 1 : 0);

  function toggleStatus(status: SimulationStatus, checked: boolean) {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (checked) next.add(status);
      else next.delete(status);
      return next;
    });
  }

  function toggleOwner(owner: string, checked: boolean) {
    setOwnerFilter((prev) => {
      const next = new Set(prev);
      if (checked) next.add(owner);
      else next.delete(owner);
      return next;
    });
  }

  function clearFilters() {
    setStatusFilter(new Set());
    setOwnerFilter(new Set());
    setUpdatedFilter("any");
  }

  function openSimulation(sim: Simulation, rect: DOMRect) {
    const target = cardRootRef.current?.getBoundingClientRect();
    if (!target) {
      setSelectedId(sim.id);
      setActiveReportId(null);
      navigate("/simulate");
      return;
    }
    startMorph(rect, target, undefined, () => {
      setSelectedId(sim.id);
      setActiveReportId(null);
      navigate("/simulate");
    });
  }

  function openReport(sim: Simulation, report: Report, rect: DOMRect) {
    const target = cardRootRef.current?.getBoundingClientRect();
    if (!target) {
      setSelectedId(sim.id);
      setActiveReportId(report.id);
      navigate("/analyze");
      return;
    }
    startMorph(rect, target, undefined, () => {
      setSelectedId(sim.id);
      setActiveReportId(report.id);
      navigate("/analyze");
    });
  }

  return (
    <Card
      ref={cardRootRef}
      className="flex w-full min-h-0 flex-1 flex-col gap-0 overflow-hidden py-0 ring-inset"
    >
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-6 animate-in fade-in-0 slide-in-from-top-2 duration-500 ease-out fill-mode-both">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="size-5 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a Scenario or Report"
          className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Filter simulations"
              className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
            >
              <HugeiconsIcon
                icon={FilterMailIcon}
                strokeWidth={2}
                className="size-5"
              />
              {activeFilters > 0 ? (
                <span
                  aria-hidden
                  className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary"
                />
              ) : null}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={10} className="w-60">
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Status
            </DropdownMenuLabel>
            {allStatuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilter.has(status)}
                onCheckedChange={(checked: boolean) =>
                  toggleStatus(status, checked)
                }
                onSelect={(e: Event) => e.preventDefault()}
              >
                {statusLabel[status]}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Owner
            </DropdownMenuLabel>
            {owners.map((owner) => (
              <DropdownMenuCheckboxItem
                key={owner}
                checked={ownerFilter.has(owner)}
                onCheckedChange={(checked: boolean) =>
                  toggleOwner(owner, checked)
                }
                onSelect={(e: Event) => e.preventDefault()}
              >
                {owner}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Updated
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={updatedFilter}
              onValueChange={(v: string) =>
                setUpdatedFilter(v as UpdatedFilter)
              }
            >
              {updatedOptions.map((opt) => (
                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={clearFilters}
              disabled={activeFilters === 0}
            >
              Clear filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className="flex h-12 shrink-0 items-center gap-6 border-b border-border px-6 animate-in fade-in-0 slide-in-from-top-1 duration-500 ease-out fill-mode-both"
        style={{ animationDelay: "100ms" }}
      >
        <Metric label="Simulations" value={simulations.length} />
        <span aria-hidden className="h-4 w-px bg-border" />
        <Metric label="Active" value={activeCount} />
        <span aria-hidden className="h-4 w-px bg-border" />
        <Metric label="Reports" value={totalReports} />
        <span aria-hidden className="h-4 w-px bg-border" />
        <Metric label="Comparisons" value={totalComparisons} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-8 py-8">
          {filtered.length > 0 ? (
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(320px, 1fr))",
                gridAutoRows: "300px",
              }}
            >
              {filtered.map((s, i) => (
                <div
                  key={s.id}
                  className="animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-out fill-mode-both"
                  style={{
                    animationDelay: `${Math.min(i, 8) * 35}ms`,
                  }}
                >
                  <SimulationCard
                    simulation={s}
                    onOpenSimulation={openSimulation}
                    onOpenReport={openReport}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No simulations match your filters
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
