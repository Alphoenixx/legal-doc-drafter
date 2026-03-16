## Lambda (Python)

### Source

- `src/lambda_function.py` (handler)
- `src/pydantic_models.py`
- `src/templates.py`

Handler: `lambda_function.lambda_handler`

### Dependencies

Install locally (for packaging/testing):

```bash
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
```

### Notes

- Expects `GEMINI_API_KEY` and `BUCKET_NAME` environment variables.
- Expects a TeXLive layer mounted at `/opt/texlive/bin/x86_64-linux` (see `latex-aws-lambda-layer/`).

