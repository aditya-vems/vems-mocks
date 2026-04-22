import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu02Icon,
  Mail01Icon,
  UserIcon,
  Moon01Icon,
  Sun01Icon,
  ComputerIcon,
  PlusSignCircleIcon,
  Logout01Icon,
  ColorsIcon,
  CheckmarkCircle02Icon,
  PresentationBarChart01Icon,
  PlayCircleIcon,
  Database02Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Popover,
  PopoverTrigger,
  PopoverContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  truncate,
  initials,
} from "@v-ems/element";

export function RightHeaderItems() {
  return (
    <div className="flex items-center justify-end gap-8">
      <SettingsSheet />
      <NotificationsPopover />
      <AccountMenu />
    </div>
  );
}

function IconButton({
  icon,
  label,
  ...props
}: {
  icon: typeof Menu02Icon;
  label: string;
} & React.ComponentProps<"button">) {
  return (
    <button
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
      {...props}
    >
      <HugeiconsIcon icon={icon} strokeWidth={2.25} className="size-[18px]" />
    </button>
  );
}

function SettingsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <IconButton icon={Menu02Icon} label="Settings" />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

type SystemNotif = {
  id: string;
  icon: typeof CheckmarkCircle02Icon;
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
};

type Invite = {
  id: string;
  name: string;
  action: string;
  project: string;
  time: string;
  unread?: boolean;
};

type Detail =
  | { type: "system"; item: SystemNotif }
  | { type: "invite"; item: Invite };

type Origin = { top: number; left: number; width: number; height: number };

const systemNotifs: SystemNotif[] = [
  {
    id: "s1",
    icon: CheckmarkCircle02Icon,
    title: "Simulation Run Completed",
    desc: "Traffic Sim #42 finished in 3m 12s across 120 scenarios, with all assertions passing on the production branch.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "s2",
    icon: PresentationBarChart01Icon,
    title: "Analysis Ready",
    desc: "Results for Lane Merge scenario are available to review. Coverage increased by 4.2% over last run.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "s3",
    icon: PlayCircleIcon,
    title: "Scheduled Run Started",
    desc: "Weekly validation suite is underway across 18 scenarios. Estimated completion time is 42 minutes.",
    time: "4h ago",
  },
  {
    id: "s4",
    icon: Database02Icon,
    title: "Dataset Updated",
    desc: "Highway corpus v2.3 has been published to your workspace. 312 new clips were added from the March drives.",
    time: "Yesterday",
  },
  {
    id: "s5",
    icon: CheckmarkCircle02Icon,
    title: "Export Complete",
    desc: "Run summary.csv is ready to download. The export contains 2,841 rows covering all runs from April.",
    time: "2d ago",
  },
  {
    id: "s6",
    icon: PresentationBarChart01Icon,
    title: "Weekly Report Generated",
    desc: "Fleet coverage metrics for week 16 are available. Urban scenarios led with 94% scenario pass rate.",
    time: "3d ago",
  },
  {
    id: "s7",
    icon: Database02Icon,
    title: "Index Rebuild Finished",
    desc: "Scenario search index rebuilt in 6m 41s. All 1.2M entries are now queryable with updated embeddings.",
    time: "4d ago",
  },
  {
    id: "s8",
    icon: PlayCircleIcon,
    title: "Regression Suite Queued",
    desc: "Nightly regression for the perception stack is queued behind two higher-priority jobs. ETA 22 minutes.",
    time: "5d ago",
  },
  {
    id: "s9",
    icon: CheckmarkCircle02Icon,
    title: "Calibration Verified",
    desc: "Sensor calibration against the April reference set passed all 14 checkpoints within tolerance.",
    time: "6d ago",
  },
  {
    id: "s10",
    icon: PresentationBarChart01Icon,
    title: "A/B Test Summary Posted",
    desc: "Planner v2 vs v1 across 400 scenarios: collision-free rate up 2.8%, intervention rate down 1.4%.",
    time: "1w ago",
  },
  {
    id: "s11",
    icon: Database02Icon,
    title: "Storage Quota Alert",
    desc: "Workspace 'Urban Perception' is at 86% of its 2TB quota. Consider archiving older run artifacts.",
    time: "1w ago",
  },
  {
    id: "s12",
    icon: PlayCircleIcon,
    title: "Replay Build Ready",
    desc: "Deterministic replay build 2026.4.22-a is available for download on macOS, Linux, and Windows.",
    time: "2w ago",
  },
];

