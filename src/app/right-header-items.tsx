import { useRef, useState } from "react";
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
    title: "Simulation run completed",
    desc: "Traffic Sim #42 finished in 3m 12s across 120 scenarios, with all assertions passing on the production branch.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "s2",
    icon: PresentationBarChart01Icon,
    title: "Analysis ready",
    desc: "Results for Lane Merge scenario are available to review. Coverage increased by 4.2% over last run.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "s3",
    icon: PlayCircleIcon,
    title: "Scheduled run started",
    desc: "Weekly validation suite is underway across 18 scenarios. Estimated completion time is 42 minutes.",
    time: "4h ago",
  },
  {
    id: "s4",
    icon: Database02Icon,
    title: "Dataset updated",
    desc: "Highway corpus v2.3 has been published to your workspace. 312 new clips were added from the March drives.",
    time: "Yesterday",
  },
  {
    id: "s5",
    icon: CheckmarkCircle02Icon,
    title: "Export complete",
    desc: "Run summary.csv is ready to download. The export contains 2,841 rows covering all runs from April.",
    time: "2d ago",
  },
  {
    id: "s6",
    icon: PresentationBarChart01Icon,
    title: "Weekly report generated",
    desc: "Fleet coverage metrics for week 16 are available. Urban scenarios led with 94% scenario pass rate.",
    time: "3d ago",
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
];

const POPOVER_HEIGHT = 430;

function NotificationsPopover() {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [animIn, setAnimIn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const unreadSystem = systemNotifs.filter((n) => n.unread).length;
  const unreadInvites = invites.filter((i) => i.unread).length;
  const totalUnread = unreadSystem + unreadInvites;
  const triggerClass =
    "h-12 text-base group-data-horizontal/tabs:after:bottom-[-1px] group-data-horizontal/tabs:after:h-[2px] data-[state=active]:text-primary data-[state=active]:hover:text-primary data-[state=active]:after:bg-primary";

  const openDetail = (
    item: Detail,
    e: React.MouseEvent<HTMLLIElement>,
  ) => {
    if (!containerRef.current) return;
    const parent = containerRef.current.getBoundingClientRect();
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      top: rect.top - parent.top,
      left: rect.left - parent.left,
      width: rect.width,
      height: rect.height,
    });
    setDetail(item);
    setAnimIn(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimIn(true));
    });
  };

  const closeDetail = () => {
    setAnimIn(false);
    window.setTimeout(() => {
      setDetail(null);
      setOrigin(null);
    }, 300);
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setDetail(null);
      setOrigin(null);
      setAnimIn(false);
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <IconButton icon={Mail01Icon} label="Notifications" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={13}
        className="w-[420px] overflow-hidden p-0"
        onEscapeKeyDown={(e: KeyboardEvent) => {
          if (detail) {
            e.preventDefault();
            closeDetail();
          }
        }}
      >
        <div
          ref={containerRef}
          className="relative"
          style={{ height: POPOVER_HEIGHT }}
        >
          <div className="absolute inset-0 flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <div className="text-base font-semibold">Notifications</div>
              {totalUnread > 0 && <Badge>{totalUnread} Unread</Badge>}
            </div>
            <Tabs defaultValue="system" className="flex flex-1 flex-col gap-0">
              <TabsList
                variant="line"
                className="h-12 w-full shrink-0 rounded-none border-b p-0"
              >
                <TabsTrigger value="system" className={triggerClass}>
                  System
                </TabsTrigger>
                <TabsTrigger value="invites" className={triggerClass}>
                  Invites
                </TabsTrigger>
              </TabsList>
              <TabsContent value="system" className="mt-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <ul className="divide-y divide-border/50">
                    {systemNotifs.map((n) => (
                      <li
                        key={n.id}
                        onClick={(e) =>
                          openDetail({ type: "system", item: n }, e)
                        }
                        className="relative flex cursor-pointer items-start gap-3 px-5 py-3.5 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <HugeiconsIcon
                            icon={n.icon}
                            strokeWidth={2}
                            className="size-[18px]"
                          />
                        </div>
                        <div className="min-w-0 flex-1 pr-3">
                          <div className="text-sm font-semibold text-foreground">
                            {truncate(n.title, 40)}
                          </div>
                          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground break-words">
                            {truncate(n.desc, 90)}
                          </p>
                          <div className="mt-1.5 text-xs text-muted-foreground/70">
                            {n.time}
                          </div>
                        </div>
                        {n.unread && (
                          <span className="absolute top-5 right-5 size-2 rounded-full bg-primary" />
                        )}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="invites" className="mt-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <ul className="divide-y divide-border/50">
                    {invites.map((i) => (
                      <li
                        key={i.id}
                        onClick={(e) =>
                          openDetail({ type: "invite", item: i }, e)
                        }
                        className="relative flex cursor-pointer items-start gap-3 px-5 py-3.5 transition-colors hover:bg-accent/50"
                      >
                        <Avatar className="size-10 shrink-0">
                          <AvatarFallback className="bg-muted text-xs font-semibold">
                            {initials(i.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="text-sm leading-relaxed break-words">
                            <span className="font-semibold">{i.name}</span>
                            <span className="text-muted-foreground">
                              {" "}
                              {i.action}{" "}
                            </span>
                            <span className="font-semibold">
                              {truncate(i.project, 32)}
                            </span>
                          </p>
                          <div className="mt-1.5 text-xs text-muted-foreground/70">
                            {i.time}
                          </div>
                        </div>
                        {i.unread && (
                          <span className="absolute top-5 right-5 size-2 rounded-full bg-primary" />
                        )}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {detail && origin && (
            <div
              className="absolute z-10 overflow-hidden bg-popover shadow-lg ring-1 ring-foreground/5 transition-all duration-300 ease-out"
              style={
                animIn
                  ? { top: 0, left: 0, width: "100%", height: "100%" }
                  : {
                      top: origin.top,
                      left: origin.left,
                      width: origin.width,
                      height: origin.height,
                    }
              }
            >
              <div
                className={`h-full transition-opacity duration-200 ${animIn ? "opacity-100 delay-150" : "opacity-0"}`}
              >
                <NotificationDetail detail={detail} onBack={closeDetail} />
              </div>
            </div>
          )}
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
      <div className="flex items-center gap-2 border-b px-3 py-2.5">
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2.25}
            className="size-4"
          />
          Back
        </button>
      </div>
      <ScrollArea className="flex-1">
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
                  <div className="text-base font-semibold text-foreground">
                    {detail.item.title}
                  </div>
                  <div className="text-xs text-muted-foreground/70">
                    {detail.item.time}
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                {detail.item.desc}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="size-12 shrink-0">
                  <AvatarFallback className="bg-muted text-sm font-semibold">
                    {initials(detail.item.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold text-foreground">
                    {detail.item.name}
                  </div>
                  <div className="text-xs text-muted-foreground/70">
                    {detail.item.time}
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                <span className="text-muted-foreground">
                  {detail.item.action}{" "}
                </span>
                <span className="font-semibold">{detail.item.project}</span>
              </p>
              <div className="flex gap-2">
                <button className="flex h-9 flex-1 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90">
                  Accept
                </button>
                <button className="flex h-9 flex-1 items-center justify-center rounded-md border border-border text-sm font-medium text-foreground outline-none transition-colors hover:bg-accent">
                  Decline
                </button>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
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
