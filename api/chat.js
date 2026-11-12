/* =====================================================
   POST /api/chat  —  Asistente UADI con IA
   Función serverless de Vercel. Responde únicamente con el
   contenido del portal (contenido-sitio.json) y no necesita
   ningún servidor permanente.

   Variables de entorno (una sola clave es suficiente):
     AI_PROVIDER = gemini | openai | groq | abacus   (por defecto gemini)
     AI_API_KEY  = la clave del proveedor
     AI_MODEL    = opcional, sobrescribe el modelo por defecto
   ===================================================== */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/* El contenido se empaqueta con la función (require estático de un JSON),
   así no hace falta ningún sistema de archivos ni base de datos en Vercel. */
let sitio = { contenido: "" };
try {
  sitio = require("../contenido-sitio.json");
} catch (error) {
  console.error("[api/chat] No se pudo cargar contenido-sitio.json:", error.message);
}

const PROVEEDORES = {
  gemini: {
    url: (modelo) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
    modelo: "gemini-2.0-flash",
    tipo: "gemini"
  },
  openai: {
    url: () => "https://api.openai.com/v1/chat/completions",
    modelo: "gpt-4o-mini",
    tipo: "openai"
  },
  groq: {
    url: () => "https://api.groq.com/openai/v1/chat/completions",
    modelo: "llama-3.3-70b-versatile",
    tipo: "openai"
  },
  abacus: {
    url: () => "https://apps.abacus.ai/v1/chat/completions",
    modelo: "gpt-4o-mini",
    tipo: "openai"
  }
};

const MAX_MENSAJE = 500;
const MAX_HISTORIAL = 6;
const LIMITE_POR_MINUTO = 20;

const visitas = new Map();

function limitado(ip) {
  const ahora = Date.now();
  const registro = visitas.get(ip) || { inicio: ahora, cuenta: 0 };
  if (ahora - registro.inicio > 60000) {
    registro.inicio = ahora;
    registro.cuenta = 0;
  }
  registro.cuenta += 1;
  visitas.set(ip, registro);
  if (visitas.size > 500) visitas.clear();
  return registro.cuenta > LIMITE_POR_MINUTO;
}

const INSTRUCCIONES = `Eres el asistente virtual de UADI, la Unidad de Apoyo a la Docencia e Investigación del Hospital San José de Chincha, en Perú.

Reglas obligatorias:
1. Responde solo con la información del CONTENIDO DEL PORTAL que aparece abajo. Si el dato no está ahí, dilo con claridad y sugiere escribir a uadi.hsjch@gmail.com o acercarse a la oficina de UADI en el segundo piso del hospital.
2. Nunca inventes requisitos, costos, plazos, fechas, nombres ni teléfonos.
3. No ofrezcas inscripciones, matrículas ni envío de documentos en línea: el portal es informativo y toda gestión se hace de forma presencial en UADI.
4. Responde en español, en tono cordial y profesional, en un máximo de 120 palabras, en texto plano sin markdown.
5. Cuando la pregunta corresponda a un área concreta, menciona que la lista completa de requisitos está en la página de esa área.

CONTENIDO DEL PORTAL:
${sitio.contenido}`;

function recortar(texto, maximo) {
  return String(texto || "").replace(/\s+/g, " ").trim().slice(0, maximo);
}

async function llamarGemini(clave, modelo, mensaje, historial) {
  const config = PROVEEDORES.gemini;
  const contents = historial.map((turno) => ({
    role: turno.rol === "bot" ? "model" : "user",
    parts: [{ text: turno.texto }]
  }));
  contents.push({ role: "user", parts: [{ text: mensaje }] });

  const respuesta = await fetch(`${config.url(modelo)}?key=${encodeURIComponent(clave)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: INSTRUCCIONES }] },
      contents,
      generationConfig: { temperature: 0.2, maxOutputTokens: 600, topP: 0.9 }
    })
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(`Gemini ${respuesta.status}: ${detalle.slice(0, 300)}`);
  }

  const datos = await respuesta.json();
  const partes = datos?.candidates?.[0]?.content?.parts || [];
  return partes.map((parte) => parte.text || "").join("").trim();
}

async function llamarOpenAI(clave, modelo, mensaje, historial, proveedor) {
  const config = PROVEEDORES[proveedor];
  const mensajes = [
    { role: "system", content: INSTRUCCIONES },
    ...historial.map((turno) => ({
      role: turno.rol === "bot" ? "assistant" : "user",
      content: turno.texto
    })),
    { role: "user", content: mensaje }
  ];

  const respuesta = await fetch(config.url(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${clave}`
    },
    body: JSON.stringify({
      model: modelo,
      messages: mensajes,
      temperature: 0.2,
      max_tokens: 600
    })
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(`${proveedor} ${respuesta.status}: ${detalle.slice(0, 300)}`);
  }

  const datos = await respuesta.json();
  return String(datos?.choices?.[0]?.message?.content || "").trim();
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const proveedor = String(process.env.AI_PROVIDER || "gemini").toLowerCase();
  const clave = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || "";
  const config = PROVEEDORES[proveedor];

  if (!config || !clave) {
    res.status(501).json({
      error: "sin_configurar",
      mensaje: "El asistente con IA no está configurado; se usa el motor local."
    });
    return;
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "anonimo";

  if (limitado(ip)) {
    res.status(429).json({ error: "demasiadas_consultas" });
    return;
  }

  let cuerpo = req.body;
  if (typeof cuerpo === "string") {
    try {
      cuerpo = JSON.parse(cuerpo);
    } catch {
      cuerpo = {};
    }
  }

  const mensaje = recortar(cuerpo?.mensaje, MAX_MENSAJE);
  if (!mensaje) {
    res.status(400).json({ error: "mensaje_vacio" });
    return;
  }

  const historial = Array.isArray(cuerpo?.historial)
    ? cuerpo.historial
        .filter((turno) => turno && typeof turno.texto === "string")
        .slice(-MAX_HISTORIAL)
        .map((turno) => ({
          rol: turno.rol === "bot" ? "bot" : "user",
          texto: recortar(turno.texto, MAX_MENSAJE)
        }))
    : [];

  const modelo = process.env.AI_MODEL || config.modelo;

  try {
    const respuesta =
      config.tipo === "gemini"
        ? await llamarGemini(clave, modelo, mensaje, historial)
        : await llamarOpenAI(clave, modelo, mensaje, historial, proveedor);

    if (!respuesta) {
      res.status(502).json({ error: "respuesta_vacia" });
      return;
    }

    res.status(200).json({ respuesta, proveedor, modelo });
  } catch (error) {
    console.error("[api/chat]", error.message);
    res.status(502).json({ error: "proveedor_no_disponible" });
  }
}
