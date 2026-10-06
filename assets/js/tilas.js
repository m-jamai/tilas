/* TILAS — small scripts: mobile menu, section lists and search. */
(function () {
  "use strict";

  /* Mobile menu */
  var btn = document.querySelector("[data-menu-button]");
  var nav = document.getElementById("site-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
  }

  /* Lists: section pages and search read assets/data/articles.json */
  var list = document.querySelector("[data-list]");
  if (!list) return;

  var root = document.body.getAttribute("data-root") || "";
  var mode = list.getAttribute("data-list");
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
    link.appendChild(el("p", "label", a.section));
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

  function normalize(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  fetch(root + "assets/data/articles.json")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (all) {
      all.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });

      if (mode !== "search") {
        render(all.filter(function (a) { return a.section === mode; }),
          list.getAttribute("data-empty") || "No stories yet.");
        return;
      }

      var index = all.map(function (a) {
        return normalize([a.title, a.dek, a.section].concat(a.path || [], a.tags || []).join(" "));
      });

      function run() {
        var raw = input.value.trim();
        var words = normalize(raw).split(/\s+/).filter(Boolean);
        var hits = all.filter(function (a, i) {
          return words.every(function (w) { return index[i].indexOf(w) !== -1; });
        });
        render(hits, "No results for \u201C" + raw + "\u201D.");
        status.textContent = hits.length === 1 ? "1 story" : hits.length + " stories";
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
      render([], "Stories could not be loaded. To preview on your computer, start a local server (see README).");
    });
})();
