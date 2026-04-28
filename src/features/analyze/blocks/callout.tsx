import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";

type CalloutKind = "info" | "success" | "warning";

const tone: Record<
  CalloutKind,
  { icon: typeof InformationCircleIcon; color: string; ring: string }
> = {
  info: {
    icon: InformationCircleIcon,
    color: "text-primary",
    ring: "ring-primary/20",
  },
  success: {
    icon: CheckmarkCircle02Icon,
    color: "text-emerald-500",
    ring: "ring-emerald-500/20",
  },
  warning: {
    icon: AlertCircleIcon,
    color: "text-amber-500",
    ring: "ring-amber-500/20",
  },
};

export function Callout({
  kind = "info",
  children,
}: {
  kind?: CalloutKind;
  children: ReactNode;
}) {
  const { icon, color, ring } = tone[kind];
  return (
    <aside
      className={`my-4 flex items-start gap-3 rounded-lg bg-background/40 p-4 ring-1 ${ring}`}
    >
      <HugeiconsIcon
        icon={icon}
        strokeWidth={2}
        className={`mt-0.5 size-4 shrink-0 ${color}`}
      />
      <div className="text-sm leading-relaxed text-foreground">{children}</div>
    </aside>
  );
}
