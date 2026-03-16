import json
import boto3
import io
import os
import urllib.request
import urllib.error
import logging
import uuid
import subprocess

from pydantic_models import SCHEMA_ROUTER
from templates import *

# ============================================================
# CONFIGURATION
# ============================================================

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client("s3")

BUCKET = os.environ.get("BUCKET_NAME", "doc-parser-app-as")

# ============================================================
# LATEX ENGINE CONFIGURATION
# ============================================================

TEXLIVE_BIN = "/opt/texlive/bin/x86_64-linux"

PDFLATEX = f"{TEXLIVE_BIN}/pdflatex"
PDFTEX = f"{TEXLIVE_BIN}/pdftex"

os.environ["PATH"] = TEXLIVE_BIN + ":" + os.environ.get("PATH", "")

if os.path.exists(PDFLATEX):
    LATEX_ENGINE = PDFLATEX
    LATEX_ARGS = ["-interaction=nonstopmode"]

elif os.path.exists(PDFTEX):
    LATEX_ENGINE = PDFTEX
    LATEX_ARGS = ["-fmt=pdflatex", "-interaction=nonstopmode"]

else:
    LATEX_ENGINE = None
    LATEX_ARGS = []

logger.info(f"LaTeX Engine: {LATEX_ENGINE}")

# ============================================================
# FILE READERS
# ============================================================

def read_txt(data):
    return data.decode("utf-8", errors="ignore")


def read_docx(data):
    """
    Extract text from a DOCX without requiring lxml.

    Some Lambda environments have a broken/incorrectly-built lxml wheel, which causes:
    "cannot import name 'etree' from 'lxml'".

    This implementation parses the DOCX (a zip) and reads the main document XML
    using the standard library XML parser.
    """
    import zipfile
    import xml.etree.ElementTree as ET

    with zipfile.ZipFile(io.BytesIO(data)) as z:
        # Main body content
        xml_bytes = z.read("word/document.xml")

    root = ET.fromstring(xml_bytes)

    # WordprocessingML namespace
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}

    texts = []
    # Extract all text nodes; this includes paragraphs and table cell text.
    for t in root.findall(".//w:t", ns):
        if t.text:
            texts.append(t.text)

    # Preserve some line breaks: insert newline at paragraph boundaries.
    # We do this by walking paragraphs and collecting their text.
    paras = []
    for p in root.findall(".//w:p", ns):
        p_text = "".join((t.text or "") for t in p.findall(".//w:t", ns)).strip()
        if p_text:
            paras.append(p_text)

    if paras:
        return "\n".join(paras).strip()

    return "\n".join(texts).strip()


def read_pdf(data):
    from PyPDF2 import PdfReader

    reader = PdfReader(io.BytesIO(data))
    return "\n".join(page.extract_text() or "" for page in reader.pages)

# ============================================================
# TEXT LIMIT
# ============================================================

def limit_text(text, max_chars=12000):

    if len(text) <= max_chars:
        return text

    half = max_chars // 2
    return text[:half] + "\n\n...[TRUNCATED]...\n\n" + text[-half:]

# ============================================================
# LATEX ESCAPE
# ============================================================

