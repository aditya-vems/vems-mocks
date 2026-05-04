import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LogoLine } from "@v-ems/element/brand";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  initials,
} from "@v-ems/element";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon,
  ArrowDown01Icon,
  ArrowDownDoubleIcon,
  BookmarkAdd02Icon,
  BulbIcon,
  CheckmarkCircle02Icon,
  Comment01Icon,
  CodeIcon,
  DownloadSquare01Icon,
  FileAddIcon,
  HeadingIcon,
  Layout01Icon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  MoreVerticalIcon,
  Note01Icon,
  PlusSignIcon,
  QuillWrite01Icon,
  QuoteUpIcon,
  Share02Icon,
  Table01Icon,
  TextIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { useSimulations } from "@/app/simulation-context";
import { useMorph } from "@/app/morph-context";
import {
  BlocksCanvas,
  type Block,
} from "./blocks-canvas";
import {
  demoMarginComments,
  type MarginComment,
  MarginComments,
} from "./margin-comments";
import { ActivitySidebar, TocSidebar } from "./toc-sidebar";
import "./prose-report.css";

const dailyGenerationData = [
  { hour: "00", kw: 0 },
  { hour: "02", kw: 0 },
  { hour: "04", kw: 0 },
  { hour: "06", kw: 0.4 },
  { hour: "08", kw: 3.2 },
  { hour: "10", kw: 7.8 },
  { hour: "12", kw: 9.4 },
  { hour: "14", kw: 8.6 },
  { hour: "16", kw: 5.1 },
  { hour: "18", kw: 1.8 },
  { hour: "20", kw: 0.1 },
  { hour: "22", kw: 0 },
];

const monthlyYieldData = [
  { month: "Jan", kwh: 510 },
  { month: "Feb", kwh: 620 },
  { month: "Mar", kwh: 845 },
  { month: "Apr", kwh: 1080 },
  { month: "May", kwh: 1320 },
  { month: "Jun", kwh: 1410 },
  { month: "Jul", kwh: 1485 },
  { month: "Aug", kwh: 1380 },
  { month: "Sep", kwh: 1140 },
  { month: "Oct", kwh: 880 },
  { month: "Nov", kwh: 590 },
  { month: "Dec", kwh: 470 },
];

const summaryProse = `<p>The <strong>Daily Generation Curve</strong> for the rooftop array tracks closely with the cell's clear-sky model on the ten observed days, with a measured peak of <strong>9.4 kW</strong> at solar noon. Three minor dips are attributable to passing cloud cover between 11:30 and 12:15.</p><p>Aggregating across the full year, the simulation projects an annual yield of <strong>11,730 kWh</strong>. Section 3 compares this baseline against three optimisation scenarios.</p>`;

const findingsProse = `<h2>Key findings</h2><ul><li><strong>Tilt + cleaning:</strong> Increasing tilt to 30° and adding a 60-day cleaning cadence improves yield by <strong>6.2%</strong> with negligible OPEX increase.</li><li><strong>Bifacial gain:</strong> Bifacial panels add <strong>10.3%</strong> annual yield assuming reflective rooftop surface; ROI lands at year 7 against a 25-year horizon.</li><li><strong>Inverter sizing:</strong> A −15% inverter undersizing introduces <strong>4.4%</strong> clipping losses in the summer months.</li></ul><p>Recommended next step: green-light the bifacial scenario and run a sensitivity sweep on rooftop albedo (0.15 → 0.45) to bound the upside.</p>`;

const methodologyProse = `<h2>Methodology</h2><p>The simulation uses the <code>Sandia Array Performance Model</code> calibrated to historical TMY3 weather data for the site's coordinates. Inverter behaviour is modelled with the <em>CEC inverter database</em> (Sungrow SG10RT). Soiling losses follow a 0.20%/day accrual reset on cleaning events.</p><blockquote>Confidence interval shown in charts is the 5–95th percentile across the 10-year weather ensemble.</blockquote>`;

