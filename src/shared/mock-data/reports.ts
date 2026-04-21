import type { JSONContent } from "@tiptap/react";

export type MockReport = {
  id: string;
  title: string;
  updatedAt: string;
  content: JSONContent;
};

const h = (level: 1 | 2 | 3, text: string): JSONContent => ({
  type: "heading",
  attrs: { level },
  content: [{ type: "text", text }],
});

const p = (text: string): JSONContent => ({
  type: "paragraph",
  content: text ? [{ type: "text", text }] : undefined,
});

const graph = (graphId: string, title: string, kind: "line" | "bar" | "area"): JSONContent => ({
  type: "graph",
  attrs: { graphId, title, kind },
});

const callout = (tone: "info" | "warning" | "success", text: string): JSONContent => ({
  type: "callout",
  attrs: { tone },
  content: [{ type: "text", text }],
});

export const reports: MockReport[] = [
  {
    id: "r-1",
    title: "Weekly energy report",
    updatedAt: "2 minutes ago",
    content: {
      type: "doc",
      content: [
        h(1, "Weekly energy report"),
        p("This report summarizes the household's energy performance over the past seven days."),
        h(2, "Generation"),
        graph("generation-mix", "Generation mix (7d)", "bar"),
        p("Solar generation stayed above the weekly target for five of seven days."),
        h(2, "Consumption"),
        graph("load-profile", "Load profile", "line"),
        callout("info", "Peak load consistently landed in the 18:00–21:00 window."),
        h(2, "Grid interaction"),
        graph("grid-balance", "Grid import/export", "bar"),
      ],
    },
  },
  {
    id: "r-2",
    title: "Battery health check",
    updatedAt: "Yesterday",
    content: {
      type: "doc",
      content: [
        h(1, "Battery health check"),
        p("State-of-charge profile and observed cycling for the home battery."),
        graph("battery-state", "State of charge (24h)", "area"),
        callout("warning", "Depth of discharge exceeded recommended range on two cycles."),
      ],
    },
  },
  {
    id: "r-3",
    title: "24-hour operations review",
    updatedAt: "3 days ago",
    content: {
      type: "doc",
      content: [
        h(1, "24-hour operations review"),
        graph("energy-24h", "Energy output", "line"),
        p("Overall system performance was nominal."),
        callout("success", "No alarms were raised in the observation window."),
      ],
    },
  },
];
