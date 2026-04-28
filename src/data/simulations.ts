export type SimulationStatus = "active" | "draft" | "archived";

export type Report = {
  id: string;
  name: string;
};

export type Simulation = {
  id: string;
  name: string;
  status: SimulationStatus;
  reports: Report[];
  comparisons: number;
  owner: string;
  updated: string;
};

export const initialSimulations: Simulation[] = [
  {
    id: "sim-rooftop-solar",
    name: "Rooftop Solar",
    status: "active",
    reports: [
      { id: "r-rs-1", name: "Daily Generation Curve" },
      { id: "r-rs-2", name: "Monthly Yield Summary" },
      { id: "r-rs-3", name: "Inverter Health" },
      { id: "r-rs-4", name: "Shading Loss Analysis" },
    ],
    comparisons: 2,
    owner: "Aditya Sharma",
    updated: "2d ago",
  },
  {
    id: "sim-campus-microgrid",
    name: "Campus Microgrid",
    status: "active",
    reports: [
      { id: "r-cm-1", name: "Hourly Load Profile" },
      { id: "r-cm-2", name: "Outage Simulation" },
      { id: "r-cm-3", name: "Cost Forecast" },
    ],
    comparisons: 1,
    owner: "Jaya Krishnan",
    updated: "1w ago",
  },
  {
    id: "sim-battery-backup",
    name: "Battery Backup",
    status: "draft",
    reports: [
      { id: "r-bb-1", name: "State of Charge" },
      { id: "r-bb-2", name: "Cycle Lifespan" },
    ],
    comparisons: 0,
    owner: "Mira Reyes",
    updated: "Apr 02",
  },
  {
    id: "sim-fleet-charging",
    name: "Fleet Charging",
    status: "active",
    reports: [
      { id: "r-fc-1", name: "Vehicle Schedule" },
      { id: "r-fc-2", name: "Peak Demand Trace" },
      { id: "r-fc-3", name: "Grid Impact" },
      { id: "r-fc-4", name: "Idle Time Heatmap" },
      { id: "r-fc-5", name: "Charger Utilization" },
    ],
    comparisons: 3,
    owner: "Noah Lim",
    updated: "3d ago",
  },
  {
    id: "sim-peak-shaving",
    name: "Peak Shaving",
    status: "active",
    reports: [
      { id: "r-ps-1", name: "Load Duration Curve" },
      { id: "r-ps-2", name: "Savings Estimate" },
    ],
    comparisons: 0,
    owner: "Aditya Sharma",
    updated: "1w ago",
  },
  {
    id: "sim-demand-response",
    name: "Demand Response",
    status: "draft",
    reports: [{ id: "r-dr-1", name: "Event Response Trace" }],
    comparisons: 0,
    owner: "Jaya Krishnan",
    updated: "2w ago",
  },
  {
    id: "sim-wind-farm",
    name: "Wind Farm Dispatch",
    status: "active",
    reports: [
      { id: "r-wf-1", name: "Power Curve Fit" },
      { id: "r-wf-2", name: "Wake Effect" },
      { id: "r-wf-3", name: "Curtailment Analysis" },
      { id: "r-wf-4", name: "Forecast Error" },
      { id: "r-wf-5", name: "Maintenance Plan" },
      { id: "r-wf-6", name: "Yield Map" },
    ],
    comparisons: 4,
    owner: "Mira Reyes",
    updated: "4d ago",
  },
  {
    id: "sim-ev-depot",
    name: "EV Depot Scheduling",
    status: "active",
    reports: [
      { id: "r-ev-1", name: "Vehicle Trip Plan" },
      { id: "r-ev-2", name: "Charger Utilization" },
      { id: "r-ev-3", name: "Energy Cost" },
    ],
    comparisons: 1,
    owner: "Noah Lim",
    updated: "Apr 08",
  },
  {
    id: "sim-cold-chain",
    name: "Cold Chain Resilience",
    status: "archived",
    reports: [
      { id: "r-cc-1", name: "Temperature Hold" },
      { id: "r-cc-2", name: "Backup Runtime" },
    ],
    comparisons: 0,
    owner: "Aditya Sharma",
    updated: "Apr 11",
  },
  {
    id: "sim-data-center",
    name: "Data Center Cooling",
    status: "active",
    reports: [
      { id: "r-dc-1", name: "Cooling Load" },
      { id: "r-dc-2", name: "PUE Trend" },
      { id: "r-dc-3", name: "Free Cooling Hours" },
      { id: "r-dc-4", name: "Hotspot Map" },
    ],
    comparisons: 2,
    owner: "Jaya Krishnan",
    updated: "Yesterday",
  },
  {
    id: "sim-residential-vpp",
    name: "Residential VPP",
    status: "draft",
    reports: [{ id: "r-vp-1", name: "Aggregator Performance" }],
    comparisons: 0,
    owner: "Mira Reyes",
    updated: "2w ago",
  },
  {
    id: "sim-hydrogen",
    name: "Hydrogen Electrolyzer",
    status: "active",
    reports: [
      { id: "r-h2-1", name: "Production Rate" },
      { id: "r-h2-2", name: "Efficiency Curve" },
      { id: "r-h2-3", name: "Hydrogen Storage" },
    ],
    comparisons: 1,
    owner: "Noah Lim",
    updated: "3d ago",
  },
];
