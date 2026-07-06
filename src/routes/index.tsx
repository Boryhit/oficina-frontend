import { createFileRoute } from "@tanstack/react-router";
import SpaHost from "../spa-host";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OficinaPro — Gestão de Oficina Mecânica" },
      {
        name: "description",
        content:
          "Sistema completo de gestão de oficina mecânica: veículos, oficinas e manutenções em um só lugar.",
      },
      { property: "og:title", content: "OficinaPro — Gestão de Oficina Mecânica" },
      {
        property: "og:description",
        content:
          "Sistema completo de gestão de oficina mecânica: veículos, oficinas e manutenções em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpaHost,
});
