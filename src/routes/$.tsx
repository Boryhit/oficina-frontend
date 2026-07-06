import { createFileRoute } from "@tanstack/react-router";
import SpaHost from "../spa-host";

export const Route = createFileRoute("/$")({
  component: SpaHost,
});
