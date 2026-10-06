/* TILAS — builds section lists and search results from assets/data/articles.json.
   Only runs on pages that contain an element with data-list. */
(function () {
  "use strict";
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

  function card(a) {
    var li = el("li", "list-item");
    if (a.image) {
      var thumb = el("div", "list-thumb drawing");
      var img = el("img");
      img.src = root + a.image;
      img.alt = "";
      img.loading = "lazy";
      thumb.appendChild(img);
      li.appendChild(thumb);
    }
    var body = el("div", "list-body");
    var path = el("p", "path");
    (a.path || []).forEach(function (step) { path.appendChild(el("span", "", step)); });
    body.appendChild(path);
    var h = el("h2", "list-title");
    var link = el("a", "", a.title);
    link.href = root + a.url;
    h.appendChild(link);
    body.appendChild(h);
    if (a.dek) body.appendChild(el("p", "list-dek", a.dek));
    var meta = el("p", "meta");
    var sec = el("a", "", a.section);
    sec.href = root + "sections/" + a.section.toLowerCase() + ".html";
    meta.appendChild(sec);
    if (a.minutes) meta.appendChild(el("span", "", a.minutes + " min read"));
    body.appendChild(meta);
    li.appendChild(body);
    return li;
  }

  function render(items, emptyText) {
    list.textContent = "";
    if (!items.length) {
      list.appendChild(el("li", "empty", emptyText));
      return;
    }
    items.forEach(function (a) { list.appendChild(card(a)); });
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
          list.getAttribute("data-empty") || "No stories here yet.");
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
        render(hits, "Nothing matches \u201C" + raw + "\u201D. Try a name, a city or a decade.");
        status.textContent = (raw ? "" : "All stories: ") + (hits.length === 1 ? "1 story" : hits.length + " stories");
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
      render([], "Stories could not be loaded. If you opened the file directly from your computer, start a local server (see README).");
    });
})();
