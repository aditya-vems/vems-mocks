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
  ArrowRight01Icon,
  ColorsIcon,
  CheckmarkCircle02Icon,
  PresentationBarChart01Icon,
  PlayCircleIcon,
  Database02Icon,
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
      className="flex size-8 items-center justify-center rounded-md outline-none transition-colors text-muted-foreground hover:text-foreground data-[state=open]:text-foreground"
      {...props}
    >
      <HugeiconsIcon
        icon={icon}
        strokeWidth={2.5}
        className="size-[18px] text-current"
      />
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

const systemNotifs: SystemNotif[] = [
  {
    id: "s1",
    icon: CheckmarkCircle02Icon,
    title: "Simulation run completed",
    desc: "Traffic Sim #42 finished in 3m 12s",
    time: "2m ago",
    unread: true,
  },
  {
    id: "s2",
    icon: PresentationBarChart01Icon,
    title: "Analysis ready",
    desc: "Results for Lane Merge scenario are available to review.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "s3",
    icon: PlayCircleIcon,
    title: "Scheduled run started",
    desc: "Weekly validation suite is underway across 18 scenarios.",
    time: "4h ago",
  },
  {
    id: "s4",
    icon: Database02Icon,
    title: "Dataset updated",
    desc: "Highway corpus v2.3 has been published to your workspace.",
    time: "Yesterday",
  },
  {
    id: "s5",
    icon: CheckmarkCircle02Icon,
    title: "Export complete",
    desc: "Run summary.csv is ready to download.",
    time: "2d ago",
  },
  {
    id: "s6",
    icon: PresentationBarChart01Icon,
    title: "Weekly report generated",
    desc: "Fleet coverage metrics for week 16 are available.",
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

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function NotificationsPopover() {
  const unreadSystem = systemNotifs.filter((n) => n.unread).length;
  const unreadInvites = invites.filter((i) => i.unread).length;
  const totalUnread = unreadSystem + unreadInvites;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton icon={Mail01Icon} label="Notifications" />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={13} className="w-96 p-0">
        <div className="flex items-center justify-between px-4 pt-3 pb-3">
          <div className="font-medium">Notifications</div>
          {totalUnread > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              {totalUnread} unread
            </Badge>
          )}
        </div>
        <Tabs defaultValue="system" className="gap-0">
          <TabsList variant="line" className="w-full px-4">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="invites">Invites</TabsTrigger>
          </TabsList>
          <div className="-mt-px border-t" />
          <TabsContent value="system" className="mt-0">
            <ScrollArea className="h-96">
              <ul>
                {systemNotifs.map((n) => (
                  <li
                    key={n.id}
                    className="flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/60"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <HugeiconsIcon
                        icon={n.icon}
                        strokeWidth={2}
                        className="size-4"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-medium">
                          {n.title}
                        </div>
                        {n.unread && (
                          <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {n.desc}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground/80">
                        {n.time}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="invites" className="mt-0">
            <ScrollArea className="h-96">
              <ul>
                {invites.map((i) => (
                  <li
                    key={i.id}
                    className="flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/60"
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="bg-muted text-xs font-medium">
                        {initials(i.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm">
                          <span className="font-medium">{i.name}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            {i.action}{" "}
                          </span>
                          <span className="font-medium">{i.project}</span>
                        </div>
                        {i.unread && (
                          <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground/80">
                        {i.time}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
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
        <DropdownMenuItem
          className="gap-3 hover:bg-transparent!"
          onSelect={(e: Event) => e.preventDefault()}
        >
          <HugeiconsIcon
            icon={ColorsIcon}
            className="size-4 text-muted-foreground"
          />
          <span className="flex-1">Theme</span>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon
            icon={PlusSignCircleIcon}
            className="size-4 text-muted-foreground"
          />
          <span className="flex-1">Add Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <HugeiconsIcon icon={Logout01Icon} className="size-4" />
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
          className={`flex size-7 items-center justify-center rounded-full transition-colors ${theme === opt.value ? "bg-foreground/10 !text-foreground" : "!text-muted-foreground"}`}
          aria-label={`Theme: ${opt.value}`}
          aria-pressed={theme === opt.value}
        >
          <HugeiconsIcon icon={opt.icon} className="size-4" />
        </button>
      ))}
    </div>
  );
}
