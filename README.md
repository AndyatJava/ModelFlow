# ModelFlow Website

Static marketing site for [ModelFlow](https://github.com/ModelFlow-App/multi-agent-platform).

## Local preview

```bash
python -m http.server 8000
```

Open http://localhost:8000.

## Deploy to GitHub Pages

1. Push this repository to `ModelFlow-App/modelflow.github.io` (or your preferred repo).
2. In repository settings, enable **Pages** and set the source to the root of the default branch.
3. Replace the Microsoft Store placeholder link in `index.html` with the real app URL once published.

## Structure

- `index.html` — Landing page
- `css/styles.css` — Theme and layout
- `js/main.js` — Navigation and scroll interactions
- `assets/` — Logo and product screenshots
