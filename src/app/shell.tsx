import { Header } from "./header";
import { Outlet } from "react-router-dom";

export function Shell() {
  return (
    <div className="flex h-screen flex-col bg-muted dark:bg-background">
      <Header />
      <main className="flex min-h-0 flex-1 overflow-hidden px-2 pb-2">
        <Outlet />
      </main>
    </div>
  );
}
