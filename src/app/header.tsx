import { LeftHeaderItems } from "./left-header-items";
import { RightHeaderItems } from "./right-header-items";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between bg-muted px-4 dark:bg-background">
      <LeftHeaderItems />
      <RightHeaderItems />
    </header>
  );
}