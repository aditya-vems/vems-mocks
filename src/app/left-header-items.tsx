import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
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
      <LogoLine height={20} />
      <Separator orientation="vertical" className="h-8 bg-foreground/20" />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
          <span>{selected?.name ?? "No Simulation"}</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            strokeWidth={2.5}
            className={`text-foreground/50 transition-transform duration-300 ${open && "rotate-180"}`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          sideOffset={17}
          className="min-w-52 overflow-hidden p-0"
        >
          <div className="max-h-64 overflow-y-auto py-2">
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
                    onPointerDown={(e: React.PointerEvent) =>
                      e.stopPropagation()
                    }
                  >
                    <EllipsisVerticalIcon className="size-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    side="right"
                    className="min-w-40"
                  >
                    <DropdownMenuItem onSelect={() => rename(sim.id)}>
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => remove(sim.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator className="my-0" />
          <div className="py-2">
            <DropdownMenuItem
              onSelect={create}
              className="focus:bg-primary/10 focus:text-foreground"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-primary">
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  strokeWidth={2.5}
                  style={{ color: "white" }}
                />
              </span>
              New Simulation
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}