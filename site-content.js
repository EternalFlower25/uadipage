import { supabase } from "./supabase.js";

function textoSeguro(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caracter]);
}

function urlSegura(valor) {
  const destino = String(valor ?? "").trim();
  if (!destino) return "";
  try {
    const url = new URL(destino, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function categoriaNoticia(noticia) {
  const texto = `${noticia.title || ""} ${noticia.body || ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/capacitacion|taller|curso|diplomado|seminario/.test(texto)) {
    return { id: "capacitaciones", nombre: "Capacitación" };
  }
  if (/evento|jornada|congreso|feria|semana|ceremonia/.test(texto)) {
    return { id: "eventos", nombre: "Evento" };
  }
  if (/investigacion|tesis|proyecto|cientific/.test(texto)) {
    return { id: "investigacion", nombre: "Investigación" };
  }
  return { id: "academicas", nombre: "Académica" };
}

function fechaNoticia(valor) {
  if (!valor) return null;
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return null;
  return {
    iso: fecha.toISOString(),
    texto: new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "America/Lima"
    }).format(fecha)
  };
}

function crearNoticia(noticia) {
  const elemento = document.createElement("article");
  elemento.className = "news-card";
  const categoria = categoriaNoticia(noticia);
  elemento.dataset.newsCategory = categoria.id;

  const imagen = urlSegura(noticia.image_url);
  const enlace = urlSegura(noticia.link_url);
  const fecha = fechaNoticia(noticia.created_at);
  const texto = textoSeguro(noticia.body || "Consulta la información publicada por UADI.");

  elemento.innerHTML = `
    <div class="news-photo">
      ${imagen
        ? `<img class="news-image" src="${textoSeguro(imagen)}" alt="" loading="lazy">`
        : `<div class="news-image news-image-placeholder" aria-hidden="true">▤</div>`}
      <span class="news-category">${textoSeguro(categoria.nombre)}</span>
    </div>
    <div class="news-card-content">
      ${fecha
        ? `<div class="news-date"><span aria-hidden="true">▦</span><time datetime="${textoSeguro(fecha.iso)}">${textoSeguro(fecha.texto)}</time></div>`
        : ""}
      <h3>${textoSeguro(noticia.title || "Novedad de UADI")}</h3>
      <p class="news-summary">${texto}</p>
    ${enlace
      ? `<a class="news-read-more" href="${textoSeguro(enlace)}" target="_blank" rel="noopener">Leer más <span aria-hidden="true">→</span></a>`
      : `<details class="news-details"><summary>Leer más <span aria-hidden="true">→</span></summary><p>${texto}</p></details>`}
    </div>
  `;

  return elemento;
}

function cargarCarrusel(diapositivas) {
  const contenedor = document.getElementById("heroCarousel");
  const imagen = document.getElementById("heroSlideImage");
  const titulo = document.getElementById("heroSlideTitle");
  const descripcion = document.getElementById("heroSlideBody");
  const puntos = document.getElementById("heroSlideDots");

  if (!contenedor || !imagen || !titulo || !descripcion || !puntos) return;

  const validas = diapositivas.filter((item) => urlSegura(item.image_url));
  if (!validas.length) return;

  let indice = 0;
  let temporizador;

  function mostrarDiapositiva() {
    const actual = validas[indice];

    imagen.src = urlSegura(actual.image_url);
    imagen.alt = actual.title || "Imagen institucional UADI";
    titulo.textContent = actual.title || "UADI";
    descripcion.textContent = actual.body || "";

    puntos.querySelectorAll("button").forEach((boton, posicion) => {
      boton.setAttribute("aria-current", String(posicion === indice));
    });
  }

  validas.forEach((item, posicion) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.setAttribute("aria-label", `Mostrar imagen ${posicion + 1}`);
    boton.addEventListener("click", () => {
      indice = posicion;
      mostrarDiapositiva();
    });
    puntos.appendChild(boton);
  });

  contenedor.querySelector(".carousel-prev")?.addEventListener("click", () => {
    indice = (indice + validas.length - 1) % validas.length;
    mostrarDiapositiva();
  });

  contenedor.querySelector(".carousel-next")?.addEventListener("click", () => {
    indice = (indice + 1) % validas.length;
    mostrarDiapositiva();
  });

  mostrarDiapositiva();

  if (
    validas.length > 1 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const iniciar = () => {
      clearInterval(temporizador);
      temporizador = setInterval(() => {
        indice = (indice + 1) % validas.length;
        mostrarDiapositiva();
      }, 5500);
    };

    const pausar = () => clearInterval(temporizador);

    contenedor.addEventListener("mouseenter", pausar);
    contenedor.addEventListener("mouseleave", iniciar);
    contenedor.addEventListener("focusin", pausar);
    contenedor.addEventListener("focusout", iniciar);

    iniciar();
  }
}

function cargarNoticias(noticias) {
  const contenedor = document.getElementById("newsGrid");
  if (!contenedor) return;

  if (!noticias.length) return;

  contenedor.replaceChildren(...noticias.map(crearNoticia));
}

function categoriaGaleria(foto) {
  const texto = `${foto.title || ""} ${foto.body || ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/investigacion|tesis|laboratorio|cientific/.test(texto)) {
    return { id: "investigacion", nombre: "Actividades de investigación" };
  }
  if (/capacitacion|taller|curso|diplomado|seminario/.test(texto)) {
    return { id: "capacitaciones", nombre: "Capacitación académica" };
  }
  if (/evento|jornada|congreso|feria|semana|ceremonia|reconocimiento/.test(texto)) {
    return { id: "eventos", nombre: "Eventos UADI" };
  }
  return { id: "docencia", nombre: "Docencia" };
}

function crearFotoGaleria(foto, posicion) {
  const categoria = categoriaGaleria(foto);
  const figura = document.createElement("figure");
  figura.className = `gallery-card${posicion === 0 ? " gallery-featured" : ""}`;
  figura.dataset.galleryCategory = categoria.id;

  const imagen = document.createElement("img");
  imagen.src = urlSegura(foto.image_url);
  imagen.alt = foto.title || categoria.nombre;
  imagen.loading = posicion < 5 ? "eager" : "lazy";

  const leyenda = document.createElement("figcaption");
  const marca = document.createElement("span");
  marca.textContent = categoria.nombre;
  const titulo = document.createElement("strong");
  titulo.textContent = foto.title || "Actividad institucional UADI";
  leyenda.append(marca, titulo);
  figura.append(imagen, leyenda);

  return figura;
}

function crearGaleriaVacia() {
  const fragmento = document.createDocumentFragment();
  const hospital = document.createElement("figure");
  hospital.className = "gallery-card gallery-featured";
  hospital.dataset.galleryCategory = "hospital";

  const imagen = document.createElement("img");
  imagen.src = "imagenes/hospital-web.jpg";
  imagen.alt = "Vista del Hospital San José de Chincha";
  imagen.loading = "lazy";
  const leyenda = document.createElement("figcaption");
  leyenda.innerHTML = '<span>Hospital</span><strong>Hospital San José de Chincha</strong>';
  hospital.append(imagen, leyenda);
  fragmento.append(hospital);

  const marcadores = [
    ["▧", "Próximas fotos"],
    ["♧", "Actividades UADI"],
    ["◇", "Docencia e investigación"],
    ["▦", "Eventos académicos"]
  ];
  marcadores.forEach(([icono, texto]) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "gallery-coming-soon";
    tarjeta.dataset.galleryCategory = "placeholder";
    tarjeta.setAttribute("aria-hidden", "true");
    tarjeta.innerHTML = `<span>${icono}</span><strong>${texto}</strong>`;
    fragmento.append(tarjeta);
  });

  return fragmento;
}

function cargarGaleria(fotos) {
  const contenedor = document.getElementById("galleryGrid");
  const botonMas = document.querySelector("[data-gallery-expand]");
  if (!contenedor) return;

  const validas = fotos.filter((foto) => urlSegura(foto.image_url));
  if (!validas.length) {
    contenedor.replaceChildren(crearGaleriaVacia());
    if (botonMas) botonMas.hidden = true;
    return;
  }

  contenedor.replaceChildren(...validas.map(crearFotoGaleria));
  if (botonMas) botonMas.hidden = validas.length <= 5;
}

async function cargarContenido() {
  const [respuestaAjustes, respuestaContenido] = await Promise.all([
    supabase
      .from("site_settings")
      .select("setting_key, setting_value"),

    supabase
      .from("site_content")
      .select("kind, title, body, image_url, link_url, sort_order, created_at")
      .eq("published", true)
      .order("sort_order")
  ]);

  if (respuestaAjustes.error) throw respuestaAjustes.error;
  if (respuestaContenido.error) throw respuestaContenido.error;

  const ajustes = Object.fromEntries(
    (respuestaAjustes.data || []).map((fila) => [
      fila.setting_key,
      fila.setting_value
    ])
  );

  const actualizarTexto = (id, clave) => {
    const elemento = document.getElementById(id);
    if (elemento && ajustes[clave]) {
      elemento.textContent = ajustes[clave];
    }
  };

  actualizarTexto("heroBadge", "hero_badge");
  if (ajustes.hero_title) {
    const titulo = document.getElementById("heroTitle");
    const lineaPrincipal = titulo?.querySelector(".hero-title-main");
    const lineaAcentuada = titulo?.querySelector(".hero-title-accent");
    if (lineaPrincipal && lineaAcentuada) {
      const texto = String(ajustes.hero_title).trim();
      const separador = texto.match(/^(.+?\be)\s+(.+)$/i);
      const palabras = texto.split(/\s+/);
      const mitad = Math.ceil(palabras.length / 2);
      lineaPrincipal.textContent = separador?.[1] || palabras.slice(0, mitad).join(" ");
      lineaAcentuada.textContent = separador?.[2] || palabras.slice(mitad).join(" ");
      lineaAcentuada.hidden = !lineaAcentuada.textContent;
    } else if (titulo) {
      titulo.textContent = ajustes.hero_title;
    }
  }
  actualizarTexto("heroSubtitle", "hero_subtitle");
  actualizarTexto("aboutDescription", "about_description");
  actualizarTexto("aboutMission", "about_mission");
  actualizarTexto("aboutVision", "about_vision");
  actualizarTexto("aboutObjective", "about_objective");
  cargarVideoConocenos(ajustes.about_video_url);
  actualizarTexto("contactAddress", "contact_address");
  const direccionContacto = document.getElementById("contactAddress")?.textContent?.trim();
  if (direccionContacto) {
    const consultaMapa = /hospital/i.test(direccionContacto)
      ? direccionContacto
      : `Hospital San José de Chincha, ${direccionContacto}`;
    const enlaceMapa = new URL("https://www.google.com/maps/search/");
    enlaceMapa.searchParams.set("api", "1");
    enlaceMapa.searchParams.set("query", consultaMapa);
    document.querySelectorAll("[data-google-maps-link]").forEach((enlace) => {
      enlace.href = enlaceMapa.href;
    });
  }
  actualizarTexto("contactPhone", "contact_phone");
  actualizarTexto("contactEmail", "contact_email");
  actualizarTexto("contactHours", "contact_hours");

  const contenido = respuestaContenido.data || [];

  cargarCarrusel(contenido.filter((item) => item.kind === "slide"));
  cargarNoticias(contenido.filter((item) => item.kind === "news"));
  cargarGaleria(contenido.filter((item) => item.kind === "gallery"));
}

function cargarVideoConocenos(valor) {
  const contenedor = document.getElementById("aboutVideoSlot");
  const enlace = urlSegura(valor);
  if (!contenedor || !enlace) return;

  let idYoutube = "";
  try {
    const url = new URL(enlace);
    if (url.hostname === "youtu.be") idYoutube = url.pathname.split("/").filter(Boolean)[0] || "";
    if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) {
      idYoutube = url.searchParams.get("v") || url.pathname.match(/\/embed\/([^/?]+)/)?.[1] || "";
    }
  } catch { return; }

  if (idYoutube && /^[\w-]{11}$/.test(idYoutube)) {
    const frame = document.createElement("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${idYoutube}`;
    frame.title = "Video institucional de UADI";
    frame.loading = "lazy";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    contenedor.replaceChildren(frame);
    contenedor.classList.add("has-video");
    return;
  }

  if (/\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(enlace)) {
    const video = document.createElement("video");
    video.src = enlace;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-label", "Video institucional de UADI");
    contenedor.replaceChildren(video);
    contenedor.classList.add("has-video");
  }
}

cargarContenido().catch((error) => {
  console.error("No se pudo cargar el contenido de Supabase:", error);
});