const initialBlocks: Block[] = [
  {
    id: "metric-row-1",
    type: "metric",
    metrics: [
      {
        label: "Annual Yield",
        value: "11,730 kWh",
        delta: "+1.4% vs forecast",
        trend: "up",
      },
      {
        label: "Peak Output",
        value: "9.4 kW",
        delta: "Solar noon",
        trend: "flat",
      },
      {
        label: "Performance Ratio",
        value: "82.4%",
        delta: "+0.6 pts vs prior run",
        trend: "up",
      },
    ],
  },
  {
    id: "summary-prose",
    type: "prose",
    content: summaryProse,
  },
  {
    id: "chart-daily",
    type: "chart",
    kind: "area",
    data: dailyGenerationData,
    xKey: "hour",
    yKey: "kw",
    unit: "kW",
    title: "Daily generation profile",
    caption: "Average instantaneous output across 10 observed days.",
  },
  {
    id: "callout-tmy3",
    type: "callout",
    kind: "info",
    content: (
      <>
        Simulation uses TMY3 weather data for the site's coordinates; expect
        ±2.8% variance year-over-year due to weather stochasticity.
      </>
    ),
  },
  {
    id: "monthly-prose",
    type: "prose",
    content:
      `<h2>Monthly yield</h2><p>Aggregated production by month. Summer peaks land in <strong>July</strong> with 1,485 kWh, more than 3× the December trough.</p>`,
  },
  {
    id: "chart-monthly",
    type: "chart",
    kind: "bar",
    data: monthlyYieldData,
    xKey: "month",
    yKey: "kwh",
    unit: "kWh",
  },
  {
    id: "scenarios-prose",
    type: "prose",
    content:
      `<h2>Scenarios compared</h2><p>Four configurations were evaluated against the baseline. The bifacial scenario shows the strongest absolute yield gain; inverter undersizing introduces measurable clipping.</p>`,
  },
  {
    id: "scenarios-table",
    type: "scenario",
    rows: [
      {
        name: "Baseline · 25° tilt, no shading correction",
        yield: "11,730 kWh",
        delta: "—",
        trend: "flat",
      },
      {
        name: "Optimised tilt 30° + cleaning every 60d",
        yield: "12,460 kWh",
        delta: "+6.2%",
        trend: "up",
      },
      {
        name: "Bifacial panels, same tilt",
        yield: "12,940 kWh",
        delta: "+10.3%",
        trend: "up",
      },
      {
        name: "Reduced inverter capacity (−15%)",
        yield: "11,210 kWh",
        delta: "−4.4%",
        trend: "down",
      },
    ],
    caption:
      "Yield computed over the full TMY3 year, with cleaning and shading losses applied per configuration.",
  },
  {
    id: "findings-prose",
    type: "prose",
    content: findingsProse,
  },
  {
    id: "callout-recommendation",
    type: "callout",
    kind: "success",
    content: (
      <>
        Recommended scenario: <strong>Bifacial panels, same tilt</strong>. Net
        present value is positive after year 7 against the 25-year horizon.
      </>
    ),
  },
  {
    id: "methodology-prose",
    type: "prose",
    content: methodologyProse,
  },
];

const tocSections = [
  { id: "summary", label: "Summary" },
  { id: "daily-gen", label: "Daily generation" },
  { id: "monthly-yield", label: "Monthly yield" },
  { id: "scenarios", label: "Scenarios compared" },
  { id: "findings", label: "Key findings" },
  { id: "methodology", label: "Methodology" },
];

const collaborators = ["Aditya Sharma", "Jaya Krishnan", "Mira Reyes", "Noah Lim"];

const activity = [
  { user: "Aditya Sharma", action: "edited the summary section", time: "2 minutes ago" },
  { user: "Mira Reyes", action: "commented on Findings", time: "1 hour ago" },
  { user: "Jaya Krishnan", action: "added Methodology", time: "3 hours ago" },
  { user: "Noah Lim", action: "regenerated from simulation", time: "Yesterday" },
];

type ReportMode = "editing" | "readonly";

const insertGroups = [
  {
    label: "Text",
    items: [
      { id: "heading", label: "Heading", icon: HeadingIcon },
      { id: "paragraph", label: "Paragraph", icon: TextIcon },
      { id: "bullet", label: "Bulleted list", icon: LeftToRightListBulletIcon },
      { id: "numbered", label: "Numbered list", icon: LeftToRightListNumberIcon },
      { id: "quote", label: "Quote", icon: QuoteUpIcon },
      { id: "code", label: "Code block", icon: CodeIcon },
    ],
  },
  {
    label: "Data",
    items: [
      { id: "chart", label: "Chart", icon: Analytics01Icon },
      { id: "scenario-table", label: "Scenario table", icon: Table01Icon },
      { id: "metric-row", label: "Metric row", icon: Note01Icon },
    ],
  },
  {
    label: "Annotations",
    items: [{ id: "callout", label: "Callout", icon: BulbIcon }],
  },
] as const;

