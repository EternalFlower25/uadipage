/* Extrae el texto visible de las páginas del portal a contenido-sitio.json.
   Uso: node scripts/extraer-contenido.mjs
   Se ejecuta a mano cuando cambie el contenido de las páginas. */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const PAGINAS = [
  ["index.html", "Inicio"],
  ["paginas/conocenos.html", "Conócenos"],
  ["paginas/practicas.html", "Prácticas preprofesionales"],
  ["paginas/internado.html", "Internado"],
  ["paginas/residentado.html", "Residentado médico"],
  ["paginas/tesis-investigacion.html", "Tesis e investigación"],
  ["paginas/constancias.html", "Constancias y certificados"],
  ["paginas/cursos-diplomados.html", "Diplomados y cursos"],
  ["paginas/recategorizacion-pensiones.html", "Recategorización de pensiones"]
];

const limpiar = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(nav|header|footer)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(p|div|section|article|li|h[1-6]|tr|br)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((linea) => linea.trim())
    .filter((linea) => linea.length > 1)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const bloques = [];
let total = 0;

for (const [ruta, titulo] of PAGINAS) {
  let html;
  try {
    html = readFileSync(resolve(raiz, ruta), "utf8");
  } catch {
    console.warn(`Aviso: no se encontró ${ruta}, se omite.`);
    continue;
  }
  const texto = limpiar(html);
  if (!texto) continue;
  total += texto.length;
  bloques.push(`### ${titulo} (${ruta})\n${texto}`);
}

const salida = {
  generado: new Date().toISOString().slice(0, 10),
  fuente: "Texto visible de las páginas del portal UADI",
  paginas: PAGINAS.map(([ruta, titulo]) => ({ ruta, titulo })),
  contenido: bloques.join("\n\n")
};

writeFileSync(resolve(raiz, "contenido-sitio.json"), JSON.stringify(salida, null, 2) + "\n");
console.log(`contenido-sitio.json generado: ${bloques.length} páginas, ${total} caracteres de texto.`);
