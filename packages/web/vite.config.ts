import { defineConfig } from "vite";
import vinext from "vinext";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => {
  const plugins: any[] = [vinext(), tailwindcss()];

  if (command === "build") {
    return import("@cloudflare/vite-plugin").then(({ cloudflare }) => ({
      plugins: [
        ...plugins,
        cloudflare({
          viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        }),
      ],
    }));
  }

  return { plugins };
});
