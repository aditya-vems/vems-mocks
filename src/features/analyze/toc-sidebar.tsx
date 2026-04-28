import { HugeiconsIcon } from "@hugeicons/react";
import { Time04Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage, initials } from "@v-ems/element";

type TocItem = { id: string; label: string };

type ActivityItem = {
  user: string;
  action: string;
  time: string;
};

type TocSidebarProps = {
  sections: TocItem[];
};

export function TocSidebar({ sections }: TocSidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border/60 px-6 py-8 lg:flex">
      <span className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        On this page
      </span>
      <nav className="flex flex-col gap-0.5">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            {s.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

type ActivitySidebarProps = {
  collaborators: string[];
  activity: ActivityItem[];
};

export function ActivitySidebar({
  collaborators,
  activity,
}: ActivitySidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 border-l border-border/60 px-6 py-8 xl:flex">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <HugeiconsIcon
            icon={UserMultiple02Icon}
            strokeWidth={2.25}
            className="size-3.5"
          />
          Collaborators
        </div>
        <div className="flex -space-x-1.5">
          {collaborators.map((name) => (
            <Avatar
              key={name}
              className="size-7 ring-2 ring-card"
              title={name}
            >
              <AvatarImage
                src={`https://i.pravatar.cc/96?u=${encodeURIComponent(name)}`}
                alt=""
              />
              <AvatarFallback className="bg-muted text-[11px] font-medium">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <HugeiconsIcon
            icon={Time04Icon}
            strokeWidth={2.25}
            className="size-3.5"
          />
          Activity
        </div>
        <ol className="flex flex-col gap-3">
          {activity.map((a, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Avatar className="mt-0.5 size-6 shrink-0">
                <AvatarImage
                  src={`https://i.pravatar.cc/96?u=${encodeURIComponent(a.user)}`}
                  alt=""
                />
                <AvatarFallback className="bg-muted text-[10px] font-medium">
                  {initials(a.user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-xs leading-relaxed text-foreground">
                  <span className="font-medium">{a.user}</span>{" "}
                  <span className="text-muted-foreground">{a.action}</span>
                </p>
                <span className="text-[11px] text-muted-foreground/70">
                  {a.time}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
