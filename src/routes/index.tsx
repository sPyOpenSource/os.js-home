import { createFileRoute } from "@tanstack/react-router";
import { Desktop } from "@/desktop/Desktop";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "webOS — A web desktop environment" },
      { name: "description", content: "A macOS-inspired desktop environment in your browser. Windows, dock, menu bar, and apps." },
    ],
  }),
});

function Index() {
  return <Desktop />;
}
