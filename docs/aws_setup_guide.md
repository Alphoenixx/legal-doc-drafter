## End-to-end AWS setup guide (beginner friendly)

This guide helps you deploy **Legal Doc Drafter** on **your own AWS account** from scratch and connect:

- `web-app/` (static website)
- `mobile-app/` (Flutter)
- `backend/lambda/` (Python Lambda + API Gateway)
- S3 storage + Cognito authentication

By the end, you will be able to upload a document, generate a drafted PDF, and view/download it.

---

### What you will create in AWS

- **S3 bucket** (stores uploads + generated PDFs, and hosts the web app)
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

### A3) Upload the web app files

Upload **these files** (keep names exactly):

From `web-app/src/` upload:

- `index.html`
- `doc-parser.html`
- `app.js`
- `style.css`

Recommended: upload them at the bucket root (so the URLs look like `/index.html`, `/doc-parser.html`).

### A4) Enable static website hosting

1. Bucket → **Properties** → **Static website hosting**
2. Enable
3. **Index document**: `index.html`
4. Save

You’ll get a website endpoint like:

- `http://<bucket>.s3-website-<region>.amazonaws.com`

---

## Part B — Cognito User Pool (login)

### B1) Create a User Pool

AWS Console → **Cognito** → **User pools** → Create user pool:

- **Sign-in options**: Email
- Create the pool

### B2) Create an App Client

Inside the User Pool:

1. Create **App client** (public client; no client secret for browser/mobile flows)
2. Note the **App client ID** (you will paste it into code)

### B3) Configure Hosted UI (for the web app)

In your User Pool:

1. Configure **Domain** (Cognito hosted domain)
2. Configure **App client settings / Callback URLs**
   - Add callback URL pointing to your hosted dashboard page.

For this repo, the redirect goes to the dashboard page:

- `https://<YOUR_BUCKET>.s3.<YOUR_REGION>.amazonaws.com/doc-parser.html`

This must match exactly what you put in `web-app/src/index.html` (`redirectUri`).

Also set:

- Allowed OAuth flows: Authorization code grant or implicit (this repo uses token in URL)
- Allowed scopes: `email`, `openid`, `profile`

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

Configure a JWT authorizer in API Gateway using your User Pool and require it for `POST /process`.

---

## Part G — Update this repo with YOUR AWS values

After you deploy AWS resources, you must update these files.

### G1) Web app configuration

File: `web-app/src/index.html`

Update:

- `cognitoDomain` (your hosted UI domain)
- `clientId` (your User Pool app client ID)
- `redirectUri` (your hosted `doc-parser.html` URL)

File: `web-app/src/app.js`

Update:

- `API_GATEWAY_URL`
- `IdentityPoolId`
- User Pool ID inside the `Logins` key:
  - `'cognito-idp.<region>.amazonaws.com/<USER_POOL_ID>'`
- S3 bucket name:
  - `params: { Bucket: '<YOUR_BUCKET>' }`

### G2) Mobile app configuration

File: `mobile-app/lib/services/api_service.dart`

Update:

- `_apiUrl`

File: `mobile-app/lib/services/aws_auth_service.dart`

Update:

- `_userPoolId`
- `_clientId`

File: `mobile-app/lib/services/aws_s3_service.dart`

Update:

- `_bucketName`
- `_region`
- `_identityPoolId`
- The `CognitoUserPool('REGION_USERPOOL', 'CLIENT_ID')` inside `CognitoCredentials(...)`

### G3) Backend configuration

File: `backend/lambda/src/lambda_function.py`

The S3 bucket is read from env var `BUCKET_NAME` (fallback default exists).

Set Lambda environment variables (in AWS):

- `BUCKET_NAME`
- `GEMINI_API_KEY`

---

## Part H — Final checklist (end-to-end test)

1. Open your deployed website `index.html`
2. Click Login → complete Cognito login → you should land on `doc-parser.html`
3. Upload a file → confirm it appears in S3 under `uploads/`
4. Click process → Lambda runs → confirm output appears in S3 under `generated/`
5. The UI should show and download the generated PDF

---

## Troubleshooting

### Login fails / redirect mismatch

- Ensure Cognito App Client callback URL **exactly** matches `redirectUri` in `web-app/src/index.html`.

### Upload to S3 fails (AccessDenied)

- Check the Identity Pool authenticated role has `s3:PutObject` permission on `uploads/*`.

### Process fails (500 from API)

- Check Lambda has:
  - `GEMINI_API_KEY`
  - S3 permissions
  - TeXLive layer attached (PDF compile requires it)

