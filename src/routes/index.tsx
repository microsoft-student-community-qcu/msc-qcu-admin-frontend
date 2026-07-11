import { createFileRoute } from "@tanstack/react-router";
import "../styles.css";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>QCU MSC React Scaffold</h1>
      <p>This is a minimal working TanStack Start application template.</p>
    </div>
  );
}
