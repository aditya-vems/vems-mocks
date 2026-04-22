import { CenterHeaderItems } from "./center-header-items";
import { LeftHeaderItems } from "./left-header-items";
import { RightHeaderItems } from "./right-header-items";

export function Header() {
  return (
    <header className="grid h-14 grid-cols-3 items-center bg-muted px-4 dark:bg-background">
      <LeftHeaderItems />
      <CenterHeaderItems />
      <RightHeaderItems />
    </header>
  );
}
