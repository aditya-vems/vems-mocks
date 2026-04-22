export type Simulation = {
  id: string;
  name: string;
};

export const initialSimulations: Simulation[] = [
  { id: "sim-rooftop-solar", name: "Rooftop Solar" },
  { id: "sim-campus-microgrid", name: "Campus Microgrid" },
  { id: "sim-battery-backup", name: "Battery Backup" },
  { id: "sim-fleet-charging", name: "Fleet Charging" },
  { id: "sim-peak-shaving", name: "Peak Shaving" },
  { id: "sim-demand-response", name: "Demand Response" },
  { id: "sim-wind-farm", name: "Wind Farm Dispatch" },
  { id: "sim-ev-depot", name: "EV Depot Scheduling" },
  { id: "sim-cold-chain", name: "Cold Chain Resilience" },
  { id: "sim-data-center", name: "Data Center Cooling" },
  { id: "sim-residential-vpp", name: "Residential VPP" },
  { id: "sim-hydrogen", name: "Hydrogen Electrolyzer" },
];
