# ModelFlow Website

Static marketing site for [ModelFlow](https://github.com/ModelFlow-App/multi-agent-platform).

## Local preview

```bash
python -m http.server 8000
```

Open <http://localhost:8000>.

## Deploy to GitHub Pages

1. Push this repository to `ModelFlow-App/modelflow.github.io` (or your preferred repo).
2. In repository settings, enable **Pages** and set the source to the root of the default branch.
3. The Microsoft Store link in `index.html` is already set to the published app URL.

## Structure

- `index.html` — Landing page
- `css/styles.css` — Theme and layout
- `js/main.js` — Navigation, scroll interactions, language selector, pricing toggle
- `js/i18n.js` — Homepage internationalization (8 languages)
- `assets/` — Logo and product screenshots
- `docs/` — Multilingual user guide (8 languages)
  - `docs/{lang}/index.html` — Language-specific guide
  - `docs/assets/screenshots/` — Product screenshots
