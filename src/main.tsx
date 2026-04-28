import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { router } from "@/app/router";
import { MorphProvider } from "@/app/morph-context";
import { SimulationProvider } from "@/app/simulation-context";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SimulationProvider>
        <MorphProvider>
          <RouterProvider router={router} />
        </MorphProvider>
      </SimulationProvider>
    </ThemeProvider>
  </StrictMode>,
);
