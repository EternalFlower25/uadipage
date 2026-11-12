/* =====================================================
   ASISTENTE INFORMATIVO UADI
   Responde con la información publicada en el propio sitio
   y enlaza a la sección de requisitos o formatos pedida.
   ===================================================== */

/* Las páginas viven en la raíz (index.html) y dentro de /paginas/.
   El prefijo se calcula desde la ruta de la página actual para que los
   enlaces funcionen igual en local, en Vercel o en un subdirectorio. */
const PREFIJO = /\/paginas\/[^/]*$/.test(window.location.pathname) ? "../" : "./";

const enlace = (ruta, texto) => ({
  href: PREFIJO + ruta,
  texto
});

const KB = [
  {
    id: "practicas",
    titulo: "Prácticas preprofesionales",
    claves: ["practica", "practicas", "practicas preprofesionales", "practicante", "rotacion", "rotaciones", "pregrado"],
    respuesta:
      "Las prácticas preprofesionales se realizan en el Hospital San José de Chincha y son coordinadas por UADI.\n\nDocumentos requeridos: copia de DNI legible y vigente, carta de presentación emitida, firmada y sellada por tu universidad o institución de procedencia, y el FUT (Ficha Única de Trámite) debidamente completado.\n\nPasos del proceso: reúne los documentos, preséntate en UADI (segundo piso del hospital) en horario de atención, espera la evaluación de tu expediente y, una vez aprobado, coordina tu área de inicio.",
    enlaces: [enlace("paginas/practicas.html", "Ver requisitos de prácticas")]
  },
  {
    id: "internado",
    titulo: "Internado",
    claves: ["internado", "internado hospitalario", "interna", "internado medico"],
    respuesta:
      "El internado se desarrolla en el Hospital San José de Chincha y la información está a cargo de UADI.\n\nDocumentos requeridos: documento de identidad (copia de DNI), carta de presentación de tu universidad o institución de procedencia, documentación académica de tu carrera y otros documentos establecidos por UADI según la convocatoria vigente.\n\nEl proceso tiene cinco pasos: reúne los documentos, acércate a UADI, entrega tu expediente, espera la evaluación e inicia tu internado. Los formatos oficiales se solicitan directamente en la oficina de UADI.",
    enlaces: [enlace("paginas/internado.html", "Ver requisitos de internado")]
  },
  {
    id: "residentado",
    titulo: "Residentado médico",
    claves: ["residentado", "residentado medico", "residencia", "conareme", "plaza", "adjudicacion"],
    respuesta:
      "Para el ingreso al Residentado Médico en el Hospital San José de Chincha se presentan cinco documentos: copia de DNI, constancia de adjudicación de la plaza, colegiatura y habilitación profesional, certificado de salud física y mental emitido por el HSJCH, y currículum vitae con sustento de cada dato.\n\nLos documentos se ordenan en un pioner A4 de color blanco y se entregan en la Mesa de Partes del Hospital San José de Chincha. El proceso nacional de admisión se rige por la convocatoria oficial de CONAREME.",
    enlaces: [enlace("paginas/residentado.html", "Ver requisitos de residentado")]
  },
  {
    id: "investigacion",
    titulo: "Tesis e investigación",
    claves: ["tesis", "investigacion", "proyecto", "proyectos", "comite de etica", "protocolo", "cientifica", "publicacion", "reporte de caso"],
    respuesta:
      "Para presentar un proyecto de investigación en UADI se requieren siete documentos: formulario de trabajo de investigación emitido por UADI y el Comité de Ética en Investigación según corresponda, copia de DNI vigente de los investigadores, resolución o constancia de aprobación del proyecto emitida por la universidad o institución de procedencia, carta de confidencialidad y reserva de información, carta de presentación de la universidad, copia del proyecto de investigación en físico impreso por ambas caras e identificación de la Unidad de Docencia, que es obligatorio portar durante todo el desarrollo del proyecto.",
    enlaces: [enlace("paginas/tesis-investigacion.html", "Ver requisitos de investigación")]
  },
  {
    id: "constancias",
    titulo: "Constancias y certificados",
    claves: ["constancia", "constancias", "certificado", "certificados", "diploma de practicas", "documento academico"],
    respuesta:
      "UADI orienta sobre constancias de prácticas preprofesionales, constancias de internado, constancias de investigación y certificados de cursos, talleres y diplomados.\n\nPara solicitar información puedes escribir a uadi.hsjch@gmail.com o acercarte al segundo piso del Hospital San José de Chincha en horario de atención. UADI te indicará los requisitos, el costo si aplica y los plazos vigentes.",
    enlaces: [enlace("paginas/constancias.html", "Ver constancias y certificados")]
  },
  {
    id: "cursos",
    titulo: "Diplomados y cursos",
    claves: ["curso", "cursos", "diplomado", "diplomados", "taller", "talleres", "capacitacion", "charla", "oferta academica"],
    respuesta:
      "UADI organiza diplomados, cursos, talleres, charlas y eventos académicos orientados a profesionales de la salud.\n\nLa oferta vigente, las fechas y los requisitos se confirman directamente con UADI. Puedes escribir a uadi.hsjch@gmail.com o acercarte al segundo piso del Hospital San José de Chincha en horario de atención.",
    enlaces: [enlace("paginas/cursos-diplomados.html", "Ver diplomados y cursos")]
  },
  {
    id: "pensiones",
    titulo: "Recategorización de pensiones",
    claves: ["pension", "pensiones", "recategorizacion", "boleta", "descuento", "convenio", "upsjb", "uai"],
    respuesta:
      "La recategorización en el pago de pensiones aplica a todos los trabajadores de la Unidad Ejecutora 401 Salud Chincha.\n\nDocumentos requeridos: FUT (Ficha Única de Trámite), DNI del trabajador o del hijo beneficiario y la última boleta de pago del trabajador solicitante.\n\nLos beneficios publicados incluyen un descuento de hasta 25% con UPSJB y un descuento de escala por convenio con UAI. Los requisitos, descuentos y vigencia de convenios deben confirmarse con UADI.",
    enlaces: [enlace("paginas/recategorizacion-pensiones.html", "Ver requisitos de pensiones")]
  },
  {
    id: "horario",
    titulo: "Horario de atención",
    claves: ["horario", "hora", "horas", "atencion", "atienden", "abren", "abierto", "cuando atienden"],
    respuesta:
      "UADI atiende de lunes a viernes de 08:00 a.m. a 12:00 p.m. y de 02:00 p.m. a 04:00 p.m., en el segundo piso del Hospital San José de Chincha.",
    enlaces: [enlace("index.html#contacto", "Ver datos de contacto")]
  },
  {
    id: "contacto",
    titulo: "Contacto y ubicación",
    claves: ["contacto", "contactar", "correo", "email", "gmail", "telefono", "ubicacion", "direccion", "donde queda", "donde estan", "maps", "mapa", "segundo piso"],
    respuesta:
      "Puedes comunicarte con UADI por correo a uadi.hsjch@gmail.com o acercarte a la oficina en el segundo piso del Hospital San José de Chincha, ubicado en Av. Abelardo Alva Maurtua N.º 600, Chincha Alta, Chincha, Ica.\n\nEl horario de atención es de lunes a viernes de 08:00 a.m. a 12:00 p.m. y de 02:00 p.m. a 04:00 p.m.",
    enlaces: [enlace("index.html#contacto", "Ver sección de contacto")]
  },
  {
    id: "areas",
    titulo: "Áreas de UADI",
    claves: ["areas", "servicios", "que ofrece", "secciones", "portal", "que tramites"],
    respuesta:
      "El portal de UADI reúne siete áreas informativas: prácticas preprofesionales, internado, tesis e investigación, diplomados y cursos, constancias y certificados, recategorización de pensiones y residentado médico.\n\nCada área incluye sus requisitos, formatos y pasos a seguir. Dime cuál te interesa y te llevo a esa sección.",
    enlaces: [enlace("index.html#areas", "Ver todas las áreas")]
  },
  {
    id: "uadi",
    titulo: "¿Qué es UADI?",
    claves: ["uadi", "que es uadi", "quienes son", "institucion", "mision", "vision", "historia", "nosotros", "unidad de apoyo"],
    respuesta:
      "UADI es la Unidad de Apoyo a la Docencia e Investigación del Hospital San José de Chincha. Gestiona, coordina y promueve la formación académica, la investigación y la capacitación del personal de salud.\n\nSu misión es fomentar la formación académica y la investigación en salud, y su visión es ser una unidad reconocida por su liderazgo en docencia, investigación y formación continua.",
    enlaces: [enlace("paginas/conocenos.html", "Conoce más sobre UADI")]
  },
  {
    id: "formatos",
    titulo: "Formatos y documentos",
    claves: ["formato", "formatos", "fut", "ficha unica de tramite", "solicitud", "planilla", "donde consigo el formato", "descargar"],
    respuesta:
      "Los formatos oficiales (FUT, formato de inscripción, formulario de trabajo de investigación y otros) se solicitan directamente en la oficina de UADI, en el segundo piso del Hospital San José de Chincha, en horario de atención.\n\nCada área del portal detalla qué documentos acompañan a cada formato.",
    enlaces: [
      enlace("paginas/internado.html", "Formatos de internado"),
      enlace("paginas/tesis-investigacion.html", "Formatos de investigación")
    ]
  },
  {
    id: "noticias",
    titulo: "Noticias, eventos y galería",
    claves: ["noticia", "noticias", "evento", "eventos", "novedades", "galeria", "fotos", "actividades", "convocatoria", "convocatorias"],
    respuesta:
      "En la portada del portal encontrarás las secciones de noticias y eventos, con filtros por académicas, investigación, capacitaciones y eventos, además de la galería institucional con las actividades de UADI.",
    enlaces: [
      enlace("index.html#noticias", "Ver noticias y eventos"),
      enlace("index.html#galeria", "Ver galería")
    ]
  },
  {
    id: "requisitos",
    titulo: "Requisitos",
    claves: ["requisito", "requisitos", "documentos", "documentacion", "que necesito", "que debo presentar", "papeles"],
    respuesta:
      "Los requisitos dependen del área: prácticas preprofesionales, internado, residentado médico, investigación, constancias o recategorización de pensiones.\n\nDime el área que te interesa y te muestro la lista de documentos y el enlace a su sección.",
    enlaces: [enlace("index.html#areas", "Ver áreas y requisitos")]
  }
];

