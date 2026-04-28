import { Button } from "@v-ems/element";
import { useNavigate } from "react-router-dom";

export function SignInPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Button onClick={() => navigate("/home")}>Sign In</Button>
    </div>
  );
}
