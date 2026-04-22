import { createBrowserRouter, Navigate } from "react-router-dom";
import { Shell } from "./shell";
import { simulateRoute } from "@/features/simulate/route";
import { runRoute } from "@/features/run/route";
import { analyzeRoute } from "@/features/analyze/route";

export const routes = [simulateRoute, runRoute, analyzeRoute] as const;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    children: [
      { index: true, element: <Navigate to="/simulate" replace /> },
      ...routes.map((r) => ({ path: r.path, element: r.element })),
    ],
  },
]);
