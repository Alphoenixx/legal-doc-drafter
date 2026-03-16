## End-to-end AWS setup guide (beginner friendly)

This guide helps you deploy **Legal Doc Drafter** on **your own AWS account** from scratch and connect:

- `web-app/` (React + Vite SPA)
- `mobile-app/` (Flutter)
- `backend/lambda/` (Python Lambda + API Gateway)
- S3 storage + Cognito authentication

By the end, you will be able to upload a document, generate a drafted PDF, and view/download it.

If you want a single "first-time user" walkthrough, start with:

- `setup-guide.md` (repo root)

---

### What you will create in AWS

- **S3 bucket** (stores uploads + generated PDFs, and hosts the web app build output)
- **Cognito User Pool** (users + login)
- **Cognito Identity Pool** (gives browser/mobile temporary AWS credentials for S3)
- **Lambda function** (processes documents)
- **Lambda Layer** (TeXLive binaries so LaTeX can compile to PDF)
- **API Gateway** (HTTP endpoint used by web/mobile)

---

### Step 0 — Decide your AWS region and names

Pick:

- **Region**: e.g. `ap-south-1`
- **S3 bucket name**: e.g. `my-legal-doc-drafter-bucket`

You will paste these values into the repo later.

---

## Part A — S3 bucket (uploads + outputs + static website)

### A1) Create an S3 bucket

1. AWS Console → **S3** → **Create bucket**
2. Name it (globally unique), choose your region
3. Keep defaults, then create it

### A2) Create folders (prefixes)

In the bucket, create these prefixes (folders):

- `uploads/`
- `generated/`

### A3) Build and upload the web app

First, build the React app:

```bash
cd web-app
npm install
npm run build
```

Upload the **contents** of `web-app/dist/` to the bucket root:

- `index.html`
- `assets/` (JS/CSS bundles)

The app uses `HashRouter`, so all routes (`/#/login`, `/#/dashboard`) work without URL rewriting.

### A4) Enable static website hosting

1. Bucket → **Properties** → **Static website hosting**
2. Enable
3. **Index document**: `index.html`
4. Save

You'll get a website endpoint like:

- `http://<bucket>.s3-website-<region>.amazonaws.com`

---

## Part B — Cognito User Pool (login)

### B1) Create a User Pool

AWS Console → **Cognito** → **User pools** → Create user pool:

- **Sign-in options**: Email
- Create the pool

### B2) Create an App Client

Inside the User Pool:

1. Create **App client** (public client)
2. **Generate client secret**: **Disabled**
3. Enable authentication flows:
   - `ALLOW_USER_PASSWORD_AUTH`
   - `ALLOW_REFRESH_TOKEN_AUTH`
4. Note the **App client ID**

### B3) Hosted UI (NOT required)

The web app uses a **custom login form** built into the React application. You do **not** need to configure a Hosted UI domain, callback URLs, or OAuth flows.

---

## Part C — Cognito Identity Pool (temporary AWS creds for S3 upload)

The web app and mobile app upload directly to S3 using temporary credentials.

### C1) Create Identity Pool

AWS Console → Cognito → **Identity pools** → Create:

- Enable access to **unauthenticated identities**: typically **OFF**
- Enable **authenticated identities**: **ON**
- Add your **User Pool** as an authentication provider

Note the **Identity Pool ID** (format looks like `ap-south-1:xxxx-xxxx-...`).

### C2) IAM roles / permissions for S3

For the **authenticated role** attached to the Identity Pool, add an IAM policy allowing:

- Upload objects to `uploads/*`
- (Optional) List/read if your UI needs it

Example (replace bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowUploadInputs",
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET/uploads/*"
    }
  ]
}
```

If you want the client to read generated PDFs directly from S3, allow `s3:GetObject` on `generated/*`.

---

## Part D — TeXLive Lambda Layer (LaTeX compiler)

Your Lambda compiles LaTeX into a PDF. It expects TeXLive binaries at:

- `/opt/texlive/bin/x86_64-linux`

This repo includes a SAM project at:

- `backend/lambda/latex-aws-lambda-layer/`

Build and deploy it according to its upstream README. After deployment, attach the **Layer ARN** to your document-processing Lambda.

---

## Part E — Lambda function (Python backend)

### E1) Create the Lambda

AWS Console → **Lambda** → Create function:

- Runtime: **Python 3.x**
- Name: e.g. `legal-doc-drafter`

### E2) Package + upload Lambda code

Lambda source is in:

- `backend/lambda/src/`

At minimum, your deployment package must include:

- `lambda_function.py`
- `pydantic_models.py`
- `templates.py`

And Python dependencies from:

- `backend/lambda/requirements.txt`

You can deploy as:

- zip (with vendored dependencies), or
- container image, or
- zip + separate Python dependencies layer

### E3) Configure environment variables

Set these Lambda env vars:

- `GEMINI_API_KEY` = your Gemini API key
- `BUCKET_NAME` = your S3 bucket name

### E4) IAM permissions for Lambda

Lambda execution role needs:

- `s3:GetObject` on `uploads/*`
- `s3:PutObject` on `generated/*`

Example:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadUploads",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET/uploads/*"
    },
    {
      "Sid": "WriteGenerated",
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET/generated/*"
    }
  ]
}
```

### E5) Attach the TeXLive Layer

Attach the TeXLive layer you deployed in Part D.

---

## Part F — API Gateway

Both web and mobile call an HTTP endpoint like:

- `https://<api-id>.execute-api.<region>.amazonaws.com/process`

### F1) Create an HTTP API

AWS Console → API Gateway → Create API → **HTTP API**

Create a route:

- `POST /process`

Integrate it with your Lambda.

### F2) Add authorization (recommended)

This repo sends a Cognito JWT in the `Authorization` header.

Configure a JWT authorizer in API Gateway using your User Pool and require it for:

- `POST /process`

---

## Part G — Update this repo with YOUR AWS values

After you deploy AWS resources, you must update these files.

### G1) Web app configuration

Edit **one file in the repo root**:

1. Copy `project.config.example.json` → `project.config.json`
2. Edit `project.config.json` with your AWS values
3. Run:

```bash
python scripts/setup.py
```

This generates:

- `web-app/src/config.js` (ES module)
- `mobile-app/lib/app_config.dart`

Make sure your `project.config.json` includes:

- `api.processUrl` (API Gateway `/process`)

### G2) Build and re-upload the web app

After updating the config, rebuild:

```bash
cd web-app
npm run build
```

Upload `web-app/dist/` to S3.

### G3) Mobile app configuration

No direct edits required if you use `project.config.json` + `scripts/setup.py`.

### G4) Backend configuration

File: `backend/lambda/src/lambda_function.py`

The S3 bucket is read from env var `BUCKET_NAME` (fallback default exists).

Set Lambda environment variables (in AWS):

- `BUCKET_NAME`
- `GEMINI_API_KEY`

Tip: Keep `GEMINI_API_KEY` out of Git. Store it only in AWS (Lambda env vars or Secrets Manager).

---

## Part H — Final checklist (end-to-end test)

1. Open your deployed website URL
2. You should see the landing page with 3D particle network
3. Click **Start Drafting** → custom login form appears
4. Sign up or sign in → you should land on the dashboard
5. Upload a file → confirm it appears in S3 under `uploads/`
6. Click a file in the left panel → confirm it previews:
   - DOCX previews as HTML
   - TXT previews as text
   - PDF previews in the embedded viewer
7. Click process → Lambda runs → confirm output appears in S3 under `generated/`
8. The UI should show and download the generated PDF

---

## Troubleshooting

### Login fails

- Ensure the Cognito App Client has `ALLOW_USER_PASSWORD_AUTH` enabled.
- Ensure `Generate client secret` is **disabled**.
- Verify User Pool ID and App Client ID in `project.config.json`.

### Upload to S3 fails (AccessDenied)

- Check the Identity Pool authenticated role has `s3:PutObject` permission on `uploads/*`.

### Process fails (500 from API)

- Check Lambda has:
  - `GEMINI_API_KEY`
  - S3 permissions
  - TeXLive layer attached (PDF compile requires it)

### Web app loads but doesn't work

- You forgot to run `npm run build` before uploading.
- You forgot to run `python scripts/setup.py` before building.
- You uploaded source files instead of `dist/` contents.