const invites: Invite[] = [
  {
    id: "i1",
    name: "Sara Chen",
    action: "invited you to",
    project: "Urban Perception",
    time: "10m ago",
    unread: true,
  },
  {
    id: "i2",
    name: "Marcus Leland",
    action: "requested review on",
    project: "Night Scenarios",
    time: "2h ago",
    unread: true,
  },
  {
    id: "i3",
    name: "Priya Nandakumar",
    action: "shared",
    project: "Baseline Fleet",
    time: "Yesterday",
  },
  {
    id: "i4",
    name: "Leo Park",
    action: "added you to",
    project: "Edge Case Library",
    time: "2d ago",
  },
  {
    id: "i5",
    name: "Anika Shah",
    action: "requested review on",
    project: "Interchange Merge v3",
    time: "3d ago",
    unread: true,
  },
  {
    id: "i6",
    name: "Diego Ramirez",
    action: "invited you to",
    project: "Harbor Dock Replay",
    time: "4d ago",
  },
  {
    id: "i7",
    name: "Yuna Watanabe",
    action: "shared",
    project: "Tunnel Lighting Bench",
    time: "5d ago",
  },
  {
    id: "i8",
    name: "Ethan Brooks",
    action: "added you to",
    project: "Rural Corridor Sweep",
    time: "1w ago",
  },
  {
    id: "i9",
    name: "Hana Novak",
    action: "requested review on",
    project: "Roundabout Yield Study",
    time: "1w ago",
  },
];

const POPOVER_HEIGHT = 480;

const MORPH_MS = 380;

type Bucket = "today" | "week" | "earlier";

function bucketOf(time: string): Bucket {
  if (time.endsWith("m ago") || time.endsWith("h ago")) return "today";
  if (time === "Yesterday") return "week";
  const dMatch = time.match(/^(\d+)d ago$/);
  if (dMatch) return Number(dMatch[1]) < 7 ? "week" : "earlier";
  return "earlier";
}

const bucketLabels: Record<Bucket, string> = {
  today: "Today",
  week: "This Week",
  earlier: "Earlier",
};

function groupByBucket<T extends { time: string }>(items: T[]): [Bucket, T[]][] {
  const order: Bucket[] = ["today", "week", "earlier"];
  const map = new Map<Bucket, T[]>();
  for (const it of items) {
    const b = bucketOf(it.time);
    if (!map.has(b)) map.set(b, []);
    map.get(b)!.push(it);
  }
  return order.filter((b) => map.has(b)).map((b) => [b, map.get(b)!]);
}

const tabTriggerClass =
  "h-10 text-base group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:h-[2px] data-[state=active]:text-primary data-[state=active]:hover:text-primary data-[state=active]:after:bg-primary";

function avatarUrl(seed: string) {
  return `https://i.pravatar.cc/96?u=${encodeURIComponent(seed)}`;
}

