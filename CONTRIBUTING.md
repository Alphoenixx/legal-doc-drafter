## Contributing

Thanks for your interest in contributing.

### Ways to contribute

- Report bugs and reproducible issues
- Improve documentation (`README.md`, `docs/`)
- Add features (new document types, templates, UI improvements)
- Improve tests, error handling, and security hardening

### Development setup

### Web app

- Code: `web-app/src/`
- Run locally from repo root:

```bash
python -m http.server 8000
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
- **Web**: keep the static app dependency-light; avoid introducing build tooling unless needed.

### Security

If you discover a security issue (credentials exposure, auth bypass, data leakage), do not open a public issue. Share details privately with the maintainers.

