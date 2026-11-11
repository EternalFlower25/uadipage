import { supabase } from "../supabase.js";

const $ = (selector) => document.querySelector(selector);
const adminApp = $("#adminApp");
const rows = $("#contentRows"), tableStatus = $("#tableStatus"), modal = $("#contentModal");
const passwordResetModal = $("#passwordResetModal");
const kindNames = { news: "Noticia", gallery: "Galería", slide: "Carrusel", knowledge: "Información" };
let entries = [], currentKind = "";

function message(element, text, ok = false) {
  element.textContent = text;
  if (ok) element.dataset.ok = "true"; else delete element.dataset.ok;
}

function redirectToPortalLogin() {
  window.location.replace(`${window.location.origin}/?acceso=admin`);
}

async function verifyAdmin(user) {
  const { data: profile, error } = await supabase.from("profiles").select("nombre, rol").eq("id", user.id).single();
  if (error || profile?.rol !== "admin") {
    await supabase.auth.signOut();
    redirectToPortalLogin();
    return;
  }
  adminApp.classList.remove("hidden");
  const welcome = $("#welcomeTitle");
  if (profile.nombre) welcome.textContent = `Bienvenida, ${profile.nombre}`;
  await Promise.all([loadContent(), loadSettings()]);
}

async function loadContent() {
  tableStatus.textContent = "Cargando contenido…";
  const { data, error } = await supabase.from("site_content").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) {
    entries = [];
    tableStatus.textContent = error.message.includes("schema cache") || error.code === "42P01"
      ? "No se encontró la tabla site_content. Ejecuta el SQL de configuración de UADI en Supabase."
      : `No se pudo cargar el contenido: ${error.message}`;
    renderContent();
    return;
  }
  entries = data || [];
  tableStatus.textContent = `${entries.length} elemento${entries.length === 1 ? "" : "s"} en el sitio. La fecha mostrada es la fecha de registro.`;
  renderContent();
}

function renderContent() {
  const query = $("#searchInput").value.trim().toLocaleLowerCase("es");
  const kind = currentKind || $("#kindFilter").value;
  const status = $("#statusFilter").value;
  const filtered = entries.filter((item) => {
    const matchText = `${item.title || ""} ${item.body || ""}`.toLocaleLowerCase("es").includes(query);
    const matchKind = !kind || item.kind === kind;
    const matchStatus = !status || (status === "published" ? item.published : !item.published);
    return matchText && matchKind && matchStatus;
  });
  rows.replaceChildren();
  $("#emptyState").classList.toggle("hidden", filtered.length > 0);
  for (const item of filtered) {
    const tr = document.createElement("tr");
    const title = document.createElement("td"); title.textContent = item.title || "Sin título";
    const kindCell = document.createElement("td");
    const kindTag = document.createElement("span"); kindTag.className = "kind"; kindTag.textContent = kindNames[item.kind] || item.kind || "—"; kindCell.append(kindTag);
    const date = document.createElement("td"); date.textContent = item.created_at ? new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(new Date(item.created_at)) : "—";
    const state = document.createElement("td"); const badge = document.createElement("span"); badge.className = `badge${item.published ? "" : " draft"}`; badge.textContent = item.published ? "Publicado" : "Borrador"; state.append(badge);
    const actions = document.createElement("td"); const actionGroup = document.createElement("div"); actionGroup.className = "actions";
    const edit = document.createElement("button"); edit.className = "icon-btn"; edit.type = "button"; edit.title = "Editar"; edit.textContent = "✎"; edit.addEventListener("click", () => openModal(item));
    const remove = document.createElement("button"); remove.className = "icon-btn delete"; remove.type = "button"; remove.title = "Eliminar"; remove.textContent = "⌫"; remove.addEventListener("click", () => deleteContent(item));
    actionGroup.append(edit, remove); actions.append(actionGroup); tr.append(title, kindCell, date, state, actions); rows.append(tr);
  }
}

function selectKind(kind) {
  currentKind = kind;
  $("#kindFilter").value = kind;
  $("#listTitle").textContent = `▱　${kind ? kindNames[kind] + (kind === "news" ? "s" : "") : "Contenido del sitio"}`;
  document.querySelectorAll(".nav button").forEach((button) => button.classList.toggle("active", button.dataset.kind === kind));
  $("#contactView").classList.add("hidden");
  $("#coverView").classList.add("hidden");
  $("#aboutView").classList.add("hidden");
  renderContent();
}

