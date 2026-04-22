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
  Logout03Icon,
  ArrowRight01Icon,
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
      className="flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground data-[state=open]:text-foreground"
      {...props}
    >
      <HugeiconsIcon icon={icon} size={18} strokeWidth={2.5} />
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

function NotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton icon={Mail01Icon} label="Notifications" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3 text-[15px] font-medium">
          Notifications
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          No new notifications
        </div>
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
      <DropdownMenuContent align="end" className="min-w-64">
        <DropdownMenuItem>
          <HugeiconsIcon icon={UserIcon} size={16} />
          <span className="flex-1">Profile</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={14}
            className="text-muted-foreground"
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-3"
          onSelect={(e: Event) => e.preventDefault()}
        >
          <HugeiconsIcon icon={Moon01Icon} size={16} />
          <span className="flex-1">Theme</span>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
          <span className="flex-1">Add Account</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={14}
            className="text-muted-foreground"
          />
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <HugeiconsIcon icon={Logout03Icon} size={16} />
          <span className="flex-1">Sign Out</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
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
          className={`flex size-6 items-center justify-center rounded-full transition-colors ${theme === opt.value ? "bg-foreground/10 !text-foreground" : "!text-muted-foreground"}`}
          aria-label={`Theme: ${opt.value}`}
          aria-pressed={theme === opt.value}
        >
          <HugeiconsIcon icon={opt.icon} size={14} />
        </button>
      ))}
    </div>
  );
}
