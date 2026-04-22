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
];