function openModal(item = null, kind = "news") {
  $("#contentForm").reset();
  $("#contentId").value = item?.id ?? "";
  $("#contentKind").value = item?.kind || kind;
  $("#contentTitle").value = item?.title || "";
  $("#contentBody").value = item?.body || "";
  $("#contentLink").value = item?.link_url || "";
  $("#contentPublished").checked = Boolean(item?.published);
  $("#contentImage").value = "";
  $("#modalTitle").textContent = item ? "Editar contenido" : `Nuevo contenido · ${kindNames[kind] || "UADI"}`;
  message($("#modalStatus"), "");
  modal.classList.remove("hidden");
  $("#contentTitle").focus();
}

function closeModal() { modal.classList.add("hidden"); }

async function uploadImage(file) {
  if (!file) return null;
  if (file.size > 5 * 1024 * 1024) throw new Error("La imagen supera el límite de 5 MB.");
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Usa una imagen JPG, PNG o WebP.");
  const safeName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from("uadi-media").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) {
    if (/bucket/i.test(error.message)) throw new Error("Falta crear o habilitar el bucket público “uadi-media” en Supabase Storage.");
    throw new Error(`No se pudo subir la imagen: ${error.message}`);
  }
  const { data } = supabase.storage.from("uadi-media").getPublicUrl(path);
  return data.publicUrl;
}

$("#contentForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const save = $("#saveContent"); save.disabled = true; save.textContent = "Guardando…";
  const status = $("#modalStatus"); message(status, "");
  try {
    const kind = $("#contentKind").value;
    const old = entries.find((entry) => String(entry.id) === $("#contentId").value);
    const file = $("#contentImage").files[0];
    if (!file && !old?.image_url && ["gallery", "slide"].includes(kind)) throw new Error("Esta sección necesita una imagen para poder publicarse.");
    const imageUrl = await uploadImage(file);
    const payload = {
      kind,
      title: $("#contentTitle").value.trim(),
      body: $("#contentBody").value.trim(),
      image_url: imageUrl || old?.image_url || "",
      link_url: $("#contentLink").value.trim(),
      published: $("#contentPublished").checked
    };
    const id = $("#contentId").value;
    const result = id
      ? await supabase.from("site_content").update(payload).eq("id", id)
      : await supabase.from("site_content").insert(payload);
    if (result.error) throw new Error(result.error.message);
    closeModal(); await loadContent();
  } catch (error) { message(status, error.message || "No se pudo guardar el contenido."); }
  finally { save.disabled = false; save.textContent = "Guardar contenido"; }
});

async function deleteContent(item) {
  if (!window.confirm(`¿Eliminar “${item.title || "este contenido"}”? Esta acción no se puede deshacer.`)) return;
  const { error } = await supabase.from("site_content").delete().eq("id", item.id);
  if (error) { tableStatus.textContent = `No se pudo eliminar: ${error.message}`; return; }
  await loadContent();
}

async function loadSettings() {
  const { data, error } = await supabase.from("site_settings").select("setting_key, setting_value");
  if (error) { tableStatus.textContent = `El contenido funciona, pero no se pudo cargar la configuración de contacto: ${error.message}`; return; }
  for (const setting of data || []) {
    const input = document.getElementById(setting.setting_key);
    if (input && ["hero_badge", "hero_title", "hero_subtitle", "about_video_url", "about_description", "about_mission", "about_vision", "about_objective", "contact_address", "contact_phone", "contact_email", "contact_hours"].includes(setting.setting_key)) input.value = setting.setting_value || "";
  }
}

$("#saveSettings").addEventListener("click", async () => {
  const keys = ["contact_address", "contact_phone", "contact_email", "contact_hours"];
  const values = keys.map((setting_key) => ({ setting_key, setting_value: document.getElementById(setting_key).value.trim() }));
  const button = $("#saveSettings"); button.disabled = true; button.textContent = "Guardando…";
  const { error } = await supabase.from("site_settings").upsert(values, { onConflict: "setting_key" });
  button.disabled = false; button.textContent = "Guardar datos";
  message($("#settingsStatus"), error ? `No se guardó la información de contacto: ${error.message}` : "Datos de contacto guardados correctamente.", !error);
});

$("#saveCoverSettings").addEventListener("click", async () => {
  const keys = ["hero_badge", "hero_title", "hero_subtitle"];
  const values = keys.map((setting_key) => ({ setting_key, setting_value: document.getElementById(setting_key).value.trim() }));
  const button = $("#saveCoverSettings"); button.disabled = true; button.textContent = "Guardando…";
  const { error } = await supabase.from("site_settings").upsert(values, { onConflict: "setting_key" });
  button.disabled = false; button.textContent = "Guardar portada";
  message($("#coverSettingsStatus"), error ? `No se guardó la portada: ${error.message}` : "Texto de portada guardado. Recarga el portal para ver los cambios.", !error);
});

