## Setup Guide (End-to-End, beginner friendly)

This guide is written for someone who has never used AWS before. If you follow these steps carefully, you will deploy your own working copy of **Legal Doc Drafter**:

- A working **web app** (hosted on AWS S3)
- A working **mobile app** (Flutter)
- A working **backend** (API Gateway → Lambda)
- Storage + auth (S3 + Cognito)

You will also configure the repo by editing **one file only**: `project.config.json`.

---

### What this app does (in plain language)

1. A user logs in.
2. The user uploads a document (PDF/DOCX/TXT).
3. The backend reads the document, uses Gemini to extract fields, fills a LaTeX template, compiles a PDF, and saves it.
4. The user downloads/views the generated PDF.

---

## Part 0 — What you need before you start

### Accounts / keys

- An **AWS account** (billing enabled)
- A **Gemini API key** (Google AI Studio)

### Software on your computer

- **Python** (to run the config sync script)
- **Flutter** (only if you want to run the mobile app)

---

## Part 1 — Choose your AWS region + names

Pick and write down:

- **AWS Region** (example): `ap-south-1`
- **S3 bucket name** (example): `my-legal-doc-drafter-2026`
  - Bucket names must be globally unique.

---

## Part 2 — Create S3 bucket (website + storage)

### Step 2.1: Create the bucket

1. Open AWS Console
2. Search **S3**
3. Click **Create bucket**
4. Enter your bucket name
5. Choose your region
6. Create the bucket

### Step 2.2: Create folders (prefixes)

Inside the bucket create:

- `uploads/`
- `generated/`

### Step 2.3: Enable static website hosting

1. Bucket → **Properties**
2. **Static website hosting** → Enable
3. Index document: `index.html`
4. Save

Copy the **Website endpoint URL** shown by AWS.

---

## Part 3 — Create login (Cognito User Pool)

### Step 3.1: Create a User Pool

1. AWS Console → search **Cognito**
2. Go to **User pools**
3. Create a new user pool
4. Choose sign-in with **Email**
5. Finish

Copy:

- **User Pool ID** (looks like `ap-south-1_XXXXXXXXX`)

### Step 3.2: Create an App Client

1. Inside the User Pool → create **App client**
2. Use settings suitable for web/mobile apps (no client secret required for public clients)

Copy:

- **App Client ID**

### Step 3.3: Create a Hosted UI domain + callback URL

1. In Cognito User Pool, set up a **Hosted UI domain**
2. Add a **Callback/Redirect URL** to the App Client settings.

Your web dashboard page is `doc-parser.html`. If you host the web files at the bucket root (recommended), the redirect is:

- `https://YOUR_BUCKET.s3.YOUR_REGION.amazonaws.com/doc-parser.html`

This callback URL must match exactly what you will put in `project.config.json`.

Copy:

- **Hosted UI Domain** (looks like `https://xxxx.auth.YOUR_REGION.amazoncognito.com`)

---

## Part 4 — Allow web/mobile to upload to S3 (Cognito Identity Pool)

Your web and mobile apps upload to S3 using temporary AWS credentials (so you don’t hardcode AWS keys into the app).

### Step 4.1: Create an Identity Pool

1. AWS Console → Cognito → **Identity pools**
2. Create a new Identity Pool
3. Enable **Authenticated identities**
4. Link it to your **User Pool**

Copy:

- **Identity Pool ID** (looks like `ap-south-1:xxxx-xxxx-xxxx-xxxx`)

### Step 4.2: Give the Identity Pool role permission to upload to S3

AWS creates an IAM role for authenticated users. Add permissions so authenticated users can upload to:

- `uploads/*`

Optional (recommended if you want clients to directly open PDFs from S3):

- `generated/*` read access

If you don’t know IAM, this is the idea:

- allow `s3:PutObject` to `arn:aws:s3:::YOUR_BUCKET/uploads/*`
- allow `s3:GetObject` to `arn:aws:s3:::YOUR_BUCKET/generated/*` (optional)

---

## Part 5 — Deploy the backend (Lambda + TeXLive layer + API Gateway)

