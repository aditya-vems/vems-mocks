import {
  BatteryFullIcon,
  Sun03Icon,
  Home01Icon,
  CpuIcon,
  FlashIcon,
} from "@hugeicons/core-free-icons";
import type { HugeiconsIconProps } from "@hugeicons/react";

export type UnitType = "battery" | "solar" | "load" | "grid" | "inverter";

export type UnitSpecValue = string | number | boolean;

export type UnitSpec = Record<string, UnitSpecValue>;

export type UnitData = {
  type: UnitType;
  label: string;
  spec: UnitSpec;
};

export type SpecField =
  | { key: string; kind: "text" }
  | { key: string; kind: "number"; unit?: string; min?: number; max?: number }
  | { key: string; kind: "boolean" }
  | { key: string; kind: "select"; options: string[] };

type UnitDefinition = {
  type: UnitType;
  displayName: string;
  icon: HugeiconsIconProps["icon"];
  accent: string;
  defaultSpec: UnitSpec;
  specFields: SpecField[];
};

export const unitCatalog: Record<UnitType, UnitDefinition> = {
  battery: {
    type: "battery",
    displayName: "Battery",
    icon: BatteryFullIcon,
    accent: "text-chart-2",
    defaultSpec: {
      capacityKwh: 13.5,
      chargeState: 50,
      maxPowerKw: 5,
      chemistry: "LFP",
    },
    specFields: [
      { key: "capacityKwh", kind: "number", unit: "kWh", min: 0 },
      { key: "chargeState", kind: "number", unit: "%", min: 0, max: 100 },
      { key: "maxPowerKw", kind: "number", unit: "kW", min: 0 },
      { key: "chemistry", kind: "select", options: ["LFP", "NMC", "LTO"] },
    ],
  },
  solar: {
    type: "solar",
    displayName: "Solar",
    icon: Sun03Icon,
    accent: "text-chart-1",
    defaultSpec: {
      peakKw: 7.6,
      panels: 20,
      tiltDeg: 25,
      tracking: false,
    },
    specFields: [
      { key: "peakKw", kind: "number", unit: "kW", min: 0 },
      { key: "panels", kind: "number", min: 0 },
      { key: "tiltDeg", kind: "number", unit: "°", min: 0, max: 90 },
      { key: "tracking", kind: "boolean" },
    ],
  },
  load: {
    type: "load",
    displayName: "Load",
    icon: Home01Icon,
    accent: "text-chart-3",
    defaultSpec: {
      baselineKw: 2.4,
      peakKw: 6.0,
      critical: false,
    },
    specFields: [
      { key: "baselineKw", kind: "number", unit: "kW", min: 0 },
      { key: "peakKw", kind: "number", unit: "kW", min: 0 },
      { key: "critical", kind: "boolean" },
    ],
  },
  grid: {
    type: "grid",
    displayName: "Grid",
    icon: FlashIcon,
    accent: "text-chart-4",
    defaultSpec: {
      voltage: 240,
      maxImportKw: 15,
      maxExportKw: 10,
      tariff: "TOU",
    },
    specFields: [
      { key: "voltage", kind: "number", unit: "V", min: 0 },
      { key: "maxImportKw", kind: "number", unit: "kW", min: 0 },
      { key: "maxExportKw", kind: "number", unit: "kW", min: 0 },
      { key: "tariff", kind: "select", options: ["Flat", "TOU", "CPP"] },
    ],
  },
  inverter: {
    type: "inverter",
    displayName: "Inverter",
    icon: CpuIcon,
    accent: "text-chart-5",
    defaultSpec: {
      ratedKw: 7.6,
      efficiency: 97,
      bidirectional: true,
    },
    specFields: [
      { key: "ratedKw", kind: "number", unit: "kW", min: 0 },
      { key: "efficiency", kind: "number", unit: "%", min: 0, max: 100 },
      { key: "bidirectional", kind: "boolean" },
    ],
  },
};

export const unitTypes = Object.keys(unitCatalog) as UnitType[];
