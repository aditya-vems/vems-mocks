import { useMemo, useState } from "react";
import {
  Avatar,
  AvatarFallback,
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
  SlidersHorizontalIcon,
  Search01Icon,
  FilterMailIcon,
} from "@hugeicons/core-free-icons";

type SimulationStatus = "active" | "draft" | "archived";

type SimulationSummary = {
  id: string;
  name: string;
  status: SimulationStatus;
  reports: number;
  comparisons: number;
  owner: string;
  updated: string;
};

const simulations: SimulationSummary[] = [
  {
    id: "sim-rooftop-solar",
    name: "Rooftop Solar",
    status: "active",
    reports: 4,
    comparisons: 2,
    owner: "Aditya Sharma",
    updated: "2d ago",
  },
  {
    id: "sim-campus-microgrid",
    name: "Campus Microgrid",
    status: "active",
    reports: 3,
    comparisons: 1,
    owner: "Jaya Krishnan",
    updated: "1w ago",
  },
  {
    id: "sim-battery-backup",
    name: "Battery Backup",
    status: "draft",
    reports: 2,
    comparisons: 0,
    owner: "Mira Reyes",
    updated: "Apr 02",
  },
  {
    id: "sim-fleet-charging",
    name: "Fleet Charging",
    status: "active",
    reports: 5,
    comparisons: 3,
    owner: "Noah Lim",
    updated: "3d ago",
  },
  {
    id: "sim-peak-shaving",
    name: "Peak Shaving",
    status: "active",
    reports: 2,
    comparisons: 0,
    owner: "Aditya Sharma",
    updated: "1w ago",
  },
  {
    id: "sim-demand-response",
    name: "Demand Response",
    status: "draft",
    reports: 1,
    comparisons: 0,
    owner: "Jaya Krishnan",
    updated: "2w ago",
  },
  {
    id: "sim-wind-farm",
    name: "Wind Farm Dispatch",
    status: "active",
    reports: 6,
    comparisons: 4,
    owner: "Mira Reyes",
    updated: "4d ago",
  },
  {
    id: "sim-ev-depot",
    name: "EV Depot Scheduling",
    status: "active",
    reports: 3,
    comparisons: 1,
    owner: "Noah Lim",
    updated: "Apr 08",
  },
  {
    id: "sim-cold-chain",
    name: "Cold Chain Resilience",
    status: "archived",
    reports: 2,
    comparisons: 0,
    owner: "Aditya Sharma",
    updated: "Apr 11",
  },
  {
    id: "sim-data-center",
    name: "Data Center Cooling",
    status: "active",
    reports: 4,
    comparisons: 2,
    owner: "Jaya Krishnan",
    updated: "Yesterday",
  },
  {
    id: "sim-residential-vpp",
    name: "Residential VPP",
    status: "draft",
    reports: 1,
    comparisons: 0,
    owner: "Mira Reyes",
    updated: "2w ago",
  },
  {
    id: "sim-hydrogen",
    name: "Hydrogen Electrolyzer",
    status: "active",
    reports: 3,
    comparisons: 1,
    owner: "Noah Lim",
    updated: "3d ago",
  },
];

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

function MetaPiece({
  count,
  singular,
  plural,
}: {
  count: number;
  singular: string;
  plural: string;
}) {
  if (count === 0) return null;
  return (
    <span className="tabular-nums">
      {count} {count === 1 ? singular : plural}
    </span>
  );
}

function SimulationRow({ simulation }: { simulation: SimulationSummary }) {
  const meta: React.ReactNode[] = [];
  if (simulation.reports > 0) {
    meta.push(
      <MetaPiece
        key="reports"
        count={simulation.reports}
        singular="report"
        plural="reports"
      />,
    );
  }
  if (simulation.comparisons > 0) {
    meta.push(
      <MetaPiece
        key="comparisons"
        count={simulation.comparisons}
        singular="comparison"
        plural="comparisons"
      />,
    );
  }
  if (meta.length === 0) {
    meta.push(
      <span key="empty" className="text-muted-foreground/60">
        No reports yet
      </span>,
    );
  }

  return (
    <button
      type="button"
      className="group flex w-full items-center gap-4 border-b border-border/50 px-2 py-3 text-left outline-none transition-colors last:border-b-0 hover:bg-accent/40 focus-visible:bg-accent/40"
    >
      <span
        aria-hidden
        className={`size-2 shrink-0 rounded-full ${statusDot[simulation.status]}`}
        title={statusLabel[simulation.status]}
      />
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {simulation.name}
      </span>
      <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
        {meta.map((node, i) => (
          <span key={i} className="flex items-center gap-3">
            {i > 0 ? (
              <span aria-hidden className="text-muted-foreground/40">
                ·
              </span>
            ) : null}
            {node}
          </span>
        ))}
      </div>
      <span className="w-20 text-right text-xs tabular-nums text-muted-foreground">
        {simulation.updated}
      </span>
      <Avatar
        className="size-6 shrink-0"
        title={`Owner: ${simulation.owner}`}
      >
        <AvatarFallback className="bg-muted text-[10px] font-medium">
          {initials(simulation.owner)}
        </AvatarFallback>
      </Avatar>
    </button>
  );
}

export function HomePage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<SimulationStatus>>(
    new Set(),
  );
  const [ownerFilter, setOwnerFilter] = useState<Set<string>>(new Set());
  const [updatedFilter, setUpdatedFilter] = useState<UpdatedFilter>("any");

  const owners = useMemo(
    () => Array.from(new Set(simulations.map((s) => s.owner))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return simulations.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false;
      if (statusFilter.size > 0 && !statusFilter.has(s.status)) return false;
      if (ownerFilter.size > 0 && !ownerFilter.has(s.owner)) return false;
      return true;
    });
  }, [query, statusFilter, ownerFilter]);

  const totalReports = filtered.reduce((acc, s) => acc + s.reports, 0);
  const totalComparisons = filtered.reduce((acc, s) => acc + s.comparisons, 0);
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

  return (
    <Card className="flex w-full min-h-0 flex-1 flex-col gap-0 overflow-hidden pt-0 ring-inset">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-6">
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
      <div className="flex h-12 shrink-0 items-center gap-6 border-b border-border px-6">
        <Metric label="Simulations" value={simulations.length} />
        <span aria-hidden className="h-4 w-px bg-border" />
        <Metric label="Active" value={activeCount} />
        <span aria-hidden className="h-4 w-px bg-border" />
        <Metric label="Reports" value={totalReports} />
        <span aria-hidden className="h-4 w-px bg-border" />
        <Metric label="Comparisons" value={totalComparisons} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[920px] flex-col gap-8 px-8 py-10">
          <section className="flex flex-col">
            <div className="flex h-9 items-center gap-4 border-b border-border px-2">
              <span aria-hidden className="size-2 shrink-0" />
              <span className="flex-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Name
              </span>
              <span className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground sm:block">
                Activity
              </span>
              <span className="w-20 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Updated
              </span>
              <span className="w-6 shrink-0" />
            </div>
            {filtered.map((s) => (
              <SimulationRow key={s.id} simulation={s} />
            ))}
            {filtered.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                No simulations match your filters
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </Card>
  );
}
