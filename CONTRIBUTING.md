## Contributing

Thanks for your interest in contributing.

### Ways to contribute

- Report bugs and reproducible issues
- Improve documentation (`README.md`, `docs/`)
- Add features (new document types, templates, UI improvements)
- Improve tests, error handling, and security hardening

### Development setup

### Configuration

This repo centralizes client-side AWS IDs/URLs in one root file:

1. Copy `project.config.example.json` → `project.config.json`
2. Edit `project.config.json`
3. Generate client config:

```bash
python scripts/setup.py
```

### Web app

- Code: `web-app/`
- Run locally:

```bash
cd web-app
npm install
npm run dev
```

- Build for production:

```bash
npm run build
```

### Mobile app

- Code: `mobile-app/`

```bash
cd mobile-app
flutter pub get
flutter run
```

### Backend (Lambda)

- Code: `backend/lambda/src/`

```bash
cd backend/lambda
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
```

### Branching and changes

- **One change per PR**: keep PRs focused.
- **Small commits**: prefer small logical commits with clear messages.
- **Avoid secrets**: never commit credentials, API keys, or `.env` files.

### Code quality

- **Python**: keep functions small and errors explicit; validate all external inputs.
- **Flutter**: prefer Riverpod patterns already used in the app; keep UI and services separated.
- **Web (React)**: follow existing component patterns; use SVG icons (no emojis); maintain the dark enterprise theme; test with `npm run build`.

### Security

If you discover a security issue (credentials exposure, auth bypass, data leakage), do not open a public issue. Share details privately with the maintainers.
