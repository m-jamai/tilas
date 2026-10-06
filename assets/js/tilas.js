/* TILAS — mobile menu, section lists and search (English and Arabic). */
(function () {
  "use strict";
  var doc = document.documentElement;

  /* ---------- Menu (phones and tablets) ---------- */
  var btn = document.querySelector("[data-menu-button]");
  var nav = document.getElementById("site-nav");
  if (btn && nav) {
    var label = btn.querySelector("[data-label-open]");
    var setOpen = function (open) {
      btn.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      doc.classList.toggle("menu-open", open);
      if (label) label.textContent = open ? label.getAttribute("data-label-close") : label.getAttribute("data-label-open");
    };
    btn.addEventListener("click", function () {
      setOpen(btn.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        btn.focus();
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    if (window.matchMedia) {
      var wide = window.matchMedia("(min-width: 1024px)");
      var onWide = function () { if (wide.matches) setOpen(false); };
      if (wide.addEventListener) wide.addEventListener("change", onWide);
    }
  }

  /* ---------- Lists: section pages and search ---------- */
  var list = document.querySelector("[data-list]");
  if (!list) return;

  var root = document.body.getAttribute("data-root") || "";
  var mode = list.getAttribute("data-list");
  var prefix = list.getAttribute("data-prefix") || "";
  var src = list.getAttribute("data-src");
  var status = document.querySelector("[data-status]");
  var input = document.querySelector("[data-query]");
  var form = document.querySelector("[data-search-form]");

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
    var media = el("div", a.image ? "tile-media drawing" : "tile-media ph");
    if (a.image) {
      var img = el("img");
      img.src = root + a.image;
      img.alt = "";
      img.loading = "lazy";
      media.appendChild(img);
    }
    link.appendChild(media);
    link.appendChild(el("p", "label", a.label));
    link.appendChild(el("h2", "tile-title", a.title));
    li.appendChild(link);
    return li;
  }

  function render(items, emptyText) {
    list.textContent = "";
    if (!items.length) {
      list.appendChild(el("li", "empty", emptyText));
      return;
    }
    items.forEach(function (a) { list.appendChild(tile(a)); });
  }

  /* Lowercase, remove accents and Arabic diacritics, unify alef/ya/ta marbuta */
  function normalize(s) {
    return String(s).toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f\u064B-\u065F\u0670]/g, "")
      .replace(/[\u0622\u0623\u0625]/g, "\u0627")
      .replace(/\u0649/g, "\u064A")
      .replace(/\u0629/g, "\u0647");
  }

  fetch(root + src)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (all) {
      all.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });

      if (mode !== "search") {
        render(all.filter(function (a) { return a.section === mode; }), list.getAttribute("data-empty"));
        return;
      }

      var index = all.map(function (a) {
        return normalize([a.title, a.sub, a.label].concat(a.path || [], a.tags || []).join(" "));
      });
      var noResults = list.getAttribute("data-noresults");
      var resultsLabel = list.getAttribute("data-results");

      function run() {
        var raw = input.value.trim();
        var words = normalize(raw).split(/\s+/).filter(Boolean);
        var hits = all.filter(function (a, i) {
          return words.every(function (w) { return index[i].indexOf(w) !== -1; });
        });
        render(hits, noResults.replace("{q}", raw));
        status.textContent = resultsLabel + ": " + hits.length;
      }

      var q = new URLSearchParams(location.search).get("q");
      if (q) input.value = q;
      input.addEventListener("input", run);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        history.replaceState(null, "", "?q=" + encodeURIComponent(input.value.trim()));
        run();
      });
      run();
    })
    .catch(function () {
      render([], list.getAttribute("data-error"));
    });
})();
