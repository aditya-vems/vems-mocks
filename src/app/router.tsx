import { createBrowserRouter, Navigate } from "react-router-dom";
import { Shell } from "./shell";
import { simulateRoute } from "@/features/simulate/route";
import { runRoute } from "@/features/run/route";
import { analyzeRoute } from "@/features/analyze/route";
import { signInRoute } from "@/features/auth/sign-in/route";
import { verifyEmailRoute } from "@/features/auth/verify-email/route";
import { homeRoute } from "@/features/home/route";

export const routes = [simulateRoute, runRoute, analyzeRoute] as const;

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/sign-in" replace /> },
  { path: signInRoute.path, element: signInRoute.element },
  { path: verifyEmailRoute.path, element: verifyEmailRoute.element },
  { path: homeRoute.path, element: homeRoute.element },
  {
    element: <Shell />,
    children: routes.map((r) => ({ path: r.path, element: r.element })),
  },
]);
