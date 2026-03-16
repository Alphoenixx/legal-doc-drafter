## Architecture

### Overview

Legal Doc Drafter is a multi-client application (web + mobile) backed by AWS. Users authenticate, upload source documents to S3, invoke an API endpoint to generate a drafted agreement, and receive a generated PDF stored in S3.

### Components

- **Web app** (`web-app/src/`)
  - Static site (HTML/CSS/JS).
  - Uses AWS JS SDK to upload to S3 and obtain credentials via Cognito.
  - Calls API Gateway to trigger document generation.
  - Reads deployment-specific values from `web-app/src/config.js` (generated).

- **Mobile app** (`mobile-app/`)
  - Flutter app using Riverpod for state management and `shared_preferences` for offline persistence (draft history and staging queue).
  - Authenticates via Cognito and uploads documents to S3.
  - Streamlined 3-tab UX with auto-navigation between Upload, Staging, and History tabs.
  - Calls the same backend API to generate drafts and shows PDFs in-app.
  - Reads deployment-specific values from `mobile-app/lib/app_config.dart` (generated).

- **Backend Lambda** (`backend/lambda/src/`)
  - Python Lambda handler: `lambda_function.lambda_handler`
  - Reads uploaded input from S3 (`s3_key`), extracts text (PDF/DOCX/TXT), calls Gemini, validates output with Pydantic schemas, renders LaTeX templates, compiles to PDF, uploads PDF to S3, returns `pdf_url`.

- **TeXLive Lambda Layer** (`backend/lambda/latex-aws-lambda-layer/`)
  - SAM project that produces a TeXLive layer expected at `/opt/texlive/bin/x86_64-linux` inside the Lambda runtime.

### Data flow

1. **Authenticate**
   - User signs in via **Cognito Hosted UI** (web) or Cognito client (mobile).
2. **Upload**
   - Client uploads a document to **S3** under a key like `uploads/<id>_<filename>`.
3. **Preview (web UI)**
   - The web app previews files by downloading them from S3:
     - **DOCX** is rendered as **HTML** in-browser
     - **TXT** is rendered as text
     - **PDF** is shown in the embedded viewer
4. **Generate**
   - Client calls **API Gateway** endpoint with JSON:
     - `s3_key`: S3 key of uploaded file
     - `doc_type`: one of `nda`, `mou`, `service_agreement`, `partnership_agreement`, `collaboration_agreement`, `contract`, `statement_of_agreement`, `meeting_resolution`
   - Request includes a Cognito token (for authorization).
5. **Process in Lambda**
   - Lambda downloads the object from S3.
   - Extracts text:
     - `.txt`: decode utf-8
     - `.docx`: parsed from DOCX XML (no `lxml` dependency)
     - `.pdf`: `PyPDF2`
   - Sends a structured extraction prompt to **Gemini** and requires strict JSON.
   - Validates response against Pydantic schema for the selected `doc_type`.
   - Renders LaTeX using `string.Template` templates.
   - Compiles LaTeX to PDF using `pdflatex`/`pdftex` from the TeXLive layer.
6. **Persist results**
   - Lambda uploads generated PDF to S3 under `generated/<uuid>.pdf`.
   - Lambda returns `pdf_url` + generated LaTeX text.

### Backend configuration

Lambda environment variables:

- **`GEMINI_API_KEY`**: Gemini API key used for extraction
- **`BUCKET_NAME`**: target S3 bucket (defaults to `doc-parser-app-as` in code)

### Client configuration (one-file workflow)

All client-side IDs/URLs are sourced from one root file:

- `project.config.json`

Then applied by running:

```bash
python scripts/sync_config.py
```

This generates:

- `web-app/src/config.js`
- `mobile-app/lib/app_config.dart`

### Security model (high-level)

- **Auth**: Cognito tokens are used by clients and sent to the API.
- **Storage**: S3 stores both uploads and generated PDFs.
- **Least privilege**:
  - Lambda role: read from `uploads/*`, write to `generated/*`.
  - Client role: write to `uploads/*` and list/read as required for the UI.
- **Secrets**:
  - Keep `GEMINI_API_KEY` in a secret manager (or encrypted env var) and never commit it to the repository.