function blockFromInsertId(id: string): Block {
  const newId = `${id}-${Date.now()}`;
  switch (id) {
    case "heading":
      return { id: newId, type: "prose", content: "<h2>New heading</h2>" };
    case "paragraph":
      return {
        id: newId,
        type: "prose",
        content: "<p></p>",
        placeholder: "Write something…",
      };
    case "bullet":
      return {
        id: newId,
        type: "prose",
        content: "<ul><li>List item</li></ul>",
      };
    case "numbered":
      return {
        id: newId,
        type: "prose",
        content: "<ol><li>List item</li></ol>",
      };
    case "quote":
      return {
        id: newId,
        type: "prose",
        content: "<blockquote><p>Quoted text</p></blockquote>",
      };
    case "code":
      return {
        id: newId,
        type: "prose",
        content: "<pre><code>// code</code></pre>",
      };
    case "chart":
      return {
        id: newId,
        type: "chart",
        kind: "line",
        data: [
          { x: "A", y: 12 },
          { x: "B", y: 18 },
          { x: "C", y: 14 },
          { x: "D", y: 22 },
          { x: "E", y: 19 },
        ],
        xKey: "x",
        yKey: "y",
        title: "New chart",
      };
    case "scenario-table":
      return {
        id: newId,
        type: "scenario",
        title: "New comparison",
        rows: [
          {
            name: "Baseline",
            yield: "—",
            delta: "—",
            trend: "flat",
          },
        ],
      };
    case "metric-row":
      return {
        id: newId,
        type: "metric",
        metrics: [
          { label: "Metric A", value: "0" },
          { label: "Metric B", value: "0" },
          { label: "Metric C", value: "0" },
        ],
      };
    case "callout":
      return {
        id: newId,
        type: "callout",
        kind: "info",
        content: <>New callout — describe the insight here.</>,
      };
    default:
      return { id: newId, type: "prose", content: "<p></p>" };
  }
}

type SaveState = "idle" | "saving" | "saved";

function SaveStatus({ state }: { state: SaveState }) {
  if (state === "idle") {
    return <span aria-hidden className="h-4 w-px" />;
  }
  return (
    <div
      key={state}
      className="flex items-center gap-1.5 text-xs text-muted-foreground animate-in fade-in-0 slide-in-from-left-1 duration-300 ease-out fill-mode-both"
    >
      {state === "saving" ? (
        <>
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-amber-500 motion-safe:animate-pulse"
          />
          <span className="tabular-nums">Saving…</span>
        </>
      ) : (
        <>
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            strokeWidth={2.25}
            className="size-3.5 text-emerald-500"
          />
          <span>Saved</span>
        </>
      )}
    </div>
  );
}

const templates = [
  { id: "daily-generation", label: "Daily Generation Report" },
  { id: "yield-comparison", label: "Yield Comparison" },
  { id: "scenario-analysis", label: "Scenario Analysis" },
  { id: "kpi-dashboard", label: "KPI Dashboard" },
];

