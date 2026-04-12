# Kheder App – Developer Notes

## Current Status

- Core application runs from `server.py` and serves `KhederApp.html`.
- Roles:
  - `Admin`
  - `Förare`
  - `Förare + övervakare`
- Main tabs in use:
  - Översikt
  - Körning
  - Arbete
  - Ersättning
  - Förarstatus
  - Förare
  - Hjälp

## Stable Functional Areas

- Authentication and session handling are server-driven.
- Driver records in `Körning` are stored centrally in SQLite.
- `Arbete` is personal per signed-in user.
- `Förarstatus` mirrors current Arbete status for monitor/admin views.
- `Ersättning` is scoped by selected driver through `driver_id`.
- Driver profile data is required and stored centrally.
- Admin tools now include:
  - backup creation
  - backup restore
  - JSON export
  - document alerts
  - period reset
  - period inspection modal

## Important Architecture Rules

- `Arbete` is still driven by the embedded legacy page and browser runtime.
- Current Arbete status is synchronized centrally, but live behavior depends on the Arbete page being active.
- `Arbete` must remain personal. Do not convert it into a shared monitor page.
- Monitoring of other drivers belongs in `Förarstatus`, `Översikt`, `Körning`, and `Ersättning`.
- `Ersättning` is injected/scoped by the server. Keep driver scoping consistent with `driver_id`.

## Sensitive Areas

- Do not change role logic without checking:
  - session loading
  - selected driver scope
  - visibility of admin/monitor actions
- Do not change Arbete synchronization without checking:
  - `/api/arbete/statuses`
  - `/api/arbete/segments`
  - `/api/arbete/reset`
  - iframe message flow
- Do not modify database structure without:
  - keeping backward-compatible migrations in `init_db()`
  - verifying old databases still start correctly
- Backup restore replaces the live SQLite database. Always create a fresh backup before restore.

## Current Data Storage

- Main database:
  - `kheder_app.db`
- Backup directory:
  - `backups/`
- Main tables:
  - `users`
  - `sessions`
  - `driving_records`
  - `arbete_status`
  - `arbete_control`
  - `arbete_segments_state`
  - `ersattning_state`

## Driver Data Requirements

- Required fields for each driver:
  - display name
  - username
  - password on creation
  - legitimation number
  - legitimation expiry
  - phone
  - email
  - license expiry

## Document Alerts

- Alerts are based on:
  - legitimation expiry
  - license expiry
- Warning windows:
  - warning: 30 days or less
  - danger: 7 days or less
  - expired: overdue
- Email sending is available only if SMTP environment variables are configured.

## Backup / Restore Notes

- Backups are generated on the server and stored under `backups/`.
- JSON export is for archive/reference, not full runtime restore.
- Full system restore currently restores the SQLite database from a saved backup file.
- Before any major change:
  - create backup
  - verify app starts
  - verify login for Admin and one driver

## Testing Checklist For Future Changes

- Verify login:
  - Admin
  - Förare
  - Förare + övervakare
- Verify top status bar for current user.
- Verify `Förarstatus` updates and colors.
- Verify selected driver scope in:
  - Översikt
  - Körning
  - Ersättning
- Verify `Förare` page loads without errors.
- Verify backup/export/document alerts endpoints if admin features are touched.
- Run:
  - `python3 -m py_compile server.py`

## Recommended Next Phase

- Improve full central persistence of Arbete periods beyond browser-dependent behavior.
- Add precise period editing in addition to deletion.
- Add richer help content with role-based examples.
- Add automatic scheduled backups outside manual admin actions.
- Add production SMTP configuration for real alert emails.

## Warnings For Future Developers

- Do not assume legacy embedded pages are stateless.
- Do not remove the driver scoping banner without preserving clarity elsewhere.
- Do not add non-Swedish UI text.
- Do not restore backup blindly on a live system without creating a fresh backup first.
- If something breaks after a schema change, check `init_db()` migrations first.