const SALUDOS = ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "hey", "que tal"];
const AGRADECIMIENTOS = ["gracias", "muchas gracias", "thanks", "ok gracias", "perfecto gracias"];

const normalizar = (texto) =>
  String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function puntuar(consulta, entrada) {
  let puntos = 0;
  const titulo = normalizar(entrada.titulo);

  entrada.claves.forEach((clave) => {
    const termino = normalizar(clave);
    if (!termino) return;
    if (consulta === termino) puntos += 12;
    else if (consulta.includes(termino)) {
      puntos += 4 + termino.split(" ").length * 2;
    } else if (termino.includes(consulta) && consulta.length > 4) {
      puntos += 2;
    }
  });

  const palabras = consulta.split(" ").filter((p) => p.length > 3);
  palabras.forEach((palabra) => {
    if (titulo.includes(palabra)) puntos += 2;
  });

  return puntos;
}

function buscar(consulta) {
  const texto = normalizar(consulta);
  if (!texto) return null;

  if (SALUDOS.includes(texto)) {
    return {
      respuesta:
        "¡Hola! Soy el asistente informativo de UADI. Puedo orientarte sobre prácticas, internado, residentado, investigación, constancias, cursos, pensiones, requisitos, formatos y horarios.\n\n¿Qué información necesitas?",
      enlaces: [enlace("index.html#areas", "Ver todas las áreas")]
    };
  }

  if (AGRADECIMIENTOS.some((t) => texto.includes(t))) {
    return {
      respuesta: "Con gusto. Si necesitas otra información sobre UADI, aquí estoy.",
      enlaces: []
    };
  }

  const ranking = KB.map((entrada) => ({
    entrada,
    puntos: puntuar(texto, entrada)
  })).sort((a, b) => b.puntos - a.puntos);

  const mejor = ranking[0];

  if (!mejor || mejor.puntos < 4) {
    return {
      respuesta:
        "No encontré esa información en el portal. Puedo ayudarte con prácticas preprofesionales, internado, residentado médico, tesis e investigación, constancias, diplomados y cursos, recategorización de pensiones, requisitos, formatos, horarios y contacto.\n\nTambién puedes escribir a uadi.hsjch@gmail.com.",
      enlaces: [
        enlace("index.html#areas", "Ver áreas de UADI"),
        enlace("index.html#contacto", "Ver contacto")
      ]
    };
  }

  const relacionados = ranking
    .slice(1, 3)
    .filter((item) => item.puntos >= 4 && item.puntos >= mejor.puntos * 0.6)
    .map((item) => item.entrada.titulo);

  const respuesta = relacionados.length
    ? `${mejor.entrada.respuesta}\n\nTambién tengo información sobre: ${relacionados.join(" y ")}.`
    : mejor.entrada.respuesta;

  return { respuesta, enlaces: mejor.entrada.enlaces };
}

