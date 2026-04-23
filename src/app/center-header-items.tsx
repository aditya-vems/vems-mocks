import { NavLink } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Atom01Icon,
  PlayCircleIcon,
  PresentationBarChart01Icon,
} from "@hugeicons/core-free-icons";

type TabDef = {
  to: string;
  label: string;
  icon: typeof Atom01Icon;
};

const tabs: TabDef[] = [
  { to: "/run", label: "Chat", icon: PlayCircleIcon },
  { to: "/simulate", label: "Scenario", icon: Atom01Icon },
  { to: "/analyze", label: "Report", icon: PresentationBarChart01Icon },
];

export function CenterHeaderItems() {
  return (
    <nav className="flex items-center justify-center gap-16">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex items-center gap-2 transition-colors ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          <HugeiconsIcon icon={tab.icon} size={18} strokeWidth={2.5} />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