The backend is a Lambda function that compiles LaTeX into PDF. For that compilation step, Lambda needs a TeXLive layer.

### Step 5.1: Deploy the TeXLive Layer

This repo contains a layer project at:

- `backend/lambda/latex-aws-lambda-layer/`

Deploy it following its own README. When deployed, copy:

- **Layer ARN**

### Step 5.2: Create the Lambda function (Python)

1. AWS Console → **Lambda** → Create function
2. Runtime: **Python 3.x**
3. Create

### Step 5.3: Upload backend code + dependencies

Backend source code:

- `backend/lambda/src/`

Python dependencies list:

- `backend/lambda/requirements.txt`

Deploy using one of these approaches:

- Zip (with dependencies bundled), or
- Zip + Python dependencies layer, or
- Container image

If you’re unsure, read `docs/deployment.md` for options.

### Step 5.4: Add environment variables to Lambda

In Lambda → Configuration → Environment variables, set:

- `BUCKET_NAME` = your S3 bucket name
- `GEMINI_API_KEY` = your Gemini key

### Step 5.5: Give Lambda S3 permissions

Lambda must be able to:

- Read inputs from `uploads/*`
- Write outputs to `generated/*`

### Step 5.6: Attach the TeXLive Layer to Lambda

Attach the Layer ARN from Step 5.1.

### Step 5.7: Create API Gateway endpoint

1. AWS Console → **API Gateway**
2. Create **HTTP API**
3. Add route: `POST /process`
4. Integrate it with your Lambda

Copy:

- The final **process endpoint URL**, which looks like:
  - `https://xxxx.execute-api.YOUR_REGION.amazonaws.com/process`

### Step 5.8: Add authorization (recommended)

The clients send a Cognito JWT token in the `Authorization` header.

Configure a JWT authorizer in API Gateway using your **User Pool** and require it for `POST /process`.

---

## Part 6 — Configure this repo by editing ONE file

### Step 6.1: Create your local config file

In the repository root:

1. Copy `project.config.example.json`
2. Rename the copy to `project.config.json`
3. Open `project.config.json`
4. Fill in your values:
   - region, bucket, Cognito IDs, Hosted UI domain, redirect URL, API process URL

Important:

- **Do not commit `project.config.json`** (it is ignored by `.gitignore`).
- `GEMINI_API_KEY` should be stored in AWS (Lambda env vars), not in GitHub.

### Step 6.2: Generate web + mobile config automatically

Run from repo root:

```bash
python scripts/sync_config.py
```

This generates/updates:

- `web-app/src/config.js`
- `mobile-app/lib/app_config.dart`

---

## Part 7 — Upload web app files to S3

Upload these files from `web-app/src/` to your bucket (recommended: bucket root):

- `index.html`
- `doc-parser.html`
- `app.js`
- `style.css`
- `config.js` (generated by `scripts/sync_config.py`)

---

## Part 8 — Test the web app (end-to-end)

1. Open your S3 static website URL (from Part 2)
2. Click **Login / Sign Up**
3. Log in via Cognito Hosted UI
4. You should land on `doc-parser.html`
5. Upload a PDF/DOCX/TXT
6. Confirm the file appears in S3 under `uploads/`
7. Click process / choose document type
8. Confirm a PDF appears in S3 under `generated/`
9. Confirm the UI shows/opens the PDF

---

## Part 9 — Run the mobile app

After running `python scripts/sync_config.py`:

```bash
cd mobile-app
flutter pub get
flutter run
```

---

## Troubleshooting (most common issues)

### Login fails

- Your Cognito App Client callback URL must exactly match:
  - `project.config.json` → `aws.cognito.redirectUri`

### Upload to S3 fails (AccessDenied)

- The Identity Pool authenticated IAM role needs `s3:PutObject` to `uploads/*`.

### Process fails (500 error)

Common causes:

- Lambda missing env var `GEMINI_API_KEY`
- Lambda missing S3 permissions
- TeXLive layer not attached (LaTeX compilation fails)
- API Gateway authorizer misconfigured

### Web app loads but doesn’t work

- You forgot to upload `config.js` to S3, or uploaded the wrong one.

