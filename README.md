# TILAS ⵜⵉⵍⴰⵙ

A documentary and cultural magazine about Morocco. English and Arabic.
Plain HTML, CSS and a little JavaScript. No build step, no framework. Works on GitHub Pages as is.

## What's inside

```
index.html                 Home
magazine.html              Magazine: list with Subject and Format filters
mediatheque.html           Médiathèque (dark): list with Type filter
archives.html              Archives: list with Type filter
magazine/  mediatheque/  archives/     One HTML file per piece
search.html                Searches everything
share.html                 "Share something for the archive" form
about.html  contact.html  privacy.html  terms.html
404.html                   Page shown for missing addresses (both languages)
ar/                        The Arabic site: same pages, same file names, right to left
templates/  ar/templates/  Blank pages to copy: story, media, archive item
assets/css/tilas.css       All styles (colors and fonts at the top)
assets/js/tilas.js         Menu, filters, search, video and audio players
assets/data/content.json   List of all English pieces (used by lists and search)
assets/data/content.ar.json  List of all Arabic pieces
assets/img/                Images
assets/media/              Put your MP3 files here
.nojekyll                  Tells GitHub Pages to serve files as they are
```

## Put it online with GitHub Pages

1. Create a repository on GitHub, for example `tilas`.
2. Upload the **contents** of this folder (not the folder itself), so `index.html` is at the top level.
3. Go to **Settings › Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute the site is at `https://YOUR-USERNAME.github.io/tilas/` (Arabic at `/tilas/ar/`).

In `404.html`, change `<base href="/">` to `<base href="/tilas/">` (your repository name). With a custom domain, set it back to `/`.

## Preview on your computer

```
cd tilas-site
python3 -m http.server
```

Open http://localhost:8000. Lists and search don't load if you double-click the files.

## Add a new piece

Every piece has an English page and an Arabic page with the **same file name**:
`magazine/my-story.html` and `ar/magazine/my-story.html`. The flag switch jumps between them.

1. The easiest way: copy an existing piece of the same kind (or a file from `templates/`) and change the text.
2. Add one entry to `assets/data/content.json` and one to `assets/data/content.ar.json`.
   Copy an existing entry and change it. Values that must match exactly:
   - `kind`: `magazine`, `media` or `archive`
   - `type`: for Magazine `story`, `profile`, `interview`, `essay`; for Médiathèque `documentary`, `video`, `audio`, `photos`; for Archives `photo`, `document`, `poster`, `object`, `recording`
   - `subject` (Magazine only): `history`, `culture`, `arts`, `people`, `places`, `heritage`
   - `date`: `YYYY-MM-DD` (lists show the newest first)
3. To feature it on the Home page, edit `index.html` and `ar/index.html`.

## Video and audio

- **Video** lives on YouTube or Vimeo. In the page, find `data-video` and put the video ID in `data-id=""`
  (for YouTube, the part after `watch?v=`). For Vimeo, also set `data-provider="vimeo"`.
  The video only loads when the reader presses play.
- **Audio**: put the MP3 in `assets/media/` and add `src="../assets/media/your-file.mp3"` to the `<audio>` tag
  (`../../assets/…` in Arabic pages). Keep files small; GitHub Pages is not made for large media.

## Images

Put photos in `assets/img/` (about 1600–2000 px wide, JPEG or WebP).
Each grey placeholder (`<div class="ph …">[Photo: …]</div>`) has a comment just above it showing the `<img>` to use.

## The share form

GitHub Pages cannot receive form submissions. Create a form with a service (Formspree, Basin, Getform…)
and replace `https://formspree.io/f/YOUR_FORM_ID` in `share.html` and `ar/share.html`.
Check that your plan accepts file uploads, or remove the file field.

## Before launch

- Fill every `[bracket]`: author names, credits, sources, emails, legal name and address.
- **Privacy policy and Terms of use** are starting templates. Complete them and have them checked by someone qualified for Morocco (law 09-08, CNDP) and, if you have European readers, the GDPR.
- Name your form service in the privacy policy.
- Add a sharing image: `<meta property="og:image" content="https://YOUR-ADDRESS/assets/img/share.jpg">` in each page's `<head>`.

## Change the look

Colors, fonts and sizes are at the top of `assets/css/tilas.css`, under `:root`.
The dark Médiathèque colors are under `.theme-dark`. Arabic settings are under `html[lang="ar"]`.
