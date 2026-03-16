## Web app

Static HTML/CSS/JS pages live in `web-app/src/`:

- `index.html` (landing)
- `doc-parser.html` (dashboard)
- `app.js`, `style.css`

### Run locally

From the repo root:

```bash
python -m http.server 8000
```

Then open:

- `http://localhost:8000/web-app/src/index.html`
- `http://localhost:8000/web-app/src/doc-parser.html`

