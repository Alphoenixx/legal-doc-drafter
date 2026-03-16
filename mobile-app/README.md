## Mobile app (Flutter)

Flutter project root is `mobile-app/`.

### Configure for your AWS account

This repo centralizes client configuration in one root file:

1. Copy `project.config.example.json` → `project.config.json` (repo root)
2. Edit `project.config.json` with your AWS IDs/URLs
3. Generate the Flutter config file:

```bash
python scripts/sync_config.py
```

This generates:

- `mobile-app/lib/app_config.dart`

### Setup

```bash
flutter pub get
```

### Run

```bash
flutter run
```
