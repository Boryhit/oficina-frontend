import { useEffect, useState, type ComponentType } from "react";

// TanStack Start renders SSR; the React Router DOM SPA needs `window`,
// so we mount it only on the client after hydration.
export default function SpaHost() {
  const [App, setApp] = useState<ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    // @ts-expect-error - JS module without types
    import("./app/App.jsx").then((mod) => {
      if (alive) setApp(() => mod.default);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!App) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f6f9",
          color: "#3b4a5a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Carregando OficinaPro…
      </div>
    );
  }

  return <App />;
}