def escape_latex(value):
    """Recursively escape LaTeX special characters in strings, dicts, and lists."""
    if isinstance(value, str):
        replacements = {
            "\\": r"\textbackslash{}",
            "&": r"\&",
            "%": r"\%",
            "$": r"\$",
            "#": r"\#",
            "_": r"\_",
            "~": r"\textasciitilde{}",
            "^": r"\textasciicircum{}",
            "{": r"\{",
            "}": r"\}",
        }
        for k, v in replacements.items():
            value = value.replace(k, v)
        return value
    elif isinstance(value, dict):
        return {k: escape_latex(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [escape_latex(item) for item in value]
    return value

# ============================================================
# LATEX COMPILATION
# ============================================================

def compile_latex(latex):

    if not LATEX_ENGINE:
        raise Exception("No LaTeX engine available")

    # Cleanup leftover files from previous invocations (Lambda reuses containers)
    import glob
    for f in glob.glob("/tmp/doc.*"):
        try:
            os.remove(f)
        except OSError:
            pass

    os.chdir("/tmp")

    tex_path = "/tmp/doc.tex"
    pdf_path = "/tmp/doc.pdf"

    with open(tex_path, "w", encoding="utf-8") as f:
        f.write(latex)

    try:

        result = subprocess.run(
            [LATEX_ENGINE] + LATEX_ARGS + ["doc.tex"],
            cwd="/tmp",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=20,
        )

        logger.info(result.stdout.decode())

        if not os.path.exists(pdf_path):
            logger.error(result.stderr.decode())
            raise Exception("PDF generation failed")

        with open(pdf_path, "rb") as f:
            return f.read()

    except subprocess.TimeoutExpired:
        raise Exception("LaTeX compilation timed out")

# ============================================================
# GEMINI EXTRACTION
# ============================================================

def extract_legal_data(raw_text, doc_type):

    api_key = os.environ.get("GEMINI_API_KEY")

    if not api_key:
        raise Exception("Missing GEMINI_API_KEY")

    raw_text = limit_text(raw_text)

    schema_model = SCHEMA_ROUTER[doc_type]

    base_schema = schema_model.schema()

    schema = {
        "type": "OBJECT",
        "properties": base_schema["properties"],
        "required": list(base_schema["properties"].keys()),
    }

    prompt = f"""
You are a senior corporate legal analyst.

Extract structured data required to draft a {doc_type}.

Rules:
Return STRICT JSON only.
No markdown.
Missing values must be "To Be Determined".

DOCUMENT:
{raw_text}
"""

    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "response_mime_type": "application/json",
            "response_schema": schema,
        },
    }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:

        with urllib.request.urlopen(req, timeout=30) as response:

            result = json.loads(response.read().decode())

    except urllib.error.HTTPError as e:

        error_text = e.read().decode()
        logger.error(error_text)
        raise Exception("Gemini API error")

    candidates = result.get("candidates")

    if not candidates:
        raise Exception("Gemini returned no candidates")

    text = candidates[0]["content"]["parts"][0]["text"]

    return json.loads(text)

# ============================================================
# TEMPLATE ROUTER
# ============================================================

DOC_ROUTER = {
    "nda": get_premium_nda_template,
    "mou": get_premium_mou_template,
    "service_agreement": get_premium_service_agreement_template,
    "partnership_agreement": get_premium_partnership_agreement_template,
    "collaboration_agreement": get_premium_collaboration_agreement_template,
    "contract": get_premium_contract_template,
    "statement_of_agreement": get_premium_statement_of_agreement_template,
    "meeting_resolution": get_premium_meeting_resolution_template,
}

# ============================================================
# MAIN HANDLER
# ============================================================

def lambda_handler(event, context):

    try:

        raw_path = event.get("rawPath") or event.get("path") or ""

        body = json.loads(event.get("body", "{}"))

        s3_key = body.get("s3_key")
        doc_type = body.get("doc_type")

        if not s3_key or not doc_type:
            raise Exception("Missing s3_key or doc_type")

        if doc_type not in DOC_ROUTER:
            raise Exception("Unsupported document type")

        logger.info(f"Processing file: {s3_key}")

        obj = s3.get_object(Bucket=BUCKET, Key=s3_key)
        data = obj["Body"].read()

        ext = s3_key.split(".")[-1].lower()

        if ext == "txt":
            text = read_txt(data)

        elif ext == "docx":
            text = read_docx(data)

        elif ext == "pdf":
            text = read_pdf(data)

        else:
            raise Exception("Unsupported file type")

        # ------------------------------------------------
        # Gemini Extraction
        # ------------------------------------------------

        structured_raw = extract_legal_data(text, doc_type)

        schema_model = SCHEMA_ROUTER[doc_type]

        validated = schema_model(**structured_raw)

        structured = validated.dict()

        # ------------------------------------------------
        # Escape LaTeX
        # ------------------------------------------------

        structured = escape_latex(structured)

        # ------------------------------------------------
        # Generate LaTeX
        # ------------------------------------------------

        template = DOC_ROUTER[doc_type]()
        latex = template.safe_substitute(**structured)

        # ------------------------------------------------
        # Compile PDF
        # ------------------------------------------------

        pdf_bytes = compile_latex(latex)

        # ------------------------------------------------
        # Upload PDF
        # ------------------------------------------------

        pdf_key = f"generated/{uuid.uuid4()}.pdf"

        s3.put_object(
            Bucket=BUCKET,
            Key=pdf_key,
            Body=pdf_bytes,
            ContentType="application/pdf",
        )

        pdf_url = f"https://{BUCKET}.s3.amazonaws.com/{pdf_key}"

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "pdf_url": pdf_url,
                "latex": latex,
            }),
        }

    except Exception as e:

        logger.exception("Lambda execution failed")

        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }