## Deployment

This document describes a practical deployment approach for the web app + mobile app + Lambda backend.

### AWS resources

At minimum you will need:

- **S3 bucket** for:
  - `uploads/` (source documents)
  - `generated/` (generated PDFs)
  - Static website hosting (for the web app build output)
- **Cognito User Pool** for authentication (custom login flow, no Hosted UI required)
- **Cognito Identity Pool** to obtain temporary AWS credentials for S3 access
- **API Gateway** endpoint that triggers the Lambda
- **Lambda function** (Python) for document processing
- **Lambda Layer** providing TeXLive binaries at `/opt/texlive/bin/x86_64-linux`

### Backend (Lambda)

#### 1) Package dependencies

Dependencies are listed in `backend/lambda/requirements.txt`.

Typical packaging options:

- **Zip deploy**: vendor dependencies into the deployment zip (or separate Python layer).
- **Container image**: package Python dependencies and TeXLive together (alternative to a layer).

#### 2) Configure environment variables

Set:

- `GEMINI_API_KEY`
- `BUCKET_NAME`

#### 3) Attach IAM permissions

Lambda role should have least-privilege access similar to:

- `s3:GetObject` on `arn:aws:s3:::<bucket>/uploads/*`
- `s3:PutObject` on `arn:aws:s3:::<bucket>/generated/*`
- `s3:GetObject` (optional) on `generated/*` if you generate presigned URLs, etc.

#### 4) TeXLive layer

The Lambda expects a TeXLive layer mounted at:

- `/opt/texlive/bin/x86_64-linux`

A SAM project for the layer is vendored in:

- `backend/lambda/latex-aws-lambda-layer/`

Use that project's README to build/deploy the layer and attach it to your Lambda.

### API Gateway

The web and mobile clients call an API endpoint (see generated config) at:

- `project.config.json` → `api.processUrl`

Ensure your deployed API exposes a compatible route that:

- accepts `POST` JSON body with `s3_key` and `doc_type`
- forwards the request to the Lambda
- enforces authentication/authorization (recommended)

### Web app (React + Vite)

The web app is a React SPA built with Vite. Deployment steps:

1. Generate config:
   ```bash
   python scripts/sync_config.py
   ```

2. Build for production:
   ```bash
   cd web-app
   npm install
   npm run build
   ```

3. Upload `web-app/dist/` contents to your S3 bucket root.

The app uses **HashRouter** (`/#/login`, `/#/dashboard`), so it works with S3 static hosting without URL rewriting.

Notes:

- Client configuration is centralized in `project.config.json` (root) and applied via `sync_config.py`.
- The app uses custom Cognito login (not Hosted UI), so no redirect URL configuration is needed in Cognito.
- The Cognito App Client must have `ALLOW_USER_PASSWORD_AUTH` enabled and `Generate client secret` disabled.

### Mobile app (Flutter)

Build and distribute using standard Flutter workflows:

- Android: `flutter build apk` / `flutter build appbundle`
- iOS: `flutter build ipa` (requires macOS + Xcode)

Update any environment/config constants used by the app (API base URL, Cognito IDs, S3 bucket/region) so the app points at your deployed AWS resources.

In this repo, you should not edit constants scattered across files. Instead:

- Update `project.config.json`
- Run `python scripts/sync_config.py`

### Smoke test checklist

- Web:
  - Login works via custom form (email + password)
  - Sign up creates a Cognito user and verification email is received
  - Uploads a file to `uploads/` in S3
  - Processing returns a `pdf_url` and PDF loads in preview
  - 3D animations render (particle network, shield, page transitions)
- Backend:
  - Lambda can read uploads and write generated PDFs
  - TeXLive binaries are present and PDF compilation succeeds
  - Gemini calls succeed and errors are surfaced cleanly
