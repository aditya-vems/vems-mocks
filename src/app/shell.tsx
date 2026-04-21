import { NavLink, Outlet, useMatches } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sun03Icon,
  Moon02Icon,
  ComputerIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Logo,
  LogoMark,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@v-ems/element";
import { routes } from "./router";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const icon = theme === "light" ? Sun03Icon : theme === "dark" ? Moon02Icon : ComputerIcon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Theme: ${theme ?? "system"}`}
          onClick={() => setTheme(next)}
        >
          <HugeiconsIcon icon={icon} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Theme: {theme ?? "system"}</TooltipContent>
    </Tooltip>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account">
          <Avatar className="size-7">
            <AvatarFallback>
              <HugeiconsIcon icon={UserIcon} size={16} />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Demo user</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SideNav() {
  return (
    <nav className="flex h-full w-14 flex-col items-center gap-2 border-r bg-sidebar py-3">
      <div className="mb-2">
        <LogoMark className="size-7" />
      </div>
      <Separator />
      {routes.map((r) => (
        <Tooltip key={r.path}>
          <TooltipTrigger asChild>
            <NavLink
              to={r.path}
              className={({ isActive }) =>
                [
                  "flex size-9 items-center justify-center rounded-md transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                ].join(" ")
              }
              aria-label={r.title}
            >
              <HugeiconsIcon icon={r.icon} size={18} />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">{r.title}</TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );
}

function useCurrentTitle() {
  const matches = useMatches();
  for (let i = matches.length - 1; i >= 0; i--) {
    const title = (matches[i].handle as { title?: string } | undefined)?.title;
    if (title) return title;
  }
  return "";
}

export function Shell() {
  const title = useCurrentTitle();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-dvh w-dvw bg-background text-foreground">
        <SideNav />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-12 items-center gap-3 border-b px-4">
            <Logo className="h-5" />
            <Separator orientation="vertical" className="h-5" />
            <h1 className="text-sm font-medium">{title}</h1>
            <div className="ml-auto flex items-center gap-1">
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>
          <main className="min-h-0 flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