function MoreMenu({
  onNewBlank,
  onNewFromTemplate,
  onSaveAsTemplate,
}: {
  onNewBlank: () => void;
  onNewFromTemplate: (id: string) => void;
  onSaveAsTemplate: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="More options"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
        >
          <HugeiconsIcon
            icon={MoreVerticalIcon}
            strokeWidth={2}
            className="size-4"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-60">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Create new
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={onNewBlank}>
          <HugeiconsIcon
            icon={FileAddIcon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />
          <span className="flex-1">Blank report</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <HugeiconsIcon
              icon={Layout01Icon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
            <span className="flex-1">From template</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56">
            {templates.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onSelect={() => onNewFromTemplate(t.id)}
              >
                {t.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSaveAsTemplate}>
          <HugeiconsIcon
            icon={BookmarkAdd02Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />
          <span className="flex-1">Save as template…</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ActionButton({
  icon,
  children,
  onClick,
}: {
  icon: typeof Share02Icon;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-normal text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground"
    >
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-[18px]" />
      {children}
    </button>
  );
}

function InsertMenu({ onInsert }: { onInsert: (id: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-normal text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            strokeWidth={2.25}
            className="size-[18px]"
          />
          Insert
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2.25}
            className="size-[14px] text-muted-foreground/70"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-56">
        {insertGroups.map((group, gi) => (
          <div key={group.label}>
            {gi > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {group.label}
            </DropdownMenuLabel>
            {group.items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => onInsert(item.id)}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  strokeWidth={2}
                  className="size-4 text-muted-foreground"
                />
                <span className="flex-1">{item.label}</span>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ModeMenu({
  mode,
  onChange,
}: {
  mode: ReportMode;
  onChange: (mode: ReportMode) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-normal text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
        >
          <HugeiconsIcon
            icon={mode === "editing" ? QuillWrite01Icon : UnavailableIcon}
            strokeWidth={2}
            className="size-[18px]"
          />
          {mode === "editing" ? "Editing" : "Read only"}
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2.25}
            className="size-[14px] text-muted-foreground/70"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-60">
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(v: string) => onChange(v as ReportMode)}
        >
          <DropdownMenuRadioItem value="editing">
            <span className="flex flex-1 flex-col">
              <span className="font-medium">Editing</span>
              <span className="text-[11px] text-muted-foreground">
                Make changes to the report
              </span>
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="readonly">
            <span className="flex flex-1 flex-col">
              <span className="font-medium">Read only</span>
              <span className="text-[11px] text-muted-foreground">
                View without making changes
              </span>
            </span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AnalyzePage() {
  const { isMorphing } = useMorph();
  const {
    simulations,
    selectedId,
    activeReportId,
    setActiveReportId,
  } = useSimulations();
  const sim = simulations.find((s) => s.id === selectedId);
  const generatedDate = "Apr 28, 2026";
  const owner = sim?.owner ?? "Aditya Sharma";
  const [comments, setComments] =
    useState<MarginComment[]>(demoMarginComments);
  const hasComments = comments.length > 0;
  const reports = sim?.reports ?? [];
  const resolvedActiveReportId = useMemo(() => {
    const fallback = reports[0]?.id ?? null;
    if (!activeReportId) return fallback;
    return reports.some((r) => r.id === activeReportId) ? activeReportId : fallback;
  }, [activeReportId, reports]);
  const activeReportName = useMemo(() => {
    const fromId = reports.find((r) => r.id === resolvedActiveReportId)?.name;
    return fromId ?? reports[0]?.name ?? "Report";
  }, [reports, resolvedActiveReportId]);

  const [mode, setMode] = useState<ReportMode>("editing");
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const editable = mode === "editing";
  const [showComments, setShowComments] = useState<boolean>(true);

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const debounceRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const markDirty = useCallback(() => {
    setSaveState("saving");
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    debounceRef.current = window.setTimeout(() => {
      setSaveState("saved");
      idleTimerRef.current = window.setTimeout(() => {
        setSaveState("idle");
      }, 1800);
    }, 700);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!reports.length) return;
    if (activeReportId && reports.some((r) => r.id === activeReportId)) return;
    setActiveReportId(reports[0]?.id ?? null);
  }, [activeReportId, reports, setActiveReportId]);

  useEffect(() => {
    setShowComments(hasComments);
  }, [hasComments, selectedId]);

  function blockReference(block: Block) {
    switch (block.type) {
      case "chart":
        return block.title ?? "Chart";
      case "scenario":
        return block.title ?? "Scenario table";
      case "metric":
        return "Metrics";
      case "callout":
        return "Callout";
      case "divider":
        return "Divider";
      case "prose":
        return "Text";
    }
  }

  function addCommentForBlock(block: Block) {
    const text = window.prompt("Comment");
    if (!text) return;
    const comment: MarginComment = {
      id: `c-${Date.now()}`,
      user: "You",
      time: "Just now",
      text,
      reference: blockReference(block),
    };
    setComments((prev) => [comment, ...prev]);
    setShowComments(true);
  }

  function toggleResolveComment(id: string) {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c)),
    );
  }

  function handleInsert(id: string) {
    const newBlock = blockFromInsertId(id);
    setBlocks((prev) => [...prev, newBlock]);
    markDirty();
  }

  function handleBlocksChange(next: Block[]) {
    setBlocks(next);
    markDirty();
  }

  function handleNewBlank() {
    setBlocks([]);
    markDirty();
  }

  function handleNewFromTemplate(_id: string) {
    setBlocks(initialBlocks);
    markDirty();
  }

  function handleSaveAsTemplate() {
    markDirty();
  }

  return (
    <Card className="flex w-full min-h-0 flex-1 flex-col gap-0 overflow-hidden py-0 ring-inset">
      {/* Action bar */}
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Breadcrumb>
            <BreadcrumbList className="text-sm">
              <BreadcrumbItem>
                <BreadcrumbLink className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
                  Reports
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="group flex items-center gap-1.5 rounded-md px-2 py-1 -mx-2 font-medium text-foreground outline-none transition-colors hover:bg-accent"
                    >
                      <BreadcrumbPage className="font-medium text-foreground">
                        {activeReportName}
                      </BreadcrumbPage>
                      <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        strokeWidth={2.25}
                        className="size-3 text-muted-foreground transition-colors group-hover:text-foreground"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" sideOffset={8} className="w-72">
                    <DropdownMenuRadioGroup
                      value={resolvedActiveReportId ?? ""}
                      onValueChange={(v: string) => setActiveReportId(v)}
                    >
                      {reports.map((r) => (
                        <DropdownMenuRadioItem key={r.id} value={r.id}>
                          {r.name}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <span aria-hidden className="h-3 w-px bg-border" />
          <SaveStatus state={saveState} />
        </div>

        <div className="flex items-center gap-1">
          <InsertMenu onInsert={handleInsert} />
          <ModeMenu mode={mode} onChange={setMode} />
          <button
            type="button"
            aria-label="Toggle comments"
            onClick={() => setShowComments((v) => !v)}
            className={`flex size-8 items-center justify-center rounded-md transition-colors outline-none hover:bg-accent ${
              showComments ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <HugeiconsIcon
              icon={Comment01Icon}
              strokeWidth={2.25}
              className="size-[18px]"
            />
          </button>
          <span aria-hidden className="mx-1 h-4 w-px bg-border" />
          <ActionButton icon={Share02Icon}>Share</ActionButton>
          <ActionButton icon={DownloadSquare01Icon}>Export</ActionButton>
          <MoreMenu
            onNewBlank={handleNewBlank}
            onNewFromTemplate={handleNewFromTemplate}
            onSaveAsTemplate={handleSaveAsTemplate}
          />
        </div>
      </div>

      {/* Body: TOC | document | activity */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <TocSidebar sections={tocSections} />

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full px-6 py-10">
            <div className="relative mx-auto w-full max-w-[1120px]">
              <article
                className={`mx-auto flex w-full max-w-[820px] flex-col rounded-2xl bg-card ring-1 ring-foreground/10 shadow-2xl px-12 py-10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:min-w-[760px] ${
                  showComments ? "-translate-x-24" : "translate-x-0"
                }`}
              >
            {/* Report header */}
            <header className="flex items-center justify-between gap-4 border-b border-border/60 pb-6">
              <LogoLine
                height={18}
                className="[&>path]:text-primary shrink-0"
              />
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Simulation Report
                </div>
                <div className="text-xs tabular-nums text-muted-foreground/80">
                  {generatedDate} · {sim?.name ?? "Rooftop Solar"}
                </div>
              </div>
            </header>

            {/* Title block (static) */}
            <div className="flex flex-col gap-3 pt-8">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Report
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {activeReportName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Avatar className="size-5">
                    <AvatarImage
                      src={`https://i.pravatar.cc/96?u=${encodeURIComponent(owner)}`}
                      alt=""
                    />
                    <AvatarFallback className="bg-muted text-[10px] font-medium">
                      {initials(owner)}
                    </AvatarFallback>
                  </Avatar>
                  {owner}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span>Generated {generatedDate}</span>
                <span className="text-muted-foreground/40">·</span>
                <span>{sim?.name ?? "Rooftop Solar"}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-muted-foreground/70">
                  Last edited 2 minutes ago
                </span>
              </div>
            </div>

            {/* Blocks */}
            <div className="mt-8">
              {isMorphing ? (
                <div className="flex flex-col gap-3">
                  <div className="h-20 rounded-lg bg-muted/30" />
                  <div className="h-56 rounded-lg bg-muted/30" />
                  <div className="h-40 rounded-lg bg-muted/30" />
                </div>
              ) : (
                <BlocksCanvas
                  blocks={blocks}
                  editable={editable}
                  onAddComment={addCommentForBlock}
                  onChange={handleBlocksChange}
                  onUpdate={markDirty}
                />
              )}
            </div>

            {/* End of report */}
            <div className="mt-12 flex items-center justify-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
              <span aria-hidden className="h-px flex-1 bg-border/60" />
              <HugeiconsIcon
                icon={ArrowDownDoubleIcon}
                strokeWidth={2}
                className="size-3.5"
              />
              End of report
              <span aria-hidden className="h-px flex-1 bg-border/60" />
            </div>

            {/* Report footer */}
            <footer className="mt-8 flex items-center justify-between gap-4 border-t border-border/60 pt-5 text-[11px] tabular-nums text-muted-foreground">
              <span>VEMS · Confidential</span>
              <span>Page 1 of 1</span>
            </footer>
            </article>
            </div>
          </div>
        </div>

        <ActivitySidebar collaborators={collaborators} activity={activity} />
      </div>
      <div
        className={`fixed right-6 top-1/2 z-40 -translate-y-1/2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          showComments
            ? "translate-x-0 opacity-100"
            : "translate-x-6 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-[288px] max-h-[calc(100vh-11rem)] overflow-y-auto">
          <MarginComments comments={comments} onResolve={toggleResolveComment} />
        </div>
      </div>
    </Card>
  );
}
