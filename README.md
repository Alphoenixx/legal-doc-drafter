## Legal Doc Drafter

Legal Doc Drafter is an AWS-backed app that ingests legal documents (PDF/DOCX/TXT), extracts structured fields using Gemini, and produces **professional LaTeX + PDF outputs** (e.g., NDA, MOU, contracts).

This repository is organized as a monorepo containing:

- **Web app (React + Vite)**: `web-app/`
- **Mobile app (Flutter)**: `mobile-app/`
- **Backend (AWS Lambda, Python)**: `backend/lambda/`

### Key features

- **Document ingestion**: Upload PDF/DOCX/TXT (or paste text).
- **AI extraction**: Gemini extracts structured fields validated via Pydantic schemas.
- **High-quality output**: LaTeX templates compiled to PDF using a TeXLive Lambda Layer.
- **Previews (web)**: Preview DOCX as HTML, TXT as text, and PDFs in the embedded viewer.
- **Immersive 3D UI**: Dark enterprise SaaS theme with React Three Fiber particle network, glassmorphism panels, page transitions, and micro-animations.
- **AWS-native**: Cognito auth (custom login) + S3 storage + API Gateway → Lambda.

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
- **Setup guide (recommended)**: `setup-guide.md`
- **AWS setup (step-by-step, detailed)**: `docs/aws_setup_guide.md`
- **Contributing**: `CONTRIBUTING.md`

### Quick start (local)

### Web app

```bash
cd web-app
npm install
npm run dev
```

Open `http://localhost:5173` (or the port shown in terminal).

To build for production (static output in `web-app/dist/`):

```bash
npm run build
```

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

For reproducible setup across machines/accounts, copy `project.config.example.json` to `project.config.json` (or use the interactive script):

```bash
python scripts/setup.py
```
It will ask you how you want to provide your AWS credentials:

Option 1: Interactive Mode (Easiest)
Type 1 and press Enter. The script will ask you for your Region, S3 Bucket name, Cognito IDs, and API URL one by one. It will then generate all necessary config files for you.

Option 2: Manual Mode
Type 2 and press Enter. The script will create an empty file called project.config.json.

Open project.config.json in a text editor.
Paste your AWS IDs into the file and save it.
Run python scripts/setup.py one more time. It will detect your filled-in file and instantly sync the IDs to the React and Flutter apps.

Then build the web app (`npm run build` in `web-app/`) and upload `web-app/dist/` to your S3 static site bucket (see `setup-guide.md`).

### License

License is currently **not specified**. If you plan to open-source this repository, add a `LICENSE` file.
