## Setup Guide (End-to-End, beginner friendly)

This guide is written for someone who has never used AWS before. If you follow these steps carefully, you will deploy your own working copy of **Legal Doc Drafter**:

- A working **web app** (hosted on AWS S3)
- A working **mobile app** (Flutter)
- A working **backend** (API Gateway → Lambda)
- Storage + auth (S3 + Cognito)

You will also configure the repo by editing **one file only**: `project.config.json`.

---

### What this app does (in plain language)

1. A user logs in (via custom login form).
2. The user uploads a document (PDF/DOCX/TXT).
3. The backend reads the document, uses Gemini to extract fields, fills a LaTeX template, compiles a PDF, and saves it.
4. The user downloads/views the generated PDF.

---

## Part 0 — What you need before you start

### Accounts / keys

- An **AWS account** (billing enabled)
- A **Gemini API key** (Google AI Studio)

### Software on your computer

- **Node.js** (to build the web app)
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
2. **Generate client secret**: **Disabled** (required for browser/mobile flows)
3. Under **Authentication flows**, enable:
   - `ALLOW_USER_PASSWORD_AUTH`
   - `ALLOW_REFRESH_TOKEN_AUTH`

Copy:

- **App Client ID**

### Step 3.3: Hosted UI (NOT required)

The web app uses a **custom login form** (built into the React app). You do **not** need to configure a Hosted UI domain or callback URLs.

---

## Part 4 — Allow web/mobile to upload to S3 (Cognito Identity Pool)

Your web and mobile apps upload to S3 using temporary AWS credentials (so you don't hardcode AWS keys into the app).

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

If you don't know IAM, this is the idea:

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

If you're unsure, read `docs/deployment.md` for options.

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

## Part 6 — Connecting the apps to AWS

You need to tell the web app and mobile app what your AWS IDs are so they can connect.

To do this easily, run the setup script from the root of the repository:

```bash
python scripts/setup.py
```

It will ask you how you want to provide your AWS credentials:

### Option 1: Interactive Mode (Easiest)
Type `1` and press Enter. The script will ask you for your Region, S3 Bucket name, Cognito IDs, and API URL one by one. It will then generate all necessary config files for you.

### Option 2: Manual Mode
Type `2` and press Enter. The script will create an empty file called `project.config.json`.
1. Open `project.config.json` in a text editor.
2. Paste your AWS IDs into the file and save it.
3. Run `python scripts/setup.py` one more time. It will detect your filled-in file and instantly sync the IDs to the React and Flutter apps.

---

## Part 7 — Build and upload web app to S3

The web app is a React + Vite application. You must build it before uploading.

```bash
cd web-app
npm install
npm run build
```

This creates a `dist/` folder. Upload the **contents** of `web-app/dist/` to your S3 bucket root:

- `index.html`
- `assets/` (JS/CSS bundles)

The app uses `HashRouter` (`/#/login`, `/#/dashboard`), so no URL rewriting is needed on S3.

---

## Part 8 — Test the web app (end-to-end)

1. Open your S3 static website URL (from Part 2)
2. You should see the landing page with 3D particle network
3. Click **Start Drafting** → you should see the login form
4. Create an account or sign in
5. You should land on the dashboard
6. Upload a PDF/DOCX/TXT
7. Confirm the file appears in S3 under `uploads/`
8. Click a file in the left panel to preview it:
   - DOCX previews as HTML in the browser
   - TXT previews as text
   - PDF previews in the embedded viewer
9. Click process / choose document type
10. Confirm a PDF appears in S3 under `generated/`
11. Confirm the UI shows/opens the PDF

---

## Part 9 — Run the mobile app

After running `python scripts/setup.py`:

```bash
cd mobile-app
flutter pub get
flutter run
```

---

## Troubleshooting (most common issues)

### Login fails

- Make sure the Cognito App Client has `ALLOW_USER_PASSWORD_AUTH` enabled.
- Make sure `Generate client secret` is **disabled**.
- Verify the User Pool ID and App Client ID in `project.config.json` match your AWS console.

### Upload to S3 fails (AccessDenied)

- The Identity Pool authenticated IAM role needs `s3:PutObject` to `uploads/*`.

### Process fails (500 error)

Common causes:

- Lambda missing env var `GEMINI_API_KEY`
- Lambda missing S3 permissions
- TeXLive layer not attached (LaTeX compilation fails)
- API Gateway authorizer misconfigured

### Web app loads but doesn't work

- You forgot to run `npm run build` before uploading, or uploaded source files instead of `dist/`.
- You forgot to run `python scripts/setup.py` before building.
