(() => {
  "use strict";

  const R = window.REISE;
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));

  /* ---------- Datum ---------- */
  const parseDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const start = parseDate(R.start);
  const totalDays = Math.max(...R.stationen.map((s) => s.bis));
  const dayDate = (n) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + n - 1);
  const fmt = (d, opts) => d.toLocaleDateString("de-DE", opts);
  const fmtShort = (d) => fmt(d, { day: "numeric", month: "short" });
  const fmtLong = (d) => fmt(d, { day: "numeric", month: "long", year: "numeric" });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tripDay = Math.round((today - start) / 86400000) + 1; // <1 vorher, >totalDays danach
  const currentStation = R.stationen.find((s) => tripDay >= s.von && tripDay <= s.bis);

  const stationById = Object.fromEntries(R.stationen.map((s, i) => [s.id, { ...s, nr: i + 1 }]));
  const stationLabel = (id) => stationById[id]?.name ?? "Vorbereitung";

  /* ---------- Texte aus der Konfiguration ---------- */
  document.title = `${R.titel} · Reisetagebuch`;
  document.querySelectorAll("[data-titel]").forEach((el) => (el.textContent = R.titel));
  $("#hero-untertitel").textContent = R.untertitel;
  $("#hero-daten").textContent = `${fmtShort(start)} – ${fmtLong(dayDate(totalDays))}`;
  $("#ueber-text").textContent = R.ueberUns;
  $("#footer-autoren").textContent = R.autoren;

  /* ---------- Ortszeit (Japan bzw. aktuelle Station) ---------- */
  const clock = $("#jp-clock");
  const zeitzone = currentStation?.zeitzone ?? "Asia/Tokyo";
  const ortName = zeitzone === "Asia/Tokyo" ? "Japan" : currentStation.name;
  $(".clock-label").textContent = ortName;
  $(".clock").title = `Aktuelle Uhrzeit in ${ortName}`;
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString("de-DE", {
      timeZone: zeitzone, hour: "2-digit", minute: "2-digit"
    });
  };
  tick(); setInterval(tick, 20000);

  /* ---------- Status im Hero ---------- */
  const stat = (value, label) =>
    `<div class="stat"><div class="stat-value">${esc(value)}</div><div class="stat-label">${esc(label)}</div></div>`;

  let statusHtml;
  if (tripDay < 1) {
    const d = 1 - tripDay;
    statusHtml = stat(d, d === 1 ? "Tag bis zur Ankunft in Japan" : "Tage bis zur Ankunft in Japan") +
      stat(totalDays, "Reisetage") + stat(R.stationen.length, "Stationen");
  } else if (tripDay <= totalDays) {
    statusHtml = stat(`Tag ${tripDay}`, `von ${totalDays}`) +
      stat(currentStation?.name ?? "unterwegs", "Hier sind wir gerade") +
      stat(totalDays - tripDay, "Tage verbleibend");
  } else {
    statusHtml = stat("Zurück", "Wieder zu Hause") + stat(totalDays, "Reisetage") +
      stat(R.stationen.length, "Stationen");
  }
  $("#status").innerHTML = statusHtml;

  $("#trip-bar").innerHTML = R.stationen.map((s) => {
    const state = tripDay > s.bis ? "done" : tripDay >= s.von ? "now" : "";
    const days = s.bis - s.von + 1;
    const label = days >= 3 ? s.name : days === 2 ? s.name.split(/[ &]/)[0] : s.kanji;
    return `<div class="trip-seg ${state}" style="flex:${days}" title="${esc(s.name)}"><span>${esc(label)}</span></div>`;
  }).join("");

  /* ---------- Zeitleiste ---------- */
  const daysText = (s) => {
    const tage = s.von === s.bis ? `Tag ${s.von}` : `Tag ${s.von}–${s.bis}`;
    const datum = s.von === s.bis ? fmtShort(dayDate(s.von)) : `${fmtShort(dayDate(s.von))} – ${fmtShort(dayDate(s.bis))}`;
    return `${tage} · ${datum}`;
  };

  $("#timeline").innerHTML = R.stationen.map((s) => `
    <li>
      <button class="stop${s === currentStation ? " now" : ""}" data-station="${esc(s.id)}">
        <span class="stop-kanji" aria-hidden="true">${esc(s.kanji)}</span>
        <span>
          <span class="stop-title">
            <strong>${esc(s.name)}</strong>
            ${s === currentStation ? '<span class="badge">Jetzt hier</span>' : ""}
            <span class="stop-days">${esc(daysText(s))}</span>
          </span>
          <p class="stop-info">${esc(s.info)}</p>
          ${s.ausfluege?.length ? `<p class="stop-extra">Ausflüge: ${esc(s.ausfluege.map((a) => a.name).join(", "))}</p>` : ""}
        </span>
      </button>
    </li>`).join("");

  $("#timeline").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-station]");
    if (!btn) return;
    selectStation(btn.dataset.station, { scrollToPosts: true });
  });

  /* ---------- Karte ---------- */
  let map = null;
  let homeBounds = null;
  const markers = {};
  if (window.L) {
    map = L.map("map", { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Landweg als gestrichelte Linie, Flüge zu Fernzielen dünn gepunktet
    const pts = R.stationen.map((s) => [s.lat, s.lng]);
    R.stationen.slice(1).forEach((s, i) => {
      const flug = s.fernziel || R.stationen[i].fernziel;
      L.polyline([pts[i], pts[i + 1]], flug
        ? { color: "#2f3e63", weight: 2, opacity: .6, dashArray: "2 8" }
        : { color: "#c8412c", weight: 3, opacity: .75, dashArray: "6 8" }).addTo(map);
    });

    R.stationen.forEach((s) => (s.ausfluege || []).forEach((a) => {
      L.polyline([[s.lat, s.lng], [a.lat, a.lng]], { color: "#c8412c", weight: 1.5, opacity: .45, dashArray: "2 6" }).addTo(map);
      L.marker([a.lat, a.lng], {
        icon: L.divIcon({ className: "", html: '<div class="map-dot"></div>', iconSize: [14, 14], iconAnchor: [7, 7] }),
        title: a.name
      }).addTo(map).bindPopup(`<strong>${esc(a.name)}</strong><br><small>${esc(a.info || `Ausflug ab ${s.name}`)}</small>`);
    }));

    R.stationen.forEach((s, i) => {
      const icon = L.divIcon({ className: "", html: `<div class="map-pin">${i + 1}</div>`, iconSize: [28, 28], iconAnchor: [14, 14] });
      markers[s.id] = L.marker([s.lat, s.lng], { icon, title: s.name })
        .addTo(map)
        .bindPopup(`<strong>${esc(s.name)}</strong><br><small>${esc(daysText(s))}</small>`)
        .on("click", () => selectStation(s.id));
    });
    homeBounds = L.latLngBounds(R.stationen.filter((s) => !s.fernziel)
      .flatMap((s) => [[s.lat, s.lng], ...(s.ausfluege || []).map((a) => [a.lat, a.lng])]));
    map.fitBounds(homeBounds, { padding: [30, 30] });
  } else {
    $("#map").innerHTML = '<p class="muted" style="padding:20px">Die Karte konnte nicht geladen werden.</p>';
  }

  /* ---------- Beiträge laden ---------- */
  const frontMatter = (text) => {
    const m = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
    if (!m) return { meta: {}, body: text };
    const meta = {};
    m[1].split(/\r?\n/).forEach((line) => {
      const i = line.indexOf(":");
      if (i < 1) return;
      meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    });
    return { meta, body: text.slice(m[0].length) };
  };

  const firstParagraph = (md) => {
    const para = md.split(/\n\s*\n/).map((p) => p.trim())
      .find((p) => p && !/^(#|!\[|>|---|\||<)/.test(p)) || "";
    const plain = para.replace(/!\[.*?\]\(.*?\)/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1").replace(/[*_`#]/g, "");
    return plain.length > 170 ? plain.slice(0, 170).replace(/\s+\S*$/, "") + " …" : plain;
  };

  const renderMarkdown = (md) => window.marked
    ? marked.parse(md)
    : md.split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join("");

  let posts = [];

  async function loadPosts() {
    const list = await fetch("posts/index.json", { cache: "no-cache" }).then((r) => r.json());
    const results = await Promise.allSettled(list.map(async (file) => {
      const res = await fetch(`posts/${file}`, { cache: "no-cache" });
      if (!res.ok) throw new Error(`${file}: ${res.status}`);
      const { meta, body } = frontMatter(await res.text());
      return {
        slug: file.replace(/\.md$/, ""),
        titel: meta.titel || file,
        datum: meta.datum || "",
        station: meta.station || "",
        titelbild: meta.titelbild || "",
        teaser: meta.teaser || firstParagraph(body),
        body
      };
    }));
    results.filter((r) => r.status === "rejected").forEach((r) => console.warn("Beitrag fehlt:", r.reason));
    posts = results.filter((r) => r.status === "fulfilled").map((r) => r.value)
      .sort((a, b) => b.datum.localeCompare(a.datum));
  }

  /* ---------- Beitragsliste ---------- */
  let activeFilter = "alle";

  const postDate = (p) => (p.datum ? fmtLong(parseDate(p.datum)) : "");
  const cover = (p) => p.titelbild
    ? `<img src="${esc(p.titelbild)}" alt="" loading="lazy">`
    : `<div class="cover-kanji" aria-hidden="true">${esc(stationById[p.station]?.kanji ?? "日本")}</div>`;

  function renderFilter() {
    const used = new Set(posts.map((p) => p.station));
    const opts = [["alle", "Alle Beiträge"]];
    if (used.has("") || [...used].some((id) => !stationById[id])) opts.push(["", "Vorbereitung"]);
    R.stationen.forEach((s) => used.has(s.id) && opts.push([s.id, s.name]));
    if (activeFilter !== "alle" && !opts.some(([id]) => id === activeFilter)) {
      opts.push([activeFilter, stationLabel(activeFilter)]);
    }
    $("#filter").innerHTML = opts.map(([id, label]) =>
      `<button class="chip" data-filter="${esc(id)}" aria-pressed="${id === activeFilter}">${esc(label)}</button>`
    ).join("");
  }

  function renderPosts() {
    const matches = (p) => activeFilter === "alle" ||
      (activeFilter === "" ? !stationById[p.station] : p.station === activeFilter);
    const shown = posts.filter(matches);

    $("#posts").innerHTML = shown.map((p) => `
      <a class="card" href="#beitrag/${encodeURIComponent(p.slug)}">
        <div class="card-cover">${cover(p)}</div>
        <div class="card-body">
          <div class="card-meta"><span class="badge soft">${esc(stationLabel(p.station))}</span><span>${esc(postDate(p))}</span></div>
          <h3>${esc(p.titel)}</h3>
          <p>${esc(p.teaser)}</p>
        </div>
      </a>`).join("");

    const empty = $("#posts-empty");
    empty.hidden = shown.length > 0;
    if (!shown.length) {
      empty.textContent = activeFilter === "alle"
        ? "Noch keine Beiträge – bald geht es los!"
        : `Zu ${stationLabel(activeFilter)} gibt es noch keine Beiträge. Schaut bald wieder vorbei!`;
    }
    renderFilter();
  }

  $("#filter").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (btn) selectStation(btn.dataset.filter);
  });

  function selectStation(id, { scrollToPosts = false } = {}) {
    activeFilter = activeFilter === id && id !== "alle" ? "alle" : id;
    document.querySelectorAll(".stop").forEach((el) =>
      el.classList.toggle("active", el.dataset.station === activeFilter));
    Object.entries(markers).forEach(([sid, m]) =>
      m.getElement()?.firstChild?.classList.toggle("active", sid === activeFilter));
    if (map && markers[activeFilter]) {
      const s = stationById[activeFilter];
      map.flyTo(markers[activeFilter].getLatLng(), s.fernziel ? 11 : Math.min(Math.max(map.getZoom(), 7), 9), { duration: .8 });
    } else if (map && homeBounds) {
      map.flyToBounds(homeBounds, { padding: [30, 30], duration: .8 });
    }
    renderPosts();
    if (scrollToPosts) $("#tagebuch").scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Einzelansicht ---------- */
  const startView = $("#start-view");
  const postView = $("#post-view");
  let savedScroll = 0;

  function showPost(slug) {
    const i = posts.findIndex((p) => p.slug === slug);
    const p = posts[i];
    if (startView.hidden === false) savedScroll = window.scrollY;
    startView.hidden = true;
    postView.hidden = false;

    if (!p) {
      postView.innerHTML = `<a class="back" href="#tagebuch">← Zurück</a><h1>Beitrag nicht gefunden</h1>
        <p class="muted">Diesen Beitrag gibt es (noch) nicht.</p>`;
      window.scrollTo(0, 0);
      return;
    }

    const newer = posts[i - 1];
    const older = posts[i + 1];
    document.title = `${p.titel} · ${R.titel}`;
    postView.innerHTML = `
      <a class="back" href="#tagebuch">← Alle Beiträge</a>
      <header class="post-header">
        <div class="card-meta"><span class="badge soft">${esc(stationLabel(p.station))}</span><span>${esc(postDate(p))}</span></div>
        <h1>${esc(p.titel)}</h1>
      </header>
      ${p.titelbild ? `<img class="post-cover" src="${esc(p.titelbild)}" alt="">` : ""}
      <div class="post-body">${renderMarkdown(p.body)}</div>
      <nav class="post-nav" aria-label="Weitere Beiträge">
        ${older ? `<a class="prev" href="#beitrag/${encodeURIComponent(older.slug)}"><small>← Vorheriger Beitrag</small>${esc(older.titel)}</a>` : ""}
        ${newer ? `<a class="next" href="#beitrag/${encodeURIComponent(newer.slug)}"><small>Nächster Beitrag →</small>${esc(newer.titel)}</a>` : ""}
      </nav>`;
    postView.querySelectorAll(".post-body img").forEach((img) => (img.loading = "lazy"));
    window.scrollTo(0, 0);
  }

  function showStart() {
    const wasHidden = startView.hidden;
    postView.hidden = true;
    startView.hidden = false;
    document.title = `${R.titel} · Reisetagebuch`;
    if (wasHidden) map?.invalidateSize();
    const target = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
    else if (wasHidden) window.scrollTo(0, savedScroll);
  }

  function route() {
    const m = location.hash.match(/^#beitrag\/(.+)$/);
    if (m) showPost(decodeURIComponent(m[1]));
    else showStart();
  }
  window.addEventListener("hashchange", route);

  /* ---------- Lightbox für Fotos ---------- */
  const lightbox = $("#lightbox");
  postView.addEventListener("click", (e) => {
    const img = e.target.closest(".post-body img");
    if (!img) return;
    lightbox.querySelector("img").src = img.currentSrc || img.src;
    lightbox.querySelector("img").alt = img.alt;
    lightbox.hidden = false;
  });
  const closeLightbox = () => (lightbox.hidden = true);
  lightbox.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeLightbox());

  /* ---------- Los geht's ---------- */
  loadPosts()
    .catch((err) => {
      console.error(err);
      $("#posts-empty").hidden = false;
      $("#posts-empty").textContent = location.protocol === "file:"
        ? "Die Beiträge können nicht direkt aus der Datei geladen werden – bitte über einen Webserver öffnen (siehe README)."
        : "Die Beiträge konnten gerade nicht geladen werden.";
    })
    .finally(() => {
      if (posts.length || $("#posts-empty").hidden) renderPosts();
      route();
    });
})();
