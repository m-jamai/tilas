# TILAS ⵜⵉⵍⴰⵙ

A contemporary cultural magazine rooted in Morocco, open to Africa and the world.
English and Arabic. Plain HTML, CSS and a little JavaScript. No build step. Works on GitHub Pages as is.

## What's inside

```
index.html, about.html, share.html, search.html     English pages
sections/  articles/                                 English sections and stories
ar/                                                  Arabic site: same pages, same file names, right-to-left
templates/article.html                               Copy to start a new English story
ar/templates/article.html                            Copy to start a new Arabic story
404.html                                             Page shown for missing addresses (both languages)
assets/css/tilas.css                                 All styles
assets/js/tilas.js                                   Mobile menu, section lists, search
assets/data/articles.json                            English story list (sections + search)
assets/data/articles.ar.json                         Arabic story list
assets/img/                                          Favicon, zellige drawing, your photos
.nojekyll                                            Tells GitHub Pages to serve files as they are
```

## Languages

Every English page has an Arabic twin with the same file name under `ar/`
(`articles/my-story.html` ↔ `ar/articles/my-story.html`). The flag switch at the top
jumps between the two, so always keep the same file name in both languages.

Arabic pages use `dir="rtl"`, the IBM Plex Sans Arabic font and Moroccan month names.

## Put it online with GitHub Pages

1. Create a repository on GitHub (for example `tilas`).
2. Upload the **contents** of this folder (not the folder itself), so `index.html` is at the top level.
3. Go to **Settings › Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. The site is live at `https://YOUR-USERNAME.github.io/tilas/` (Arabic at `/tilas/ar/`).

In `404.html`, change `<base href="/">` to `<base href="/tilas/">` (your repository name).

## Preview on your computer

```
cd tilas-site
python3 -m http.server
```

Then open http://localhost:8000. (Section lists and search don't load if you double-click the files.)

## Publish a new story

1. Copy `templates/article.html` to `articles/your-story.html` and fill in the `[brackets]`.
2. Copy `ar/templates/article.html` to `ar/articles/your-story.html` (same name) and fill it in Arabic.
3. Add an entry to `assets/data/articles.json` and to `assets/data/articles.ar.json`.
   `section` must be `human`, `places`, `culture` or `society`.
4. To feature it on the homepage, edit `index.html` and `ar/index.html`.

## Screen sizes

- Phones and tablets (under 1024 px): a menu button opens a full-screen menu.
- Desktop (1024 px and up): everything on one line at the top.
- Large monitors (1800 px and up): wider page, larger text, four columns in section lists.

## Images

Put photos in `assets/img/` (about 1600–2000 px wide, JPEG or WebP).
Replace each grey placeholder `<div class="… ph">…</div>` with an `<img>` that has `alt`, `width` and `height`.

## The share form

GitHub Pages cannot receive form submissions. Create a form with a service (Formspree, Basin, Getform…)
and replace `https://formspree.io/f/YOUR_FORM_ID` in `share.html` and `ar/share.html`.
Check that your plan accepts file uploads, or remove the file field.

## Change the look

Colors, fonts and sizes are at the top of `assets/css/tilas.css`, under `:root`.
Arabic settings are just below, under `html[lang="ar"]`.

## Before launch

- Add your contact email in `about.html` and `ar/about.html`.
- Replace the sample stories and every `[bracket]`.
- Add a sharing image: `<meta property="og:image" content="https://YOUR-ADDRESS/assets/img/share.jpg">` in each page's `<head>`.
