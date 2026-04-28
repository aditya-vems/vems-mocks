import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LogoLine } from "@v-ems/element/brand";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark relative h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in oklch, var(--primary) 18%, transparent) 0%, color-mix(in oklch, var(--primary) 6%, transparent) 25%, transparent 60%)",
        }}
      />
      <div className="relative flex h-full flex-col">
        <header className="w-full pt-10 pb-4 flex justify-center items-center animate-in fade-in-0 duration-500 ease-out fill-mode-both">
          <Link
            to="/sign-in"
            aria-label="Go to sign in"
            className="inline-flex transition-opacity duration-200 ease-out hover:opacity-80"
          >
            <LogoLine className="[&>path]:text-primary" />
          </Link>
        </header>
        <main className="relative w-full flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col justify-center items-center py-8">
            {children}
          </div>
        </main>
        <footer
          className="w-full py-4 flex justify-center items-center gap-6 text-sm animate-in fade-in-0 duration-500 ease-out fill-mode-both"
          style={{ animationDelay: "640ms" }}
        >
          <span className="text-muted-foreground/50">
            © 2026 VEMS. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}