function NotificationsPopover() {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [animIn, setAnimIn] = useState(false);
  const [closing, setClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const systemListRef = useRef<HTMLUListElement>(null);
  const invitesListRef = useRef<HTMLUListElement>(null);
  const originElRef = useRef<HTMLElement | null>(null);
  const skipAutoFocusRef = useRef(false);
  const [activeTab, setActiveTab] = useState<"system" | "invites">("system");

  const unreadSystem = systemNotifs.filter((n) => n.unread).length;
  const unreadInvites = invites.filter((i) => i.unread).length;
  const totalUnread = unreadSystem + unreadInvites;

  const systemGroups = groupByBucket(systemNotifs);
  const inviteGroups = groupByBucket(invites);

  const openDetailFromEl = (item: Detail, el: HTMLElement) => {
    if (!containerRef.current) return;
    const parent = containerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    originElRef.current = el;
    setOrigin({
      top: rect.top - parent.top,
      left: rect.left - parent.left,
      width: rect.width,
      height: rect.height,
    });
    setDetail(item);
    setClosing(false);
    setAnimIn(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimIn(true));
    });
  };

  const closeDetail = () => {
    setClosing(true);
    skipAutoFocusRef.current = true;
    const originEl = originElRef.current;
    window.setTimeout(() => {
      setDetail(null);
      setOrigin(null);
      setClosing(false);
      setAnimIn(false);
      originEl?.focus({ preventScroll: true });
      originElRef.current = null;
    }, 280);
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setDetail(null);
      setOrigin(null);
      setAnimIn(false);
      setClosing(false);
    }
  };

  const focusListItem = (
    listRef: React.RefObject<HTMLUListElement | null>,
    index: number,
  ) => {
    const items = listRef.current?.querySelectorAll<HTMLLIElement>(
      "li[data-notif-item]",
    );
    if (!items || items.length === 0) return;
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    items[clamped]?.focus();
  };

  const onListKeyDown = (
    listRef: React.RefObject<HTMLUListElement | null>,
  ) => (e: React.KeyboardEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLLIElement>("li[data-notif-item]") ??
        [],
    );
    const currentIndex = items.indexOf(target as HTMLLIElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusListItem(listRef, currentIndex < 0 ? 0 : currentIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusListItem(listRef, currentIndex < 0 ? 0 : currentIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusListItem(listRef, 0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusListItem(listRef, items.length - 1);
    }
  };

  useEffect(() => {
    if (detail) return;
    if (skipAutoFocusRef.current) {
      skipAutoFocusRef.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      const ref = activeTab === "system" ? systemListRef : invitesListRef;
      focusListItem(ref, 0);
    }, 20);
    return () => window.clearTimeout(t);
  }, [activeTab, detail]);

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <IconButton icon={Mail01Icon} label="Notifications" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={13}
        className="w-[440px] overflow-hidden p-0"
        onEscapeKeyDown={(e: KeyboardEvent) => {
          if (detail) {
            e.preventDefault();
            closeDetail();
          }
        }}
        onOpenAutoFocus={(e: Event) => {
          e.preventDefault();
          window.setTimeout(() => {
            const ref = activeTab === "system" ? systemListRef : invitesListRef;
            focusListItem(ref, 0);
          }, 20);
        }}
      >
        <div
          ref={containerRef}
          className="relative"
          style={{ height: POPOVER_HEIGHT }}
        >
          <div className="absolute inset-0 flex flex-col">
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-base leading-none font-semibold tracking-tight text-foreground">
                  Notifications
                </h2>
                <p className="text-sm leading-none text-muted-foreground">
                  {totalUnread > 0
                    ? `${totalUnread} unread ${totalUnread === 1 ? "message" : "messages"}`
                    : "You're all caught up"}
                </p>
              </div>
              {totalUnread > 0 && (
                <Badge
                  variant="secondary"
                  className="h-6 rounded-full px-2.5 text-sm font-medium"
                >
                  {totalUnread}
                </Badge>
              )}
            </div>
            <Tabs
              value={activeTab}
              onValueChange={(v: string) => setActiveTab(v as "system" | "invites")}
              className="flex flex-1 flex-col gap-0 overflow-hidden"
            >
              <TabsList
                variant="line"
                className="h-10 w-full shrink-0 rounded-none p-0"
              >
                <TabsTrigger value="system" className={tabTriggerClass}>
                  System
                </TabsTrigger>
                <TabsTrigger value="invites" className={tabTriggerClass}>
                  Invites
                </TabsTrigger>
              </TabsList>
              <div className="mt-1.5 h-px shrink-0 bg-border" />
              <TabsContent
                value="system"
                className="mt-0 flex-1 overflow-hidden"
              >
                <ScrollArea className="no-scrollbar h-full">
                  <ul
                    ref={systemListRef}
                    onKeyDown={onListKeyDown(systemListRef)}
                    className="outline-none"
                  >
                    {systemGroups.map(([bucket, items]) => (
                      <li key={bucket} className="list-none">
                        <div className="sticky top-0 z-[1] border-b border-border bg-popover/95 px-5 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase backdrop-blur-sm">
                          {bucketLabels[bucket]}
                        </div>
                        <ul className="divide-y divide-border/50">
                          {items.map((n) => (
                            <li
                              key={n.id}
                              data-notif-item
                              tabIndex={0}
                              onClick={(e) =>
                                openDetailFromEl(
                                  { type: "system", item: n },
                                  e.currentTarget,
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  openDetailFromEl(
                                    { type: "system", item: n },
                                    e.currentTarget,
                                  );
                                }
                              }}
                              className="relative flex cursor-pointer items-start gap-3 px-5 py-3.5 outline-none transition-colors hover:bg-accent/50 focus:bg-accent/50"
                            >
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <HugeiconsIcon
                                  icon={n.icon}
                                  strokeWidth={2}
                                  className="size-[18px]"
                                />
                              </div>
                              <div className="min-w-0 flex-1 pr-3">
                                <div className="font-semibold text-foreground">
                                  {truncate(n.title, 40)}
                                </div>
                                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground break-words">
                                  {truncate(n.desc, 90)}
                                </p>
                                <div className="mt-1.5 text-sm text-muted-foreground/70">
                                  {n.time}
                                </div>
                              </div>
                              {n.unread && (
                                <span className="absolute top-5 right-5 size-2 rounded-full bg-primary" />
                              )}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </TabsContent>
              <TabsContent
                value="invites"
                className="mt-0 flex-1 overflow-hidden"
              >
                <ScrollArea className="no-scrollbar h-full">
                  <ul
                    ref={invitesListRef}
                    onKeyDown={onListKeyDown(invitesListRef)}
                    className="outline-none"
                  >
                    {inviteGroups.map(([bucket, items]) => (
                      <li key={bucket} className="list-none">
                        <div className="sticky top-0 z-[1] border-b border-border bg-popover/95 px-5 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase backdrop-blur-sm">
                          {bucketLabels[bucket]}
                        </div>
                        <ul className="divide-y divide-border/50">
                          {items.map((i) => (
                            <li
                              key={i.id}
                              data-notif-item
                              tabIndex={0}
                              onClick={(e) =>
                                openDetailFromEl(
                                  { type: "invite", item: i },
                                  e.currentTarget,
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  openDetailFromEl(
                                    { type: "invite", item: i },
                                    e.currentTarget,
                                  );
                                }
                              }}
                              className="relative flex cursor-pointer items-start gap-3 px-5 py-3.5 outline-none transition-colors hover:bg-accent/50 focus:bg-accent/50"
                            >
                              <Avatar className="size-10 shrink-0">
                                <AvatarImage
                                  src={avatarUrl(i.name)}
                                  alt=""
                                />
                                <AvatarFallback className="bg-muted font-medium">
                                  {initials(i.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1 pr-3">
                                <p className="leading-relaxed break-words">
                                  <span className="font-medium text-foreground">
                                    {i.name}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {" "}
                                    {i.action}{" "}
                                  </span>
                                  <span className="font-medium text-foreground">
                                    {truncate(i.project, 32)}
                                  </span>
                                </p>
                                <div className="mt-1.5 text-sm text-muted-foreground/70">
                                  {i.time}
                                </div>
                              </div>
                              {i.unread && (
                                <span className="absolute top-5 right-5 size-2 rounded-full bg-primary" />
                              )}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {detail && origin && (() => {
            const fullW = containerRef.current?.clientWidth ?? 440;
            const fullH = POPOVER_HEIGHT;
            const isFull = animIn && !closing;
            return (
              <div
                className="absolute z-10 overflow-hidden bg-popover ease-[cubic-bezier(0.32,0.72,0,1)] will-change-[top,left,width,height] transition-[top,left,width,height]"
                style={{
                  top: isFull ? 0 : origin.top,
                  left: isFull ? 0 : origin.left,
                  width: isFull ? fullW : origin.width,
                  height: isFull ? fullH : origin.height,
                  transitionDuration: closing ? "280ms" : `${MORPH_MS}ms`,
                }}
              >
                <div
                  className={`absolute top-0 left-0 transition-opacity ease-out ${isFull ? "opacity-100 delay-150 duration-200" : "opacity-0 duration-120"}`}
                  style={{ width: fullW, height: fullH }}
                >
                  <NotificationDetail detail={detail} onBack={closeDetail} />
                </div>
              </div>
            );
          })()}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationDetail({
  detail,
  onBack,
}: {
  detail: Detail;
  onBack: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b px-3 py-2.5">
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-8 items-center gap-1.5 rounded-full px-3 font-medium text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2.25}
            className="size-4"
          />
          Back
        </button>
      </div>
      <ScrollArea className="no-scrollbar min-h-0 flex-1">
        <div className="flex flex-col gap-4 px-5 py-5">
          {detail.type === "system" ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <HugeiconsIcon
                    icon={detail.item.icon}
                    strokeWidth={2}
                    className="size-5"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground">
                    {detail.item.title}
                  </div>
                  <div className="text-muted-foreground/70">
                    {detail.item.time}
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-foreground/90">
                {detail.item.desc}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="size-12 shrink-0">
                  <AvatarImage src={avatarUrl(detail.item.name)} alt="" />
                  <AvatarFallback className="bg-muted font-medium">
                    {initials(detail.item.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground">
                    {detail.item.name}
                  </div>
                  <div className="text-muted-foreground/70">
                    {detail.item.time}
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-foreground/90">
                <span className="text-muted-foreground">
                  {detail.item.action}{" "}
                </span>
                <span className="font-semibold">{detail.item.project}</span>
              </p>
            </>
          )}
        </div>
      </ScrollArea>
      {detail.type === "invite" && (
        <div className="flex shrink-0 gap-2 border-t bg-popover px-5 py-3">
          <button className="flex h-10 flex-1 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90">
            Accept
          </button>
          <button className="flex h-10 flex-1 items-center justify-center rounded-full border border-border font-medium text-foreground outline-none transition-colors hover:bg-accent">
            Decline
          </button>
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton icon={UserIcon} label="Account" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={20}
        alignOffset={-7}
        className="min-w-64"
      >
        <div className="-my-1 flex items-center gap-3 px-4 py-2">
          <HugeiconsIcon
            icon={ColorsIcon}
            strokeWidth={2.25}
            className="size-4 text-muted-foreground"
          />
          <span className="flex-1">Theme</span>
          <ThemeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon
            icon={PlusSignCircleIcon}
            strokeWidth={2.25}
            className="size-4 text-muted-foreground"
          />
          <span className="flex-1">Add Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <HugeiconsIcon
            icon={Logout01Icon}
            strokeWidth={2.25}
            className="size-4"
          />
          <span className="flex-1">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: "system", icon: ComputerIcon },
    { value: "light", icon: Sun01Icon },
    { value: "dark", icon: Moon01Icon },
  ] as const;
  return (
    <div className="flex items-center gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={(e) => {
            e.stopPropagation();
            setTheme(opt.value);
          }}
          className={`flex size-7 items-center justify-center rounded-full transition-colors ${theme === opt.value ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"}`}
          aria-label={`Theme: ${opt.value}`}
          aria-pressed={theme === opt.value}
        >
          <HugeiconsIcon
            icon={opt.icon}
            strokeWidth={2.25}
            className="size-4"
          />
        </button>
      ))}
    </div>
  );
}
