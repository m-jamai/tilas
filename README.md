# TILAS — website

A static website for TILAS, ready for GitHub Pages. No build step, no dependencies.

## Files

- `index.html` — home page: masthead, current issue, the four sections, a quote, the archive call, newsletter.
- `article.html` — template for a long-read story.
- `style.css` — the whole visual identity (colours, fonts, grid).
- `.nojekyll` — tells GitHub Pages to serve the files as they are.

## Deploy on GitHub Pages

1. Create a new repository on GitHub (for example `tilas`).
2. Upload all the files in this folder to the repository root (drag and drop on github.com works, including `.nojekyll`).
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
5. After a minute the site is live at `https://YOUR-USERNAME.github.io/tilas/`.

To use your own domain (for example `tilas.ma`), add it in **Settings → Pages → Custom domain** and follow GitHub's DNS instructions.

## Before going live, replace

- `archive@your-domain.com` and `contact@your-domain.com` with real email addresses (in both HTML files).
- The Instagram and Newsletter links in the footer (`href="#"`).
- Text in brackets, like `[Author]` and `[Researcher]`.
- The photo placeholders with real images: put images in an `images/` folder and replace each `<svg>…</svg>` inside a `.photo` block with `<img src="images/your-photo.jpg" alt="Description">` (add `style="width:100%;height:100%;object-fit:cover"`).

## Newsletter form

GitHub Pages can't receive form submissions on its own. The form currently only shows a thank-you message. To collect emails, connect a service such as Buttondown, Mailchimp or Formspree: replace `<form id="signup" novalidate>` with the form code the service gives you, and remove the small script at the bottom of `index.html`.
