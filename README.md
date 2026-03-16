## Legal Doc Drafter (IDEAS-TIH)

Legal Doc Drafter is an AWS-backed app that ingests legal documents (PDF/DOCX/TXT), extracts structured fields using Gemini, and produces **professional LaTeX + PDF outputs** (e.g., NDA, MOU, contracts).

This repository is organized as a monorepo containing:

- **Web app (static HTML/CSS/JS)**: `web-app/`
- **Mobile app (Flutter)**: `mobile-app/`
- **Backend (AWS Lambda, Python)**: `backend/lambda/`

### Key features

- **Document ingestion**: Upload PDF/DOCX/TXT (or paste text on mobile).
- **AI extraction**: Gemini extracts structured fields validated via Pydantic schemas.
- **High-quality output**: LaTeX templates compiled to PDF using a TeXLive Lambda Layer.
- **AWS-native**: Cognito auth + S3 storage + API Gateway → Lambda.

### Repository layout

```text
backend/
  lambda/
docs/
mobile-app/
scripts/
web-app/
```

### Documentation

- **Architecture**: `docs/architecture.md`
- **Deployment**: `docs/deployment.md`
- **Contributing**: `CONTRIBUTING.md`

### Quick start (local)

### Web app

Serve the static site from the repo root:

```bash
python -m http.server 8000
```

Open:

- `http://localhost:8000/web-app/src/index.html`
- `http://localhost:8000/web-app/src/doc-parser.html`

More: `web-app/README.md`

### Mobile app (Flutter)

```bash
cd mobile-app
flutter pub get
flutter run
```

More: `mobile-app/README.md`

### Backend (Lambda)

The Lambda source is under `backend/lambda/src/` (handler: `lambda_function.lambda_handler`).

```bash
cd backend/lambda
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
```

More: `backend/README.md`

### Configuration & secrets

This repo expects AWS resources (Cognito, S3, API Gateway) and a deployed Lambda.

- **Do not commit secrets** (API keys, AWS credentials).
- Backend requires `GEMINI_API_KEY` and `BUCKET_NAME` environment variables.

### License

License is currently **not specified**. If you plan to open-source this repository, add a `LICENSE` file.

