import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/studio")({
  component: () => <Navigate to="/admin" />,
});
