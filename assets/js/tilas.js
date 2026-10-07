/* TILAS — small scripts, no libraries.
   1. Menu on phones and tablets
   2. Video: the player loads only when the reader presses play
   3. Audio player
   4. Lists, filters and search (read assets/data/content.json or content.ar.json) */
(function () {
  "use strict";
  var doc = document.documentElement;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  /* ---------- 1. Menu ---------- */
  var menuBtn = document.querySelector("[data-menu-button]");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    var menuLabel = menuBtn.querySelector("[data-label-open]");
    var setOpen = function (open) {
      menuBtn.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      doc.classList.toggle("menu-open", open);
      if (menuLabel) menuLabel.textContent = menuLabel.getAttribute(open ? "data-label-close" : "data-label-open");
    };
    menuBtn.addEventListener("click", function () { setOpen(menuBtn.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") { setOpen(false); menuBtn.focus(); }
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    if (window.matchMedia) {
      var wide = window.matchMedia("(min-width: 1024px)");
      if (wide.addEventListener) wide.addEventListener("change", function () { if (wide.matches) setOpen(false); });
    }
  }

  /* ---------- 2. Video ---------- */
  each(document.querySelectorAll("[data-video]"), function (box) {
    var btn = box.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var id = (box.getAttribute("data-id") || "").trim();
      var note = box.querySelector("[data-note]");
      if (!id) { if (note) note.hidden = false; return; }
      var src = box.getAttribute("data-provider") === "vimeo"
        ? "https://player.vimeo.com/video/" + encodeURIComponent(id) + "?autoplay=1&dnt=1"
        : "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
      var frame = document.createElement("iframe");
      frame.className = "video-iframe";
      frame.src = src;
      frame.title = box.getAttribute("data-title") || "";
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.setAttribute("allowfullscreen", "");
      box.textContent = "";
      box.appendChild(frame);
    });
  });

  /* ---------- 3. Audio ---------- */
  var players = [];
  var fmt = function (s) {
    if (!isFinite(s)) return "0:00";
    s = Math.floor(s);
    var sec = s % 60;
    return Math.floor(s / 60) + ":" + (sec < 10 ? "0" : "") + sec;
  };
  each(document.querySelectorAll("[data-audio]"), function (box) {
    var audio = box.querySelector("audio");
    var btn = box.querySelector("[data-audio-toggle]");
    var range = box.querySelector("input[type=range]");
    var cur = box.querySelector("[data-current]");
    var dur = box.querySelector("[data-duration]");
    var note = box.querySelector("[data-note]");
    if (!audio || !btn) return;
    var name = btn.getAttribute("data-name") || "";
    var hasSrc = !!audio.getAttribute("src");
    players.push(audio);
    if (!hasSrc && range) range.disabled = true;
    var set = function (playing) {
      box.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-label", btn.getAttribute(playing ? "data-pause" : "data-play") + (name ? ": " + name : ""));
    };
    var fail = function () { if (note) note.hidden = false; set(false); };
    btn.addEventListener("click", function () {
      if (!hasSrc) { fail(); return; }
      if (audio.paused) {
        players.forEach(function (p) { if (p !== audio) p.pause(); });
        var promise = audio.play();
        if (promise && promise.catch) promise.catch(fail);
      } else {
        audio.pause();
      }
    });
    audio.addEventListener("play", function () { set(true); });
    audio.addEventListener("pause", function () { set(false); });
    audio.addEventListener("error", fail);
    audio.addEventListener("ended", function () { set(false); if (range) range.value = 0; });
    audio.addEventListener("loadedmetadata", function () { if (dur) dur.textContent = fmt(audio.duration); });
    audio.addEventListener("timeupdate", function () {
      if (!audio.duration) return;
      if (range) range.value = (audio.currentTime / audio.duration) * 100;
      if (cur) cur.textContent = fmt(audio.currentTime);
    });
    if (range) range.addEventListener("input", function () {
      if (audio.duration) audio.currentTime = (range.value / 100) * audio.duration;
    });
  });

  /* ---------- 4. Lists, filters and search ---------- */
  var list = document.querySelector("[data-list]");
  if (!list) return;

  var root = document.body.getAttribute("data-root") || "";
  var mode = list.getAttribute("data-list");          /* magazine | media | archive | search */
  var L = function (key) { return list.getAttribute("data-l-" + key) || ""; };
  var countEl = document.querySelector("[data-count]");
  var input = document.querySelector("[data-query]");
  var form = document.querySelector("[data-search-form]");
  var params = new URLSearchParams(location.search);

  var ICONS = {
    image: '<rect x="3" y="5" width="18" height="14" rx="1"></rect><circle cx="9" cy="10" r="1.6"></circle><path d="M21 16l-5-5-8 8"></path>',
    document: '<path d="M6 3h9l4 4v14H6z"></path><path d="M15 3v4h4"></path><path d="M9 12h7M9 16h7"></path>',
    poster: '<rect x="6" y="3" width="12" height="18" rx="1"></rect><path d="M9 8h6M9 12h6"></path>',
    object: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"></path><path d="M4 7.5l8 4.5 8-4.5M12 12v9"></path>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"></path><rect x="3" y="14" width="4" height="6" rx="1"></rect><rect x="17" y="14" width="4" height="6" rx="1"></rect>',
    video: '<rect x="3" y="5" width="18" height="14" rx="1"></rect><path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none"></path>'
  };
  var ARCHIVE_ICON = { photo: "image", document: "document", poster: "poster", object: "object", recording: "headphones" };
  var icon = function (name, size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  };
  var PLAY = '<span class="play" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13l10.5-6.5z" fill="currentColor"></path></svg></span>';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function tile(a) {
    var li = el("li");
    var link = el("a", "tile-link");
    link.href = root + a.url;
    var media;
    if (a.kind === "media") {
      media = el("div", "tile-media r-16-9 ph-dark");
      if (a.type === "audio") media.innerHTML = icon("headphones", 32);
      else if (a.type === "photos") media.innerHTML = icon("image", 32);
      else {
        media.innerHTML = PLAY;
        if (a.duration) media.appendChild(el("span", "duration", a.duration));
      }
    } else if (a.kind === "archive") {
      media = el("div", "tile-media r-1-1 ph-icon");
      media.innerHTML = icon(ARCHIVE_ICON[a.type] || "image", 32);
    } else if (a.image) {
      media = el("div", "tile-media r-4-3 " + (a.fit === "contain" ? "drawing" : "cover"));
      var img = el("img");
      img.src = root + a.image;
      img.alt = "";
      img.loading = "lazy";
      media.appendChild(img);
    } else {
      media = el("div", "tile-media r-4-3 ph-icon");
      media.innerHTML = icon("image", 32);
    }
    link.appendChild(media);
    link.appendChild(el("p", "label", a.label));
    link.appendChild(el("h2", "tile-title", a.title));
    var meta = el("p", "tile-meta");
    meta.appendChild(el("span", "", a.meta));
    (a.badges || []).forEach(function (b) {
      var s = el("span", "badge");
      s.innerHTML = icon(b === "video" ? "video" : "headphones", 15);
      s.appendChild(document.createTextNode(L(b)));
      meta.appendChild(s);
    });
    link.appendChild(meta);
    li.appendChild(link);
    return li;
  }

  function render(items, emptyText) {
    list.textContent = "";
    if (!items.length) { list.appendChild(el("li", "empty", emptyText)); }
    else items.forEach(function (a) { list.appendChild(tile(a)); });
    if (countEl) {
      var n = items.length;
      countEl.textContent = (n === 1 ? L("count-one") : L("count-many")).replace("{n}", n);
    }
  }

  /* Lowercase, remove accents and Arabic diacritics, unify alef / ya / ta marbuta */
  function normalize(s) {
    return String(s).toLowerCase().normalize("NFD")
      .replace(/[̀-ًͯ-ٰٟ]/g, "")
      .replace(/[آأإ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه");
  }

  /* Filter buttons: <div data-filter="subject" data-field="subject"><button data-value="all">… */
  var groups = [];
  each(document.querySelectorAll("[data-filter]"), function (g) {
    var key = g.getAttribute("data-filter");
    var buttons = g.querySelectorAll("button[data-value]");
    var wanted = params.get(key);
    var value = "all";
    each(buttons, function (b) { if (b.getAttribute("data-value") === wanted) value = wanted; });
    var group = { key: key, field: g.getAttribute("data-field") || key, value: value };
    groups.push(group);
    var mark = function () { each(buttons, function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-value") === group.value)); }); };
    mark();
    each(buttons, function (b) {
      b.addEventListener("click", function () {
        group.value = b.getAttribute("data-value");
        mark();
        var p = new URLSearchParams(location.search);
        if (group.value === "all") p.delete(key); else p.set(key, group.value);
        var qs = p.toString();
        history.replaceState(null, "", qs ? "?" + qs : location.pathname);
        update();
      });
    });
  });

  var all = [];
  var index = [];

  function update() {
    if (mode === "search") {
      var raw = input.value.trim();
      var words = normalize(raw).split(/\s+/).filter(Boolean);
      var hits = all.filter(function (a, i) {
        return words.every(function (w) { return index[i].indexOf(w) !== -1; });
      });
      render(hits, L("none").replace("{q}", raw));
      return;
    }
    var shown = all.filter(function (a) {
      if (a.kind !== mode) return false;
      return groups.every(function (g) { return g.value === "all" || a[g.field] === g.value; });
    });
    render(shown, L("empty"));
  }

  fetch(root + list.getAttribute("data-src"))
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      all = data.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
      index = all.map(function (a) {
        return normalize([a.title, a.sub, a.label, a.meta].concat(a.tags || []).join(" "));
      });
      if (mode === "search" && input && form) {
        var q = params.get("q");
        if (q) input.value = q;
        input.addEventListener("input", update);
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var v = input.value.trim();
          history.replaceState(null, "", v ? "?q=" + encodeURIComponent(v) : location.pathname);
          update();
        });
      }
      update();
    })
    .catch(function () { render([], L("error")); });
})();