$("#saveAboutSettings").addEventListener("click", async () => {
  const keys = ["about_video_url", "about_description", "about_mission", "about_vision", "about_objective"];
  const values = keys.map((setting_key) => ({ setting_key, setting_value: document.getElementById(setting_key).value.trim() }));
  const button = $("#saveAboutSettings"); button.disabled = true; button.textContent = "Guardando…";
  const { error } = await supabase.from("site_settings").upsert(values, { onConflict: "setting_key" });
  button.disabled = false; button.textContent = "Guardar Conócenos";
  message($("#aboutSettingsStatus"), error ? `No se guardó la información: ${error.message}` : "Información guardada. Recarga la página Conócenos para ver los cambios.", !error);
});

$("#logoutButton").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) { tableStatus.textContent = `No se pudo cerrar sesión: ${error.message}`; return; }
  window.location.replace(`${window.location.origin}/`);
});

document.querySelectorAll("[data-kind]").forEach((button) => button.addEventListener("click", () => {
  const kind = button.dataset.kind; selectKind(kind); if (button.closest(".quick-list")) openModal(null, kind);
}));
document.querySelectorAll('[data-view="contact"]').forEach((button) => button.addEventListener("click", () => {
  currentKind = ""; $("#kindFilter").value = ""; $("#listTitle").textContent = "▱　Contenido del sitio"; $("#contactView").classList.remove("hidden"); $("#coverView").classList.add("hidden"); $("#aboutView").classList.add("hidden");
  document.querySelectorAll(".nav button").forEach((navButton) => navButton.classList.toggle("active", navButton === button));
}));
document.querySelectorAll('[data-view="cover"]').forEach((button) => button.addEventListener("click", () => {
  currentKind = ""; $("#kindFilter").value = ""; $("#listTitle").textContent = "▱　Contenido del sitio"; $("#coverView").classList.remove("hidden"); $("#contactView").classList.add("hidden"); $("#aboutView").classList.add("hidden");
  document.querySelectorAll(".nav button").forEach((navButton) => navButton.classList.toggle("active", navButton === button));
}));
document.querySelectorAll('[data-view="about"]').forEach((button) => button.addEventListener("click", () => {
  currentKind = ""; $("#kindFilter").value = ""; $("#listTitle").textContent = "▱　Contenido del sitio"; $("#aboutView").classList.remove("hidden"); $("#contactView").classList.add("hidden"); $("#coverView").classList.add("hidden");
  document.querySelectorAll(".nav button").forEach((navButton) => navButton.classList.toggle("active", navButton === button));
}));
document.querySelector('[data-view="home"]').addEventListener("click", () => {
  currentKind = ""; $("#kindFilter").value = ""; $("#listTitle").textContent = "▱　Contenido del sitio"; $("#contactView").classList.add("hidden"); $("#coverView").classList.add("hidden"); $("#aboutView").classList.add("hidden");
  document.querySelectorAll(".nav button").forEach((button) => button.classList.toggle("active", button.dataset.view === "home")); renderContent();
});
$("#newContentButton").addEventListener("click", () => openModal(null, currentKind || "news"));
$("#kindFilter").addEventListener("change", () => { currentKind = ""; renderContent(); });
$("#statusFilter").addEventListener("change", renderContent); $("#searchInput").addEventListener("input", renderContent);
$("#closeModal").addEventListener("click", closeModal); $("#cancelModal").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
$("#contentKind").addEventListener("change", (event) => { $("#modalTitle").textContent = `Nuevo contenido · ${kindNames[event.target.value]}`; });

supabase.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") setTimeout(() => passwordResetModal.classList.remove("hidden"), 0);
});

$("#passwordResetForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = $("#newPassword").value;
  if (password !== $("#confirmPassword").value) {
    message($("#resetStatus"), "Las contraseñas no coinciden.");
    return;
  }
  const button = $("#saveNewPassword"); button.disabled = true; button.textContent = "Guardando…";
  try {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    passwordResetModal.classList.add("hidden");
    await supabase.auth.signOut();
    if (data.user) window.location.replace(`${window.location.origin}/?acceso=admin&recuperada=1`);
  } catch (error) {
    message($("#resetStatus"), error.message || "No se pudo actualizar la contraseña.");
  } finally { button.disabled = false; button.textContent = "Guardar contraseña"; }
});

supabase.auth.getSession().then(async ({ data: sessionData }) => {
  if (!sessionData.session?.user) { redirectToPortalLogin(); return; }
  try { await verifyAdmin(sessionData.session.user); }
  catch { redirectToPortalLogin(); }
});
