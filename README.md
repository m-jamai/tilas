# TILAS ⵜⵉⵍⴰⵙ

A contemporary cultural magazine rooted in Morocco, open to Africa and the world.

Plain HTML, CSS and a little JavaScript. No build step, no framework. Works on GitHub Pages as is.

## What's inside

```
index.html              Homepage (edit by hand: you choose what is featured)
about.html              About TILAS
share.html              "Share something for the archive" form
search.html             Search across all stories
404.html                Page shown for missing addresses
sections/               Human, Places, Culture, Society (lists fill in automatically)
articles/               One HTML file per story
templates/article.html  Copy this to start a new story
assets/css/tilas.css    All styles. Colors and fonts are at the top, in :root
assets/js/tilas.js      Builds the section lists and search results
assets/data/articles.json  The list of all stories (used by sections and search)
assets/img/             Images: favicon, zellige drawing, your photos
.nojekyll               Tells GitHub Pages to serve files as they are
```

## Put it online with GitHub Pages

1. Create a new repository on GitHub (for example `tilas`).
2. Upload the **contents** of this folder (not the folder itself) to the repository, so `index.html` is at the top level.
3. In the repository, go to **Settings › Pages**. Under "Build and deployment", choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After a minute the site is live at `https://YOUR-USERNAME.github.io/tilas/`.

All links are relative, so the site works at that address and on a custom domain later.

One file needs your repository name: open `404.html` and change `<base href="/">` to `<base href="/tilas/">` (use your repository name). If you later use a custom domain, set it back to `/`.

## Preview on your computer

Section pages and search load `articles.json`, which browsers block when you double-click a file. Start a small local server instead:

```
cd tilas-site
python3 -m http.server
```

Then open http://localhost:8000

## Publish a new story

1. Copy `templates/article.html` into `articles/` and rename it, for example `articles/a-city-at-the-edge-of-the-atlas.html`.
2. Fill in every `[bracket]` and delete the optional blocks you don't use.
3. Add the story to `assets/data/articles.json` (copy an existing entry and change it). It then appears in its section page and in search.
4. If it should be on the homepage, edit `index.html`.

The `section` value in `articles.json` must be exactly `Human`, `Places`, `Culture` or `Society`.

## Images

Put photos in `assets/img/`. Export them around 1600 px wide as JPEG or WebP to keep pages fast. Replace each grey placeholder (`<div class="ph">…</div>`) with:

```html
<img src="assets/img/your-photo.jpg" alt="Describe the photo" width="1600" height="1067">
```

Inside `articles/`, start the path with `../` (`../assets/img/your-photo.jpg`).

## The share form

GitHub Pages only serves files: it cannot receive form submissions. To receive what people send:

1. Create a form with a form service (Formspree, Basin, Getform or similar).
2. In `share.html`, replace `https://formspree.io/f/YOUR_FORM_ID` with the address the service gives you.
3. Check that your plan accepts file uploads. If not, remove the file field from the form.

## Change the look

Open `assets/css/tilas.css`. The colors and fonts are at the top, under `:root`:

- `--accent` is the purple of the share band and pull quotes.
- Fonts are Archivo (headlines), Newsreader (reading text) and Noto Sans Tifinagh (ⵜⵉⵍⴰⵙ), loaded from Google Fonts in each page's `<head>`.

## Before launch

- Write your contact email in `about.html`.
- Add a sharing image: put `<meta property="og:image" content="https://YOUR-ADDRESS/assets/img/share.jpg">` in each page's `<head>` (it must be a full address).
- Replace the sample stories and every `[bracket]`.
