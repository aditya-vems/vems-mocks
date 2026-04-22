import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  MoreHorizontalIcon,
  Edit02Icon,
  Delete02Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { LogoLine } from "@v-ems/element/brand";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Separator,
} from "@v-ems/element";
import { initialSimulations, type Simulation } from "@/data/simulations";

export function LeftHeaderItems() {
  const [sims, setSims] = useState<Simulation[]>(initialSimulations);
  const [selectedId, setSelectedId] = useState<string>(
    initialSimulations[0].id,
  );
  const [open, setOpen] = useState(false);
  const selected = sims.find((s) => s.id === selectedId);

  const rename = (id: string) => {
    const current = sims.find((s) => s.id === id);
    const next = window.prompt("Rename simulation", current?.name);
    if (next && next.trim()) {
      setSims((prev) =>
        prev.map((s) => (s.id === id ? { ...s, name: next.trim() } : s)),
      );
    }
  };

  const remove = (id: string) => {
    setSims((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? "");
      return next;
    });
  };

  const create = () => {
    const name = window.prompt("New simulation name");
    if (!name || !name.trim()) return;
    const id = `sim-${Date.now()}`;
    setSims((prev) => [...prev, { id, name: name.trim() }]);
    setSelectedId(id);
  };

  return (
    <div className="flex items-center gap-4">
      <LogoLine height={24} />
      <Separator orientation="vertical" className="h-8 bg-foreground/20" />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="flex items-center text-[15px] gap-2 outline-none">
          <span>{selected?.name ?? "No Simulation"}</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            className={`text-foreground/50 transition-transform duration-300 ${open && "rotate-180"}`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="min-w-64">
          {sims.map((sim) => (
            <DropdownMenuItem
              key={sim.id}
              className="group flex items-center justify-between gap-2"
              onSelect={() => setSelectedId(sim.id)}
            >
              <span>{sim.name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={`Actions for ${sim.name}`}
                  className="rounded opacity-0 outline-none group-hover:opacity-100 focus-visible:opacity-100"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
                >
                  <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right">
                  <DropdownMenuItem onSelect={() => rename(sim.id)}>
                    <HugeiconsIcon icon={Edit02Icon} size={14} />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => remove(sim.id)}>
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={create}>
            <span className="flex size-5 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground transition-colors">
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2.5} />
            </span>
            New Simulation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}