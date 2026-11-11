import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const paginasDir = resolve(process.cwd(), "paginas");
const paginas = readdirSync(paginasDir)
  .filter((archivo) => archivo.endsWith(".html"))
  .map((archivo) => [
    `paginas/${archivo.replace(/\.html$/, "")}`,
    resolve(paginasDir, archivo)
  ]);

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries([
        ["index", resolve(process.cwd(), "index.html")],
        ...paginas
      ])
    }
  }
});
