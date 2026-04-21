import { createBrowserRouter, Navigate } from "react-router-dom";
import { Shell } from "./shell";
import { simulationRoute } from "@/features/simulation/route";
import { reportsRoute } from "@/features/reports/route";

export const routes = [simulationRoute, reportsRoute] as const;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    children: [
      { index: true, element: <Navigate to="/simulation" replace /> },
      ...routes.map((r) => ({ path: r.path, element: r.element })),
    ],
  },
]);
