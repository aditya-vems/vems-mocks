export type GraphKind = "line" | "bar" | "area";

export type GraphSeries = {
  id: string;
  title: string;
  subtitle?: string;
  xKey: string;
  yKey: string;
  data: Array<Record<string, string | number>>;
};

export const graphs: Record<string, GraphSeries> = {
  "energy-24h": {
    id: "energy-24h",
    title: "Energy output (24h)",
    subtitle: "kWh, 5-minute intervals",
    xKey: "hour",
    yKey: "kwh",
    data: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      kwh: Math.round((Math.sin((i / 24) * Math.PI * 2) * 4 + 5 + Math.random() * 0.8) * 10) / 10,
    })),
  },
  "load-profile": {
    id: "load-profile",
    title: "Load profile",
    subtitle: "Average weekday, kW",
    xKey: "hour",
    yKey: "kw",
    data: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      kw:
        Math.round(
          (1.8 + (i > 6 && i < 10 ? 3 : 0) + (i > 17 && i < 22 ? 4 : 0) + Math.random() * 0.6) * 10,
        ) / 10,
    })),
  },
  "generation-mix": {
    id: "generation-mix",
    title: "Generation mix",
    subtitle: "Last 7 days",
    xKey: "day",
    yKey: "kwh",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
      day: d,
      kwh: Math.round((20 + Math.random() * 15) * 10) / 10,
    })),
  },
  "battery-state": {
    id: "battery-state",
    title: "Battery state of charge",
    subtitle: "Last 24h, %",
    xKey: "hour",
    yKey: "soc",
    data: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      soc: Math.max(10, Math.min(100, 55 + Math.sin((i / 24) * Math.PI * 2) * 35)),
    })),
  },
  "grid-balance": {
    id: "grid-balance",
    title: "Grid import/export",
    subtitle: "kWh per day",
    xKey: "day",
    yKey: "net",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
      day: d,
      net: Math.round((Math.random() * 12 - 4) * 10) / 10,
    })),
  },
};

export const graphIds = Object.keys(graphs);
