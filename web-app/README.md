## Web app

Static HTML/CSS/JS pages live in `web-app/src/`:

- `index.html` (landing)
- `doc-parser.html` (dashboard)
- `app.js`, `style.css`
- `config.js` (generated)

### Configure for your AWS account

1. Copy `project.config.example.json` → `project.config.json` in the repo root
2. Edit `project.config.json`
3. Generate `web-app/src/config.js`:

```bash
python scripts/sync_config.py
```

### Run locally

From the repo root:

```bash
python -m http.server 8000
```

Then open:

- `http://localhost:8000/web-app/src/index.html`
- `http://localhost:8000/web-app/src/doc-parser.html`

