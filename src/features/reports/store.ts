import { create } from "zustand";
import { reports as seedReports, type MockReport } from "@/shared/mock-data/reports";

type ReportsState = {
  reports: MockReport[];
  activeId: string;
  savedAt: string | null;
  setActive: (id: string) => void;
  markSaved: () => void;
};

export const useReportsStore = create<ReportsState>((set) => ({
  reports: seedReports,
  activeId: seedReports[0].id,
  savedAt: null,
  setActive: (id) => set({ activeId: id }),
  markSaved: () =>
    set({
      savedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }),
}));
