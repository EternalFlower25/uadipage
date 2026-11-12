
/* =====================================================
   PORTAL UADI - INICIO, LOGIN, CHATBOT Y BUSCADOR
   ===================================================== */

const UADI_SCRIPT_URL = new URL("./script.js", document.baseURI).href;
const LOGO_HOSPITAL_URL = new URL("./imagenes/logo-hospital.png", import.meta.url).href;
const LOGO_UADI_URL = new URL("./imagenes/logo-uadi.png", import.meta.url).href;
const HOSPITAL_FOTO_URL = new URL("./imagenes/hospital-web.jpg", import.meta.url).href;

function redirigirAlPanelUADI() {
    window.location.replace(`${window.location.origin}/paginas/admin.html`);
}

function ejecutarCuandoDOMListo(callback) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
        callback();
    }
}

ejecutarCuandoDOMListo(function () {
    console.log("Portal UADI iniciado correctamente");

    const menuToggle = document.querySelector(".menu-toggle");
    const menuPrincipal = document.getElementById("menuPrincipal");

    if (menuToggle && menuPrincipal) {
        const cerrarMenu = ({ devolverFoco = false } = {}) => {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menú");
            menuPrincipal.classList.remove("menu-open");
            if (devolverFoco) menuToggle.focus();
        };

        menuToggle.addEventListener("click", () => {
            const abierto = menuToggle.getAttribute("aria-expanded") !== "true";
            menuToggle.setAttribute("aria-expanded", String(abierto));
            menuToggle.setAttribute(
                "aria-label",
                abierto ? "Cerrar menú" : "Abrir menú"
            );
            menuPrincipal.classList.toggle("menu-open", abierto);
        });

        menuPrincipal.addEventListener("click", (evento) => {
            if (evento.target.closest("a")) cerrarMenu();
        });

        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
                cerrarMenu({ devolverFoco: true });
            }
        });
    }

    const noticias = document.getElementById("newsGrid");
    const controlesNoticias = Array.from(
        document.querySelectorAll("[data-news-direction]")
    );
    const filtrosNoticias = Array.from(
        document.querySelectorAll("[data-news-filter]")
    );
    const estadoNoticias = document.getElementById("newsFilterStatus");
    const botonTodasNoticias = document.querySelector("[data-news-expand]");

    if (noticias && filtrosNoticias.length) {
        filtrosNoticias.forEach((boton) => {
            boton.addEventListener("click", () => {
                const filtro = boton.dataset.newsFilter;
                let visibles = 0;

                filtrosNoticias.forEach((opcion) => {
                    const activo = opcion === boton;
                    opcion.classList.toggle("is-active", activo);
                    opcion.setAttribute("aria-pressed", String(activo));
                });

                noticias.classList.remove("is-expanded");
                botonTodasNoticias?.setAttribute("aria-expanded", "false");
                if (botonTodasNoticias) {
                    botonTodasNoticias.innerHTML = '<span aria-hidden="true">▦</span> Ver todas las noticias y eventos <b aria-hidden="true">→</b>';
                }

                noticias.querySelectorAll(".news-card").forEach((tarjeta) => {
                    const mostrar = filtro === "all" || tarjeta.dataset.newsCategory === filtro;
                    tarjeta.hidden = !mostrar;
                    if (mostrar) visibles += 1;
                });

                if (estadoNoticias) {
                    const etiqueta = boton.textContent.trim().replace(/^[^\p{L}]+/u, "");
                    estadoNoticias.textContent = visibles
                        ? (filtro === "all" ? `Se muestran ${visibles} novedades.` : `${visibles} novedad${visibles === 1 ? "" : "es"} en ${etiqueta}.`)
                        : `Aún no hay novedades en ${etiqueta.toLowerCase()}.`;
                }
                noticias.scrollTo({ left: 0, behavior: movimientoReducido ? "auto" : "smooth" });
                const cantidadVisible = noticias.querySelectorAll(".news-card:not([hidden])").length;
                if (botonTodasNoticias) botonTodasNoticias.hidden = cantidadVisible <= 3;
                controlesNoticias.forEach((control) => {
                    control.hidden = noticias.scrollWidth <= noticias.clientWidth + 2;
                });
            });
        });
    }

    if (noticias && botonTodasNoticias) {
        botonTodasNoticias.addEventListener("click", () => {
            const expandido = noticias.classList.toggle("is-expanded");
            botonTodasNoticias.setAttribute("aria-expanded", String(expandido));
            botonTodasNoticias.innerHTML = expandido
                ? '<span aria-hidden="true">⌃</span> Mostrar menos novedades <b aria-hidden="true">↑</b>'
                : '<span aria-hidden="true">▦</span> Ver todas las noticias y eventos <b aria-hidden="true">→</b>';
        });
    }

    const galeria = document.getElementById("galleryGrid");
    const filtrosGaleria = Array.from(
        document.querySelectorAll("[data-gallery-filter]")
    );
    const estadoGaleria = document.getElementById("galleryFilterStatus");
    const botonMasFotos = document.querySelector("[data-gallery-expand]");

    if (galeria && filtrosGaleria.length) {
        filtrosGaleria.forEach((boton) => {
            boton.addEventListener("click", () => {
                const filtro = boton.dataset.galleryFilter;
                let visibles = 0;

                filtrosGaleria.forEach((opcion) => {
                    const activo = opcion === boton;
                    opcion.classList.toggle("is-active", activo);
                    opcion.setAttribute("aria-pressed", String(activo));
                });

                galeria.classList.remove("is-expanded");
                botonMasFotos?.setAttribute("aria-expanded", "false");
                if (botonMasFotos) {
                    botonMasFotos.innerHTML = '<span aria-hidden="true">▧</span> Ver más fotos de la galería <b aria-hidden="true">→</b>';
                }

                galeria.querySelectorAll("[data-gallery-category]").forEach((foto) => {
                    const mostrar = filtro === "all" || foto.dataset.galleryCategory === filtro ||
                        (filtro === "all" && foto.dataset.galleryCategory === "placeholder");
                    foto.hidden = !mostrar;
                    if (mostrar && !foto.classList.contains("gallery-coming-soon")) visibles += 1;
                });

                if (estadoGaleria) {
                    const etiqueta = boton.textContent.trim().replace(/^[^\p{L}]+/u, "");
                    estadoGaleria.textContent = visibles
                        ? `${visibles} foto${visibles === 1 ? "" : "s"} en ${etiqueta.toLowerCase()}.`
                        : `Aún no hay fotos publicadas en ${etiqueta.toLowerCase()}.`;
                }
                if (botonMasFotos) botonMasFotos.hidden = visibles <= 5;
            });
        });
    }

    if (galeria && botonMasFotos) {
        botonMasFotos.addEventListener("click", () => {
            const expandida = galeria.classList.toggle("is-expanded");
            botonMasFotos.setAttribute("aria-expanded", String(expandida));
            botonMasFotos.innerHTML = expandida
                ? '<span aria-hidden="true">⌃</span> Mostrar menos fotos <b aria-hidden="true">↑</b>'
                : '<span aria-hidden="true">▧</span> Ver más fotos de la galería <b aria-hidden="true">→</b>';
        });
    }

    if (noticias && controlesNoticias.length) {
        const actualizarControlesNoticias = () => {
            const hayDesplazamiento = noticias.scrollWidth > noticias.clientWidth + 2;
            controlesNoticias.forEach((control) => {
                control.hidden = !hayDesplazamiento;
            });
            const cantidadVisible = noticias.querySelectorAll(".news-card:not([hidden])").length;
            if (botonTodasNoticias) botonTodasNoticias.hidden = cantidadVisible <= 3;
        };

        controlesNoticias.forEach((control) => {
            control.addEventListener("click", () => {
                const primeraTarjeta = noticias.querySelector(".news-card");
                const distancia = primeraTarjeta
                    ? primeraTarjeta.getBoundingClientRect().width + 18
                    : noticias.clientWidth * 0.8;
                noticias.scrollBy({
                    left: control.dataset.newsDirection === "next"
                        ? distancia
                        : -distancia,
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                        ? "auto"
                        : "smooth"
                });
            });
        });

        if ("ResizeObserver" in window) {
            new ResizeObserver(actualizarControlesNoticias).observe(noticias);
        } else {
            window.addEventListener("resize", actualizarControlesNoticias, { passive: true });
        }
        new MutationObserver(actualizarControlesNoticias).observe(noticias, {
            childList: true
        });
        actualizarControlesNoticias();
    }

    const barraProgreso = document.getElementById("pageProgressBar");
    const volverArriba = document.getElementById("backToTop");
    const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let actualizacionScrollPendiente = false;

    const actualizarProgreso = () => {
        const maximo = document.documentElement.scrollHeight - window.innerHeight;
        const progreso = maximo > 0 ? window.scrollY / maximo : 0;
        if (barraProgreso) {
            barraProgreso.style.transform = `scaleX(${Math.min(1, Math.max(0, progreso))})`;
        }
        volverArriba?.classList.toggle("is-visible", window.scrollY > 480);
        actualizacionScrollPendiente = false;
    };

    window.addEventListener("scroll", () => {
        if (actualizacionScrollPendiente) return;
        actualizacionScrollPendiente = true;
        window.requestAnimationFrame(actualizarProgreso);
    }, { passive: true });
    window.addEventListener("resize", actualizarProgreso, { passive: true });
    actualizarProgreso();

    volverArriba?.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: movimientoReducido ? "auto" : "smooth"
        });
    });

    const elementosRevelar = document.querySelectorAll("[data-reveal]");

    if ("IntersectionObserver" in window && !movimientoReducido) {
        document.documentElement.classList.add("motion-enhanced");
        const observador = new IntersectionObserver((entradas, instancia) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("is-visible");
                    instancia.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

        elementosRevelar.forEach((elemento) => observador.observe(elemento));
    } else {
        elementosRevelar.forEach((elemento) => elemento.classList.add("is-visible"));
    }

    /* =====================================================
       INICIO DE SESIÓN CON SUPABASE
       ===================================================== */

    const botonLogin = document.querySelector(".btn-login");

    if (botonLogin) {
        botonLogin.addEventListener("click", abrirLogin);
    }

    function abrirLogin() {
        if (document.querySelector(".login-modal")) return;

        const modal = document.createElement("div");
        modal.className = "login-modal";

        modal.innerHTML = `
            <section class="login-box" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
                <button type="button" class="login-close" id="cerrarLogin" aria-label="Cerrar">×</button>
                <aside class="login-brand-panel" style="--login-hospital:url('${HOSPITAL_FOTO_URL}')">
                    <img class="login-brand-logo" src="${LOGO_UADI_URL}" alt="UADI">
                    <p class="login-brand-name">Unidad de Apoyo a la<br>Docencia e Investigación</p>
                    <div class="login-hospital-photo" role="img" aria-label="Hospital San José de Chincha"></div>
                    <blockquote>“Formación, investigación<br>y desarrollo en salud”</blockquote>
                    <div class="login-brand-points" aria-hidden="true"><span>✧</span><span>⚕</span><span>♧</span></div>
                </aside>
                <div class="login-form-panel">
                    <div class="login-official-logos"><img src="${LOGO_HOSPITAL_URL}" alt="Hospital San José de Chincha"><i></i><img src="${LOGO_UADI_URL}" alt="UADI"></div>
                    <div class="login-heading"><span class="login-user-icon" aria-hidden="true">♙</span><div><h2 id="loginTitle">Acceso al Portal UADI</h2><p>Ingresa tus credenciales para continuar.</p></div></div>
                    <div class="login-heading-line"></div>
                    <form id="formLogin">
                        <div class="login-field login-input-wrap"><label class="sr-only" for="loginCorreo">Correo electrónico</label><span aria-hidden="true">✉</span><input type="email" id="loginCorreo" placeholder="Correo electrónico" autocomplete="username" required></div>
                        <div class="login-field login-input-wrap"><label class="sr-only" for="loginPassword">Contraseña</label><span aria-hidden="true">♙</span><input type="password" id="loginPassword" placeholder="Contraseña" autocomplete="current-password" required><button type="button" id="togglePassword" aria-label="Mostrar contraseña" title="Mostrar contraseña">◉</button></div>
                        <div class="login-options"><label><input type="checkbox" id="rememberEmail"> <span>Recordar mi correo</span></label><button type="button" id="forgotPassword">¿Olvidaste tu contraseña?</button></div>
                        <div id="loginError" class="login-error" role="alert" aria-live="polite"></div>
                        <button type="submit" class="login-submit"><span aria-hidden="true">↪</span> Iniciar sesión <b aria-hidden="true">→</b></button>
                    </form>
                    <p class="login-register">Acceso exclusivo para personal autorizado del Hospital San José de Chincha.</p>
                    <div class="login-health-mark" aria-hidden="true"><span></span>♡<span>✚</span></div>
                </div>
            </section>`;

        document.body.appendChild(modal);

        const formulario = modal.querySelector("#formLogin");
        const cerrar = modal.querySelector("#cerrarLogin");
        const correoInput = modal.querySelector("#loginCorreo");
        const passwordInput = modal.querySelector("#loginPassword");
        const mensaje = modal.querySelector("#loginError");
        const botonEnviar = modal.querySelector(".login-submit");
        const mostrarContrasena = modal.querySelector("#togglePassword");
        const recordarCorreo = modal.querySelector("#rememberEmail");
        const correoGuardado = localStorage.getItem("uadi-login-email");
        if (correoGuardado) {
            correoInput.value = correoGuardado;
            recordarCorreo.checked = true;
        }

        mostrarContrasena.addEventListener("click", () => {
            const visible = passwordInput.type === "text";
            passwordInput.type = visible ? "password" : "text";
            mostrarContrasena.setAttribute("aria-label", visible ? "Mostrar contraseña" : "Ocultar contraseña");
            mostrarContrasena.title = visible ? "Mostrar contraseña" : "Ocultar contraseña";
        });

        modal.querySelector("#forgotPassword").addEventListener("click", async () => {
            const email = correoInput.value.trim();
            if (!email) {
                mensaje.textContent = "Escribe tu correo institucional para solicitar el enlace de recuperación.";
                correoInput.focus();
                return;
            }
            const botonRecuperar = modal.querySelector("#forgotPassword");
            botonRecuperar.disabled = true;
            mensaje.textContent = "Enviando solicitud de recuperación…";
            try {
                const { supabase } = await import("./supabase.js");
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/paginas/admin.html?password-reset=1`
                });
                if (error) throw error;
                mensaje.textContent = "Si el correo está registrado, recibirás instrucciones para restablecer la contraseña.";
            } catch (error) {
                mensaje.textContent = error.message || "No se pudo enviar la solicitud. Contacta a la administración de UADI.";
            } finally {
                botonRecuperar.disabled = false;
            }
        });

        cerrar.addEventListener("click", () => modal.remove());

        modal.addEventListener("click", (evento) => {
            if (evento.target === modal) modal.remove();
        });

        formulario.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            if (botonEnviar.disabled) return;

            botonEnviar.disabled = true;
            botonEnviar.textContent = "Verificando acceso...";
            mensaje.textContent = "";

            try {
                if (recordarCorreo.checked) localStorage.setItem("uadi-login-email", correoInput.value.trim());
                else localStorage.removeItem("uadi-login-email");
                const modulo = await import("./supabase.js");
                const supabase = modulo.supabase;

                const { data, error } =
                    await supabase.auth.signInWithPassword({
                        email: correoInput.value.trim(),
                        password: passwordInput.value
                    });

                if (error) {
                    throw new Error("Correo o contraseña incorrectos.");
                }

                const { data: perfil, error: errorPerfil } =
                    await supabase
                        .from("profiles")
                        .select("nombre, rol")
                        .eq("id", data.user.id)
                        .single();

                if (errorPerfil || !perfil) {
                    await supabase.auth.signOut();
                    throw new Error(
                        "No se encontró el perfil del usuario en Supabase."
                    );
                }

                if (perfil.rol === "admin") {
                    redirigirAlPanelUADI();
                    return;
                }

                mensaje.textContent =
                    "Tu cuenta no tiene permisos de administrador.";

                await supabase.auth.signOut();

            } catch (error) {
                console.error("Error de inicio de sesión:", error);
                mensaje.textContent =
                    error.message || "No se pudo iniciar sesión.";
            } finally {
                if (modal.isConnected) {
                    botonEnviar.disabled = false;
                    botonEnviar.textContent = "Iniciar sesión";
                }
            }
        });

        correoInput.focus();
    } window.abrirLogin = abrirLogin;

    const parametrosAcceso = new URLSearchParams(window.location.search);
    if (parametrosAcceso.get("acceso") === "admin") {
        const contrasenaRecuperada = parametrosAcceso.get("recuperada") === "1";
        window.history.replaceState({}, "", `${window.location.pathname}${window.location.hash}`);
        abrirLogin();
        if (contrasenaRecuperada) {
            document.querySelector("#loginError").textContent =
                "Contraseña actualizada. Ya puedes iniciar sesión.";
        }
    }

});


ejecutarCuandoDOMListo(function () {

    /* =====================================================
       PANEL ADMINISTRADOR - INVESTIGACIÓN
       ===================================================== */

    const listaProyectosAdmin = document.getElementById(
        "listaProyectosAdmin"
    );

    if (listaProyectosAdmin) {
        const sinProyectosAdmin = document.getElementById(
            "sinProyectosAdmin"
        );

        const totalProyectos = document.getElementById(
            "totalProyectos"
        );

        const proyectosRevision = document.getElementById(
            "proyectosRevision"
        );

        const proyectosAprobados = document.getElementById(
            "proyectosAprobados"
        );

        function actualizarTexto(elemento, texto) {
            if (elemento) elemento.textContent = texto;
        }

        function mostrarProyectoAdmin(registro) {
            listaProyectosAdmin.replaceChildren();

            if (sinProyectosAdmin) {
                sinProyectosAdmin.style.display = "none";
            }

            const estado = registro.estado || "SOLICITUD RECIBIDA";

            const tarjeta = document.createElement("article");
            tarjeta.className = "proyecto-admin-card";

            const encabezado = document.createElement("div");
            encabezado.className = "proyecto-admin-header";

            const titulo = document.createElement("h3");
            titulo.textContent =
                registro.titulo || "Proyecto de investigación";

            const codigo = document.createElement("span");
            codigo.className = "proyecto-codigo";
            codigo.textContent = registro.codigo || "Sin código";

            const estadoElemento = document.createElement("span");
            estadoElemento.className = "estado-proyecto";

            const clasesEstado = {
                "SOLICITUD RECIBIDA": "estado-recibida",
                "EN REVISIÓN": "estado-revision",
                "APROBADO": "estado-aprobado",
                "OBSERVADO": "estado-observado",
                "RECHAZADO": "estado-rechazado",
                "FINALIZADO": "estado-finalizado"
            };

            estadoElemento.classList.add(
                clasesEstado[estado] || "estado-recibida"
            );
            estadoElemento.textContent = estado;

            const informacion = document.createElement("div");
            informacion.className = "proyecto-admin-info";

            const datos = [
                [
                    "👤 Investigador",
                    `${registro.nombres || ""} ${registro.apellidos || ""}`.trim()
                ],
                ["📧 Correo", registro.correo || "No registrado"],
                [
                    "🏫 Universidad / institución",
                    registro.universidad || "No registrada"
                ],
                [
                    "📅 Fecha",
                    registro.fechaRegistro || registro.fecha || "No registrada"
                ]
            ];

            datos.forEach(([etiqueta, valor]) => {
                const bloque = document.createElement("div");

                const nombreDato = document.createElement("strong");
                nombreDato.textContent = etiqueta;

                const valorDato = document.createElement("span");
                valorDato.textContent = valor;

                bloque.append(nombreDato, valorDato);
                informacion.appendChild(bloque);
            });

            const acciones = document.createElement("div");
            acciones.className = "proyecto-admin-actions";

            const botonVer = document.createElement("button");
            botonVer.type = "button";
            botonVer.className = "btn-admin btn-ver";
            botonVer.textContent = "👁 Ver proyecto";
            botonVer.addEventListener("click", () => {
                verProyectoAdmin();
            });

            const botonEstado = document.createElement("button");
            botonEstado.type = "button";
            botonEstado.className = "btn-admin btn-estado";
            botonEstado.textContent = "⚙ Cambiar estado";
            botonEstado.addEventListener("click", () => {
                cambiarEstadoInvestigacion();
            });

            acciones.append(botonVer, botonEstado);
            encabezado.append(titulo, codigo, estadoElemento);

            tarjeta.append(encabezado, informacion, acciones);
            listaProyectosAdmin.appendChild(tarjeta);

            actualizarTexto(totalProyectos, "1");
            actualizarTexto(
                proyectosRevision,
                estado === "EN REVISIÓN" ? "1" : "0"
            );
            actualizarTexto(
                proyectosAprobados,
                estado === "APROBADO" ? "1" : "0"
            );
        }

        function cargarProyectoAdmin() {
            let registro = null;

            try {
                registro = JSON.parse(
                    localStorage.getItem("registroInvestigacion") || "null"
                );
            } catch (error) {
                console.error("No se pudo leer el registro:", error);
            }

            if (!registro) {
                listaProyectosAdmin.replaceChildren();

                if (sinProyectosAdmin) {
                    sinProyectosAdmin.style.display = "block";
                }

                actualizarTexto(totalProyectos, "0");
                actualizarTexto(proyectosRevision, "0");
                actualizarTexto(proyectosAprobados, "0");
                return;
            }

            mostrarProyectoAdmin(registro);
        }

        cargarProyectoAdmin();

        const buscador = document.getElementById("buscarProyectoAdmin");

        if (buscador) {
            buscador.addEventListener("input", function () {
                const texto = this.value.trim().toLowerCase();

                const tarjetas = listaProyectosAdmin.querySelectorAll(
                    ".proyecto-admin-card"
                );

                tarjetas.forEach((tarjeta) => {
                    tarjeta.style.display =
                        tarjeta.textContent.toLowerCase().includes(texto)
                            ? ""
                            : "none";
                });
            });
        }
    }
});

/* =====================================================
   VER PROYECTO ADMINISTRATIVO
   ===================================================== */

function verProyectoAdmin() {
    let registro;

    try {
        registro = JSON.parse(
            localStorage.getItem("registroInvestigacion") || "null"
        );
    } catch (error) {
        registro = null;
    }

    if (!registro) {
        alert("No se encontró ningún proyecto registrado.");
        return;
    }

    alert(
        "PROYECTO DE INVESTIGACIÓN\n\n" +
        "Código: " + (registro.codigo || "No registrado") +
        "\n\nInvestigador: " +
        (registro.nombres || "") + " " + (registro.apellidos || "") +
        "\n\nProyecto: " + (registro.titulo || "No registrado") +
        "\n\nEstado: " + (registro.estado || "SOLICITUD RECIBIDA")
    );
}

/* =====================================================
   CAMBIAR ESTADO DE INVESTIGACIÓN
   ===================================================== */

function cambiarEstadoInvestigacion() {
    let registro;

    try {
        registro = JSON.parse(
            localStorage.getItem("registroInvestigacion") || "null"
        );
    } catch (error) {
        registro = null;
    }

    if (!registro) {
        alert("No se encontró ningún proyecto registrado.");
        return;
    }

    const nuevoEstado = prompt(
        "Escribe el número del nuevo estado:\n\n" +
        "1. SOLICITUD RECIBIDA\n" +
        "2. EN REVISIÓN\n" +
        "3. OBSERVADO\n" +
        "4. APROBADO\n" +
        "5. RECHAZADO\n" +
        "6. FINALIZADO"
    );

    if (nuevoEstado === null) return;

    const estados = {
        "1": "SOLICITUD RECIBIDA",
        "2": "EN REVISIÓN",
        "3": "OBSERVADO",
        "4": "APROBADO",
        "5": "RECHAZADO",
        "6": "FINALIZADO"
    };

    const estado = estados[nuevoEstado.trim()];

    if (!estado) {
        alert("Opción no válida. Escribe un número del 1 al 6.");
        return;
    }

    registro.estado = estado;

    try {
        localStorage.setItem(
            "registroInvestigacion",
            JSON.stringify(registro)
        );

        alert("Estado actualizado: " + estado);
        location.reload();

    } catch (error) {
        console.error("Error al actualizar el estado:", error);
        alert("No se pudo actualizar el estado.");
    }
}

/* =====================================================
   CARRUSEL DE GALERÍA
   ===================================================== */

let indiceGaleria = 0;

function moverGaleria(direccion) {
    const imagenes = document.querySelectorAll(".gallery-item");

    if (imagenes.length === 0) return;

    imagenes.forEach((imagen) => {
        imagen.classList.remove("active");
    });

    indiceGaleria += direccion;

    if (indiceGaleria >= imagenes.length) {
        indiceGaleria = 0;
    }

    if (indiceGaleria < 0) {
        indiceGaleria = imagenes.length - 1;
    }

    imagenes[indiceGaleria].classList.add("active");
}

ejecutarCuandoDOMListo(function () {
    const imagenes = document.querySelectorAll(".gallery-item");

    if (imagenes.length > 0) {
        imagenes.forEach((imagen) => {
            imagen.classList.remove("active");
        });

        imagenes[0].classList.add("active");
        indiceGaleria = 0;
    }
});

/* Mostrar un panel de contenido */

function mostrarContenido(id) {
    document.querySelectorAll(".contenido-panel").forEach((panel) => {
        panel.style.display = "none";
    });

    const panel = document.getElementById(id);

    if (panel) {
        panel.style.display = "block";

        setTimeout(() => {
            panel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 50);
    }
}

/* Cerrar todos los paneles */

function cerrarContenido() {
    document.querySelectorAll(".contenido-panel").forEach((panel) => {
        panel.style.display = "none";
    });
}

