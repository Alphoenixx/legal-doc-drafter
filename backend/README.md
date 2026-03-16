## Backend

### Lambda (Python)

- **Source**: `backend/lambda/src/`
- **Entry point**: `lambda_function.lambda_handler`
- **Dependencies**: `backend/lambda/requirements.txt`

The Lambda reads an uploaded document from S3, extracts structured fields using Gemini, renders a LaTeX template, compiles it to a PDF (expects a TeXLive layer), uploads the PDF back to S3, and returns the PDF URL.

### Configuration

- **Client configuration** (web/mobile IDs, URLs): edit `project.config.json` in the repo root and run `python scripts/setup.py`.
- **Backend secrets/config**: set in AWS Lambda environment variables:
  - `GEMINI_API_KEY`
  - `BUCKET_NAME`

### LaTeX layer (SAM project)

The repository also includes a TeXLive Lambda Layer project vendored under:

- `backend/lambda/latex-aws-lambda-layer/`

That folder is its own SAM application and can be built/deployed independently (see its `README.md`).

