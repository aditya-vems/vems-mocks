import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { initialSimulations, type Simulation } from "@/data/simulations";

type SimulationContextValue = {
  simulations: Simulation[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  activeReportId: string | null;
  setActiveReportId: (id: string | null) => void;
  addSimulation: (name: string) => string;
  renameSimulation: (id: string, name: string) => void;
  removeSimulation: (id: string) => void;
};

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [simulations, setSimulations] =
    useState<Simulation[]>(initialSimulations);
  const [selectedId, setSelectedId] = useState<string>(
    initialSimulations[0]?.id ?? "",
  );
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  const addSimulation = useCallback((name: string): string => {
    const id = `sim-${Date.now()}`;
    setSimulations((prev) => [
      ...prev,
      {
        id,
        name,
        status: "draft",
        reports: [],
        comparisons: 0,
        owner: "—",
        updated: "Just now",
      },
    ]);
    setSelectedId(id);
    return id;
  }, []);

  const renameSimulation = useCallback((id: string, name: string) => {
    setSimulations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name } : s)),
    );
  }, []);

  const removeSimulation = useCallback(
    (id: string) => {
      setSimulations((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (selectedId === id) setSelectedId(next[0]?.id ?? "");
        return next;
      });
    },
    [selectedId],
  );

  return (
    <SimulationContext.Provider
      value={{
        simulations,
        selectedId,
        setSelectedId,
        activeReportId,
        setActiveReportId,
        addSimulation,
        renameSimulation,
        removeSimulation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulations() {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error("useSimulations must be used inside <SimulationProvider>");
  }
  return ctx;
}
