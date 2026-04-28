import { useLocation } from "react-router-dom";
import { CenterHeaderItems } from "./center-header-items";
import { LeftHeaderItems } from "./left-header-items";
import { RightHeaderItems } from "./right-header-items";

export function Header() {
  const location = useLocation();
  const showCenter = location.pathname !== "/home";

  return (
    <header className="grid h-14 grid-cols-3 items-center bg-muted px-10 dark:bg-background">
      <LeftHeaderItems />
      {showCenter ? <CenterHeaderItems /> : <div aria-hidden />}
      <RightHeaderItems />
    </header>
  );
}
