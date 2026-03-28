# 🏛️ Legal Doc Drafter

> An AWS-backed enterprise application that ingests legal documents (PDF/DOCX/TXT), extracts structured fields via Gemini AI, and generates **professional LaTeX-compiled PDF outputs** (e.g., NDAs, MOUs, and contracts).

---

## 🌐 Live Hosted App
The web application is currently live and hosted via AWS S3:
- **Web App URL:** http://doc-parser-app-as.s3-website.ap-south-1.amazonaws.com/

---

## ✨ Key Features

- 📄 **Document Ingestion**: Seamlessly upload PDF, DOCX, TXT files, or paste raw text.
- 🧠 **AI Extraction**: Powered by Gemini to extract structured fields, strictly validated using Pydantic schemas.
- 🖨️ **High-Quality Output**: Utilizes LaTeX templates compiled to pristine PDFs via a custom TeXLive Lambda Layer.
- 🔍 **Live Previews**: Web-based document previewing (DOCX rendered as HTML, TXT natively, and embedded PDF viewer).
- 🎨 **Immersive 3D UI**: A sleek, dark enterprise SaaS theme built with React Three Fiber particle networks, floating wireframes, GSAP scroll storytelling, Framer Motion physics, glassmorphism, and Lenis smooth scroll.
- ☁️ **AWS-Native Architecture**: Fully integrated with Cognito auth (custom login), S3 storage, API Gateway, and Lambda.

---

## 🏗️ Repository Layout

This project is organized as a monorepo containing a web app, a mobile app, and the backend infrastructure.

```text
legal-doc-drafter/
├── backend/
│   └── lambda/        # Python Lambda handler and TeXLive layer
├── docs/              # Architecture and deployment documentation
├── mobile-app/        # Flutter companion mobile application
├── scripts/           # Automated setup and config syncing tools
└── web-app/           # React + Vite frontend SPA
```

---

## 📚 Documentation

For complete technical details, please refer to the following guides:
- 🗺️ **[Architecture Overview](docs/architecture.md)**
- 🚀 **[Deployment Strategy](docs/deployment.md)**
- 🛠️ **[Local Setup Guide](setup-guide.md)** *(Recommended starting point)*
- ☁️ **[AWS Step-by-Step Setup](docs/aws_setup_guide.md)**
- 🤝 **[Contributing Guidelines](CONTRIBUTING.md)**

---

## ⚡ Quick Start

### Web App
*(Requires Node.js)*
```bash
cd web-app
npm install
npm run dev
```
Open `http://localhost:5173` (or the port shown in terminal).
To build for production (static output generated in `web-app/dist/`):
```bash
npm run build
```
_See the [Web App README](web-app/README.md) for more details._

### Mobile App
*(Requires Flutter)*
```bash
cd mobile-app
flutter pub get
flutter run
```
_See the [Mobile App README](mobile-app/README.md) for more details._

### Backend (AWS Lambda)
*(Requires Python)*
The Lambda source code is located under `backend/lambda/src/` with the handler `lambda_function.lambda_handler`.
```bash
cd backend/lambda
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
```
_See the [Backend README](backend/README.md) for more details._

---

## 🔒 Configuration & Secrets

This repository expects deployed AWS resources (Cognito, S3, API Gateway) and an active Lambda function.

⚠️ **Security Warning**: Do not commit secrets (API keys, AWS credentials) to version control.
- The backend requires `GEMINI_API_KEY` and `BUCKET_NAME` to be set as environment variables.

### Automated Setup
For a reproducible setup across different machines or accounts, either copy `project.config.example.json` to `project.config.json`, or run the interactive setup script:
```bash
python scripts/setup.py
```

The script offers two modes for configuring your AWS credentials:
1. **Interactive Mode (Easiest)**: Type `1` and press Enter. Provide your Region, S3 Bucket name, Cognito IDs, and API URL when prompted. The script generates all necessary config files automatically.
2. **Manual Mode**: Type `2` and press Enter. This creates an empty `project.config.json` file. Open it, paste your AWS IDs, save, and re-run `python scripts/setup.py` to instantly sync your keys to the React and Flutter applications.

Once configured, build the web app (`npm run build` inside `web-app/`) and upload the `dist/` directory to your S3 static site bucket (see the [Setup Guide](setup-guide.md)).

---

## 📜 License

License is currently **not specified**.

---

## 🎓 Acknowledgments

**Developed during Spring Internship 2026**  
**IDEAS** — Institute of Data Engineering, Analytics and Science Foundation, ISI Kolkata  
*(21 Jan 2026 – 31 Mar 2026)*
