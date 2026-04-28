import { Button } from "@v-ems/element";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="flex gap-2">
        <Button onClick={() => navigate("/simulate")}>Simulate</Button>
        <Button onClick={() => navigate("/analyze")}>Analyze</Button>
        <Button onClick={() => navigate("/run")}>Run</Button>
      </div>
      <Button variant="secondary" onClick={() => navigate("/sign-in")}>
        Sign Out
      </Button>
    </div>
  );
}
