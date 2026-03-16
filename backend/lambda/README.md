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

### Where configuration lives

- Web/mobile AWS IDs and URLs are configured via `project.config.json` (repo root) and applied with `python scripts/sync_config.py`.
- Lambda secrets stay in AWS (environment variables / secrets manager). Do not commit API keys.

### Known Limitations

- **Pydantic v1 API**: `pydantic_models.py` uses Pydantic v1 APIs (`.schema()`, `.dict()`). If upgrading to Pydantic v2, these must change to `.model_json_schema()` and `.model_dump()`.