/* ------------------------- interfaz ------------------------- */

const ESTILOS = `
.chat-answer p { margin: 0 0 9px; }
.chat-answer p:last-of-type { margin-bottom: 0; }
.chat-links { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 11px; }
.chat-links a { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 999px; background: #0a7fd0; color: #fff; font-size: 11.5px; font-weight: 800; text-decoration: none; }
.chat-links a:hover { background: #075fa0; }
.chat-links a::after { content: "→"; }
.chat-links a:focus-visible { outline: 3px solid #32a9e366; outline-offset: 2px; }
`;

function inyectarEstilos() {
  if (document.getElementById("uadiChatStyles")) return;
  const estilo = document.createElement("style");
  estilo.id = "uadiChatStyles";
  estilo.textContent = ESTILOS;
  document.head.appendChild(estilo);
}

function crearLanzador() {
  let boton = document.getElementById("chatLauncher");
  if (boton) return boton;

  boton = document.createElement("button");
  boton.className = "chat-launcher";
  boton.id = "chatLauncher";
  boton.type = "button";
  boton.setAttribute("aria-label", "Abrir el asistente informativo de UADI");
  boton.setAttribute("aria-expanded", "false");
  boton.setAttribute("aria-controls", "uadiChat");
  boton.innerHTML = `
    <span class="chat-launcher-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 5c-10 0-18 7-18 16 0 5 3 10 8 13l-2 8 10-5h2c10 0 18-7 18-16S34 5 24 5Z"/><circle cx="16" cy="21" r="2"/><circle cx="24" cy="21" r="2"/><circle cx="32" cy="21" r="2"/></svg></span>
    <span class="chat-launcher-label">Asistente UADI</span>
    <span class="chat-launcher-status" aria-hidden="true"></span>
  `;
  document.body.appendChild(boton);
  return boton;
}

function pintarRespuesta(contenedor, datos) {
  contenedor.replaceChildren();
  contenedor.classList.remove("bot-typing", "chat-error");

  const cuerpo = document.createElement("div");
  cuerpo.className = "chat-answer";

  datos.respuesta.split(/\n\n+/).forEach((parrafo) => {
    const p = document.createElement("p");
    p.textContent = parrafo;
    cuerpo.appendChild(p);
  });

  contenedor.appendChild(cuerpo);

  if (datos.enlaces?.length) {
    const lista = document.createElement("div");
    lista.className = "chat-links";
    datos.enlaces.forEach((item) => {
      const a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.texto;
      lista.appendChild(a);
    });
    contenedor.appendChild(lista);
  }
}

function iniciarChatbot() {
  const boton = crearLanzador();
  if (!boton || boton.dataset.uadiReady === "1") return;
  boton.dataset.uadiReady = "1";
  inyectarEstilos();

  boton.addEventListener("click", () => {
    const abierto = document.querySelector(".chat-window");
    if (abierto) {
      abierto.querySelector("#mensajeChat")?.focus();
      return;
    }

    const chat = document.createElement("div");
    chat.className = "chat-window";
    chat.id = "uadiChat";
    chat.setAttribute("role", "dialog");
    chat.setAttribute("aria-modal", "false");
    chat.setAttribute("aria-labelledby", "uadiChatTitle");

    chat.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-brand">
          <span class="chat-avatar" aria-hidden="true">
            <svg viewBox="0 0 48 48"><rect x="8" y="12" width="32" height="27" rx="10"/><path d="M24 5v7M18 25h.01M30 25h.01M18 32c3 3 9 3 12 0"/><path d="M4 23v6m40-6v6"/></svg>
            <i></i>
          </span>
          <span class="chat-brand-copy">
            <strong id="uadiChatTitle">Asistente UADI</strong>
            <small>Orientación institucional</small>
          </span>
        </div>
        <button type="button" class="cerrar-chat" aria-label="Cerrar chat">×</button>
      </div>

      <div class="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
        <div class="bot-message chat-welcome">
          <span class="chat-welcome-eyebrow">ASISTENTE VIRTUAL</span>
          <strong>¡Hola! ¿En qué puedo orientarte?</strong>
          <br><br>
          Puedo ayudarte a encontrar requisitos, formatos y pasos de prácticas, internado, residentado, investigación, constancias, cursos y pensiones.
        </div>
        <div class="chat-suggestions" aria-label="Preguntas frecuentes">
          <button type="button" data-chat-suggestion="¿Qué requisitos piden para prácticas preprofesionales?"><span aria-hidden="true">◇</span> Requisitos de prácticas</button>
          <button type="button" data-chat-suggestion="¿Qué documentos piden para el internado?"><span aria-hidden="true">＋</span> Documentos de internado</button>
          <button type="button" data-chat-suggestion="¿Dónde consigo los formatos?"><span aria-hidden="true">▤</span> Formatos</button>
          <button type="button" data-chat-suggestion="¿Cuál es el horario de atención?"><span aria-hidden="true">◷</span> Horario</button>
        </div>
      </div>

      <form class="chat-input" aria-label="Enviar una pregunta al asistente">
        <input type="text" id="mensajeChat" placeholder="Pregúntame sobre UADI..." maxlength="300" autocomplete="off" aria-label="Tu pregunta">
        <button type="submit" id="enviarChat" aria-label="Enviar pregunta">➤</button>
      </form>
    `;

    document.body.appendChild(chat);
    boton.setAttribute("aria-expanded", "true");

    const input = chat.querySelector("#mensajeChat");
    const formulario = chat.querySelector(".chat-input");
    const mensajes = chat.querySelector(".chat-messages");

    const cerrarChat = () => {
      chat.remove();
      boton.setAttribute("aria-expanded", "false");
      boton.focus();
    };

    chat.querySelector(".cerrar-chat").addEventListener("click", cerrarChat);

    /* Historial corto para dar contexto a la IA. */
    const historial = [];
    let iaDisponible = true;

    /* Consulta la función serverless /api/chat. Devuelve null si no está
       configurada, tarda demasiado o falla, para caer al motor local. */
    const consultarIA = async (texto) => {
      if (!iaDisponible) return null;
      const control = new AbortController();
      const temporizador = window.setTimeout(() => control.abort(), 12000);
      try {
        const respuesta = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mensaje: texto, historial: historial.slice(-6) }),
          signal: control.signal
        });
        if (respuesta.status === 501 || respuesta.status === 404) {
          iaDisponible = false;
          return null;
        }
        if (!respuesta.ok) return null;
        const datos = await respuesta.json();
        const limpio = String(datos?.respuesta || "").trim();
        return limpio || null;
      } catch {
        return null;
      } finally {
        window.clearTimeout(temporizador);
      }
    };

    const responder = async (pregunta) => {
      const texto = String(pregunta || "").trim();
      if (!texto) return;

      const usuario = document.createElement("div");
      usuario.className = "user-message";
      usuario.textContent = texto;
      mensajes.appendChild(usuario);

      input.value = "";
      input.disabled = true;

      const respuesta = document.createElement("div");
      respuesta.className = "bot-message bot-typing";
      respuesta.innerHTML = '<span>Consultando la información de UADI</span><span class="typing-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
      mensajes.appendChild(respuesta);
      mensajes.scrollTop = mensajes.scrollHeight;

      const local = buscar(texto);
      const [ia] = await Promise.all([
        consultarIA(texto),
        new Promise((listo) => window.setTimeout(listo, 380))
      ]);

      const datos = ia
        ? { respuesta: ia, enlaces: local?.enlaces || [] }
        : local;

      pintarRespuesta(respuesta, datos);
      historial.push({ rol: "user", texto }, { rol: "bot", texto: datos.respuesta });
      if (historial.length > 8) historial.splice(0, historial.length - 8);

      input.disabled = false;
      input.focus();
      mensajes.scrollTop = mensajes.scrollHeight;
    };

    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      responder(input.value);
    });

    chat.querySelectorAll("[data-chat-suggestion]").forEach((sugerencia) => {
      sugerencia.addEventListener("click", () => {
        responder(sugerencia.dataset.chatSuggestion || "");
      });
    });

    chat.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") cerrarChat();
    });

    input.focus();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarChatbot, { once: true });
} else {
  iniciarChatbot();
}
