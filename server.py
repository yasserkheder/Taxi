from __future__ import annotations

import json
import os
import secrets
import shutil
import sqlite3
import smtplib
import sys
from datetime import datetime, timedelta, date, UTC
from email.message import EmailMessage
from hashlib import pbkdf2_hmac
from http import cookies
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "kheder_app.db"
HTML_PATH = BASE_DIR / "KhederApp.html"
FK_TAXI_PATH = BASE_DIR / "FK Taxi.html"
ERSATTNING_PATH = BASE_DIR / "Ersättning.html"
BACKUP_DIR = BASE_DIR / "backups"
DEFAULT_ADMIN_USERNAME = os.environ.get("KHEDER_ADMIN_USERNAME", "Admin")
DEFAULT_ADMIN_PASSWORD = os.environ.get("KHEDER_ADMIN_PASSWORD", "Admin0255")
SESSION_COOKIE = "kheder_session"
SESSION_DAYS = 30
SMTP_HOST = os.environ.get("KHEDER_SMTP_HOST", "").strip()
SMTP_PORT = int(os.environ.get("KHEDER_SMTP_PORT", "587"))
SMTP_USERNAME = os.environ.get("KHEDER_SMTP_USERNAME", "").strip()
SMTP_PASSWORD = os.environ.get("KHEDER_SMTP_PASSWORD", "")
SMTP_FROM = os.environ.get("KHEDER_SMTP_FROM", "").strip()
ALERT_EMAILS = [value.strip() for value in os.environ.get("KHEDER_ALERT_EMAILS", "").split(",") if value.strip()]


def utc_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def now_iso() -> str:
    return utc_now().replace(microsecond=0).isoformat()


def parse_iso_date(value: str | None) -> date:
    if not value:
        return utc_now().date()
    return datetime.strptime(value, "%Y-%m-%d").date()


def parse_optional_iso_date(value: str | None) -> date | None:
    if not value:
        return None
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None


def parse_time(value: str) -> datetime:
    return datetime.strptime(value, "%H:%M")


def hash_password(password: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    digest = pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120000).hex()
    return f"{salt}${digest}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt, expected = stored.split("$", 1)
    except ValueError:
        return False
    digest = pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120000).hex()
    return secrets.compare_digest(digest, expected)


def find_user_by_username(connection: sqlite3.Connection, username: str) -> sqlite3.Row | None:
    return connection.execute(
        "SELECT * FROM users WHERE username = ? COLLATE NOCASE",
        (username.strip(),),
    ).fetchone()


def username_exists(connection: sqlite3.Connection, username: str, exclude_user_id: int | None = None) -> bool:
    query = "SELECT id FROM users WHERE username = ? COLLATE NOCASE"
    params: list[object] = [username.strip()]
    if exclude_user_id is not None:
        query += " AND id != ?"
        params.append(exclude_user_id)
    return connection.execute(query, params).fetchone() is not None


def user_can_monitor(user: sqlite3.Row | dict) -> bool:
    return user["role"] == "admin" or bool(user["can_monitor"])


def get_db() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_db() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                display_name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('admin', 'driver')),
                can_monitor INTEGER NOT NULL DEFAULT 0,
                active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                expires_at TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS driving_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                korning_number TEXT NOT NULL,
                work_date TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                price REAL NULL,
                duration_minutes INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS arbete_status (
                user_id INTEGER PRIMARY KEY,
                state TEXT NOT NULL DEFAULT 'rest' CHECK(state IN ('work', 'rest')),
                timer_text TEXT NOT NULL DEFAULT '00:00:00',
                work_hours_text TEXT NOT NULL DEFAULT '00:00:00',
                rest_hours_text TEXT NOT NULL DEFAULT '00:00:00',
                window_mode INTEGER NOT NULL DEFAULT 24,
                warning_level TEXT NOT NULL DEFAULT 'normal' CHECK(warning_level IN ('normal', 'warning', 'danger')),
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS arbete_control (
                user_id INTEGER PRIMARY KEY,
                reset_version INTEGER NOT NULL DEFAULT 0,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS arbete_segments_state (
                user_id INTEGER PRIMARY KEY,
                state_json TEXT NOT NULL,
                admin_version INTEGER NOT NULL DEFAULT 0,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS ersattning_state (
                user_id INTEGER PRIMARY KEY,
                state_json TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );
            """
        )
        user_columns = {row["name"] for row in connection.execute("PRAGMA table_info(users)").fetchall()}
        if "can_monitor" not in user_columns:
            connection.execute("ALTER TABLE users ADD COLUMN can_monitor INTEGER NOT NULL DEFAULT 0")
        if "legitimation_number" not in user_columns:
            connection.execute("ALTER TABLE users ADD COLUMN legitimation_number TEXT NOT NULL DEFAULT ''")
        if "legitimation_expiry" not in user_columns:
            connection.execute("ALTER TABLE users ADD COLUMN legitimation_expiry TEXT NOT NULL DEFAULT ''")
        if "phone" not in user_columns:
            connection.execute("ALTER TABLE users ADD COLUMN phone TEXT NOT NULL DEFAULT ''")
        if "email" not in user_columns:
            connection.execute("ALTER TABLE users ADD COLUMN email TEXT NOT NULL DEFAULT ''")
        if "license_expiry" not in user_columns:
            connection.execute("ALTER TABLE users ADD COLUMN license_expiry TEXT NOT NULL DEFAULT ''")
        existing = find_user_by_username(connection, DEFAULT_ADMIN_USERNAME)
        if existing:
            timestamp = now_iso()
            connection.execute(
                """
                UPDATE users
                SET display_name = ?, password_hash = ?, can_monitor = 1, active = 1, updated_at = ?
                WHERE id = ?
                """,
                (
                    "Kheder Admin",
                    hash_password(DEFAULT_ADMIN_PASSWORD),
                    timestamp,
                    existing["id"],
                ),
            )
        else:
            legacy_admin = connection.execute(
                "SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1"
            ).fetchone()
            timestamp = now_iso()
            if legacy_admin:
                connection.execute(
                    """
                    UPDATE users
                    SET username = ?, display_name = ?, password_hash = ?, can_monitor = 1, active = 1, updated_at = ?
                    WHERE id = ?
                    """,
                    (
                        DEFAULT_ADMIN_USERNAME,
                        "Kheder Admin",
                        hash_password(DEFAULT_ADMIN_PASSWORD),
                        timestamp,
                        legacy_admin["id"],
                    ),
                )
            else:
                connection.execute(
                """
                INSERT INTO users (username, display_name, password_hash, role, can_monitor, active, created_at, updated_at)
                VALUES (?, ?, ?, 'admin', 1, 1, ?, ?)
                """,
                    (
                        DEFAULT_ADMIN_USERNAME,
                        "Kheder Admin",
                        hash_password(DEFAULT_ADMIN_PASSWORD),
                        timestamp,
                        timestamp,
                    ),
                )
        connection.execute("DELETE FROM sessions WHERE expires_at <= ?", (now_iso(),))
        connection.commit()


def user_to_dict(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "username": row["username"],
        "displayName": row["display_name"],
        "role": row["role"],
        "canMonitor": bool(row["can_monitor"]),
        "active": bool(row["active"]),
        "legitimationNumber": row["legitimation_number"],
        "legitimationExpiry": row["legitimation_expiry"],
        "phone": row["phone"],
        "email": row["email"],
        "licenseExpiry": row["license_expiry"],
    }


def build_document_alerts(connection: sqlite3.Connection) -> list[dict]:
    today = utc_now().date()
    alerts: list[dict] = []
    rows = connection.execute(
        "SELECT * FROM users WHERE active = 1 AND role = 'driver' ORDER BY can_monitor DESC, display_name ASC"
    ).fetchall()
    for row in rows:
        checks = [
            ("Legitimation", parse_optional_iso_date(row["legitimation_expiry"])),
            ("Körkort", parse_optional_iso_date(row["license_expiry"])),
        ]
        for label, expiry_date in checks:
            if not expiry_date:
                continue
            days_left = (expiry_date - today).days
            if days_left < 0:
                level = "danger"
                note = f"{label} gick ut för {abs(days_left)} dagar sedan"
            elif days_left <= 7:
                level = "danger"
                note = f"{label} går ut om {days_left} dagar"
            elif days_left <= 30:
                level = "warning"
                note = f"{label} går ut om {days_left} dagar"
            else:
                continue
            alerts.append(
                {
                    "userId": row["id"],
                    "displayName": row["display_name"],
                    "username": row["username"],
                    "documentLabel": label,
                    "expiryDate": expiry_date.isoformat(),
                    "daysLeft": days_left,
                    "level": level,
                    "message": note,
                }
            )
    return alerts


def smtp_is_configured() -> bool:
    return bool(SMTP_HOST and SMTP_FROM and (ALERT_EMAILS or SMTP_USERNAME))


def send_document_alert_email(alerts: list[dict]) -> tuple[bool, str]:
    recipients = ALERT_EMAILS[:] or ([SMTP_USERNAME] if SMTP_USERNAME else [])
    if not smtp_is_configured() or not recipients or not alerts:
        return False, "E-post är inte konfigurerad"
    body_lines = ["Följande dokument kräver uppföljning:", ""]
    for alert in alerts:
        body_lines.append(
            f"- {alert['displayName']} ({alert['username']}): {alert['documentLabel']} – {alert['message']} – utgångsdatum {alert['expiryDate']}"
        )
    message = EmailMessage()
    message["Subject"] = "Kheder App – dokumentpåminnelser"
    message["From"] = SMTP_FROM
    message["To"] = ", ".join(recipients)
    message.set_content("\n".join(body_lines))
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as smtp:
        smtp.starttls()
        if SMTP_USERNAME:
            smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
        smtp.send_message(message)
    return True, "E-post skickad"


def list_backups() -> list[dict]:
    BACKUP_DIR.mkdir(exist_ok=True)
    backups: list[dict] = []
    for path in sorted(BACKUP_DIR.glob("kheder_app_*.db"), reverse=True):
        stat = path.stat()
        backups.append(
            {
                "name": path.name,
                "size": stat.st_size,
                "modifiedAt": datetime.fromtimestamp(stat.st_mtime).isoformat(timespec="seconds"),
            }
        )
    return backups


def create_backup_file() -> Path:
    BACKUP_DIR.mkdir(exist_ok=True)
    backup_path = BACKUP_DIR / f"kheder_app_{utc_now().strftime('%Y%m%d_%H%M%S')}.db"
    with sqlite3.connect(DB_PATH) as source, sqlite3.connect(backup_path) as destination:
        source.backup(destination)
    return backup_path


def export_system_payload(connection: sqlite3.Connection) -> dict:
    tables = [
        "users",
        "driving_records",
        "arbete_status",
        "arbete_control",
        "arbete_segments_state",
        "ersattning_state",
    ]
    export = {"exportedAt": now_iso(), "tables": {}}
    for table in tables:
        rows = connection.execute(f"SELECT * FROM {table}").fetchall()
        export["tables"][table] = [dict(row) for row in rows]
    return export


def record_to_dict(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "userId": row["user_id"],
        "driverName": row["display_name"],
        "korningNumber": row["korning_number"],
        "date": row["work_date"],
        "startTime": row["start_time"],
        "endTime": row["end_time"],
        "price": row["price"],
        "durationMinutes": row["duration_minutes"],
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }


def week_bounds(target_date: date) -> tuple[date, date]:
    start = target_date - timedelta(days=target_date.weekday())
    end = start + timedelta(days=6)
    return start, end


def month_bounds(target_date: date) -> tuple[date, date]:
    start = target_date.replace(day=1)
    if target_date.month == 12:
        end = target_date.replace(year=target_date.year + 1, month=1, day=1) - timedelta(days=1)
    else:
        end = target_date.replace(month=target_date.month + 1, day=1) - timedelta(days=1)
    return start, end


def aggregate_days(records: list[sqlite3.Row]) -> list[dict]:
    grouped: dict[str, dict] = {}
    for row in records:
        entry = grouped.setdefault(
            row["work_date"],
            {
                "date": row["work_date"],
                "total": 0.0,
                "recordCount": 0,
                "missingPrice": False,
                "durationMinutes": 0,
            },
        )
        entry["recordCount"] += 1
        entry["durationMinutes"] += row["duration_minutes"]
        if row["price"] is None:
            entry["missingPrice"] = True
        else:
            entry["total"] += float(row["price"])
    return [grouped[key] for key in sorted(grouped.keys(), reverse=True)]


def build_dashboard(connection: sqlite3.Connection, current_user: sqlite3.Row, target_date: date, requested_user_id: int | None) -> dict:
    if user_can_monitor(current_user):
        filter_user_id = requested_user_id
    else:
        filter_user_id = current_user["id"]
    day_start = target_date.isoformat()
    week_start, week_end = week_bounds(target_date)
    month_start, month_end = month_bounds(target_date)

    query = """
        SELECT dr.*, u.display_name
        FROM driving_records dr
        JOIN users u ON u.id = dr.user_id
        WHERE dr.work_date BETWEEN ? AND ?
          AND u.active = 1
    """
    params: list[object] = [month_start.isoformat(), month_end.isoformat()]
    if filter_user_id:
        query += " AND dr.user_id = ?"
        params.append(filter_user_id)
    query += " ORDER BY dr.work_date DESC, dr.start_time DESC, dr.id DESC"
    month_records = connection.execute(query, params).fetchall()

    today_records = [row for row in month_records if row["work_date"] == day_start]
    week_records = [
        row
        for row in month_records
        if week_start.isoformat() <= row["work_date"] <= week_end.isoformat()
    ]

    def totals(rows: list[sqlite3.Row]) -> dict:
        total_value = sum(float(row["price"]) for row in rows if row["price"] is not None)
        return {
            "total": round(total_value, 2),
            "recordCount": len(rows),
            "durationMinutes": sum(int(row["duration_minutes"]) for row in rows),
            "missingPrice": any(row["price"] is None for row in rows),
        }

    day_totals = totals(today_records)
    week_totals = totals(week_records)
    month_totals = totals(month_records)

    return {
        "selectedDate": day_start,
        "filterUserId": filter_user_id,
        "day": {
            **day_totals,
            "records": [record_to_dict(row) for row in today_records],
        },
        "week": {
            **week_totals,
            "days": aggregate_days(week_records),
            "startDate": week_start.isoformat(),
            "endDate": week_end.isoformat(),
        },
        "month": {
            **month_totals,
            "days": aggregate_days(month_records),
            "startDate": month_start.isoformat(),
            "endDate": month_end.isoformat(),
        },
    }


def build_arbete_status_payload(connection: sqlite3.Connection, current_user: sqlite3.Row) -> dict:
    def row_to_status(row: sqlite3.Row | None) -> dict | None:
        if not row:
            return None
        return {
            "userId": row["id"],
            "displayName": row["display_name"],
            "username": row["username"],
            "role": row["role"],
            "canMonitor": bool(row["can_monitor"]),
            "state": row["state"] or "rest",
            "timerText": row["timer_text"] or "00:00:00",
            "workHoursText": row["work_hours_text"] or "00:00:00",
            "restHoursText": row["rest_hours_text"] or "00:00:00",
            "windowMode": row["window_mode"] or 24,
            "warningLevel": row["warning_level"] or "normal",
            "updatedAt": row["updated_at"],
        }

    if user_can_monitor(current_user):
        rows = connection.execute(
            """
            SELECT u.id, u.display_name, u.username, u.role, u.can_monitor, s.state, s.timer_text, s.work_hours_text,
                   s.rest_hours_text, s.window_mode, s.warning_level, s.updated_at
            FROM users u
            LEFT JOIN arbete_status s ON s.user_id = u.id
            WHERE u.active = 1 AND u.role = 'driver'
            ORDER BY u.can_monitor DESC, u.display_name ASC
            """
        ).fetchall()
    else:
        rows = connection.execute(
            """
            SELECT u.id, u.display_name, u.username, u.role, u.can_monitor, s.state, s.timer_text, s.work_hours_text,
                   s.rest_hours_text, s.window_mode, s.warning_level, s.updated_at
            FROM users u
            LEFT JOIN arbete_status s ON s.user_id = u.id
            WHERE u.active = 1 AND u.id = ?
            """,
            (current_user["id"],),
        ).fetchall()

    self_row = connection.execute(
        """
        SELECT u.id, u.display_name, u.username, u.role, u.can_monitor, s.state, s.timer_text, s.work_hours_text,
               s.rest_hours_text, s.window_mode, s.warning_level, s.updated_at
        FROM users u
        LEFT JOIN arbete_status s ON s.user_id = u.id
        WHERE u.active = 1 AND u.id = ?
        """,
        (current_user["id"],),
    ).fetchone()

    statuses = [row_to_status(row) for row in rows]
    return {"statuses": [status for status in statuses if status], "selfStatus": row_to_status(self_row)}


def build_arbete_control_payload(connection: sqlite3.Connection, current_user: sqlite3.Row) -> dict:
    row = connection.execute(
        "SELECT reset_version, updated_at FROM arbete_control WHERE user_id = ?",
        (current_user["id"],),
    ).fetchone()
    return {
        "resetVersion": int(row["reset_version"]) if row else 0,
        "updatedAt": row["updated_at"] if row else None,
    }


def resolve_requested_driver(connection: sqlite3.Connection, current_user: sqlite3.Row, requested_user_id: int | None) -> sqlite3.Row:
    if requested_user_id and user_can_monitor(current_user):
        target_user = connection.execute(
            "SELECT * FROM users WHERE id = ? AND active = 1 AND role = 'driver'",
            (requested_user_id,),
        ).fetchone()
        if target_user:
            return target_user
    return current_user


def build_ersattning_state_payload(connection: sqlite3.Connection, target_user: sqlite3.Row) -> dict:
    row = connection.execute(
        "SELECT state_json, updated_at FROM ersattning_state WHERE user_id = ?",
        (target_user["id"],),
    ).fetchone()
    state = {}
    if row and row["state_json"]:
        try:
            state = json.loads(row["state_json"])
        except json.JSONDecodeError:
            state = {}
    state = state if isinstance(state, dict) else {}
    company_info = state.get("companyInfo") if isinstance(state.get("companyInfo"), dict) else {}
    company_info["driverName"] = target_user["display_name"]
    state["companyInfo"] = company_info
    quick_calc_draft = state.get("quickCalcDraft") if isinstance(state.get("quickCalcDraft"), dict) else {}
    quick_calc_draft["driverName"] = target_user["display_name"]
    state["quickCalcDraft"] = quick_calc_draft
    return {"state": state, "updatedAt": row["updated_at"] if row else None}


def normalize_arbete_segments_state(raw: dict | None) -> dict:
    state = raw if isinstance(raw, dict) else {}
    normalized_segments: list[dict] = []
    for item in state.get("segments", []):
        if not isinstance(item, dict):
            continue
        segment_type = "work" if item.get("type") == "work" else "rest"
        try:
            start = int(item.get("start"))
            end = int(item.get("end"))
        except (TypeError, ValueError):
            continue
        if end <= start:
            continue
        normalized_segments.append({"type": segment_type, "start": start, "end": end})
    current_segment = None
    if isinstance(state.get("currentSegment"), dict):
        current = state["currentSegment"]
        try:
            start = int(current.get("start"))
        except (TypeError, ValueError):
            start = None
        if start:
            current_segment = {
                "type": "work" if current.get("type") == "work" else "rest",
                "start": start,
            }
    return {
        "segments": normalized_segments,
        "currentSegment": current_segment,
        "timelineShow48": bool(state.get("timelineShow48")),
    }


def build_arbete_segments_payload(connection: sqlite3.Connection, target_user: sqlite3.Row) -> dict:
    row = connection.execute(
        "SELECT state_json, admin_version, updated_at FROM arbete_segments_state WHERE user_id = ?",
        (target_user["id"],),
    ).fetchone()
    state = {"segments": [], "currentSegment": None, "timelineShow48": False}
    admin_version = 0
    updated_at = None
    if row and row["state_json"]:
        try:
            state = normalize_arbete_segments_state(json.loads(row["state_json"]))
        except json.JSONDecodeError:
            state = {"segments": [], "currentSegment": None, "timelineShow48": False}
        admin_version = int(row["admin_version"] or 0)
        updated_at = row["updated_at"]
    return {
        "user": user_to_dict(target_user),
        "state": state,
        "adminVersion": admin_version,
        "updatedAt": updated_at,
    }


class AppHandler(BaseHTTPRequestHandler):
    server_version = "KhederApp/0.1"

    def log_message(self, format: str, *args) -> None:
        sys.stdout.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), format % args))

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path in {"/", "/KhederApp.html"}:
            return self.serve_html()
        if parsed.path == "/legacy/fk-taxi":
            return self.serve_fk_taxi_arbete()
        if parsed.path == "/legacy/ersattning":
            return self.serve_ersattning_page(parsed)
        if parsed.path == "/@vite/client":
            return self.serve_text("export default {};", "application/javascript; charset=utf-8")
        if parsed.path == "/favicon.ico":
            return self.serve_text("", "image/x-icon")
        if parsed.path == "/api/health":
            return self.json_response(200, {"ok": True})
        if parsed.path == "/api/session":
            return self.handle_session()
        if parsed.path == "/api/users":
            return self.handle_users_list()
        if parsed.path == "/api/dashboard":
            return self.handle_dashboard(parsed)
        if parsed.path == "/api/arbete/statuses":
            return self.handle_arbete_statuses()
        if parsed.path == "/api/arbete/control":
            return self.handle_arbete_control()
        if parsed.path == "/api/arbete/segments":
            return self.handle_arbete_segments_get(parsed)
        if parsed.path == "/api/admin/backups":
            return self.handle_admin_backups()
        if parsed.path == "/api/admin/export":
            return self.handle_admin_export()
        if parsed.path == "/api/admin/document-alerts":
            return self.handle_admin_document_alerts()
        if parsed.path == "/api/ersattning/state":
            return self.handle_ersattning_state_get(parsed)
        self.json_response(404, {"error": "Not found"})

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/login":
            return self.handle_login()
        if parsed.path == "/api/logout":
            return self.handle_logout()
        if parsed.path == "/api/users":
            return self.handle_user_create()
        if parsed.path == "/api/records":
            return self.handle_record_create()
        if parsed.path == "/api/arbete/status":
            return self.handle_arbete_status_update()
        if parsed.path == "/api/arbete/reset":
            return self.handle_arbete_reset()
        if parsed.path == "/api/arbete/segments/sync":
            return self.handle_arbete_segments_sync()
        if parsed.path == "/api/arbete/segments/delete":
            return self.handle_arbete_segments_delete()
        if parsed.path == "/api/admin/backup/create":
            return self.handle_admin_backup_create()
        if parsed.path == "/api/admin/backup/restore":
            return self.handle_admin_backup_restore()
        if parsed.path == "/api/admin/document-alerts/send":
            return self.handle_admin_document_alerts_send()
        if parsed.path == "/api/ersattning/state":
            return self.handle_ersattning_state_update()
        self.json_response(404, {"error": "Not found"})

    def do_PUT(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/users/"):
            return self.handle_user_update(parsed.path)
        if parsed.path.startswith("/api/records/"):
            return self.handle_record_update(parsed.path)
        self.json_response(404, {"error": "Not found"})

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/users/"):
            return self.handle_user_delete(parsed.path)
        if parsed.path.startswith("/api/records/"):
            return self.handle_record_delete(parsed.path)
        self.json_response(404, {"error": "Not found"})

    def serve_html(self) -> None:
        if not HTML_PATH.exists():
            return self.json_response(500, {"error": "KhederApp.html not found"})
        content = HTML_PATH.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def serve_file(self, file_path: Path, content_type: str) -> None:
        if not file_path.exists():
            return self.json_response(404, {"error": "File not found"})
        content = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def serve_fk_taxi_arbete(self) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
        if not FK_TAXI_PATH.exists():
            return self.json_response(404, {"error": "FK Taxi.html not found"})
        html = FK_TAXI_PATH.read_text(encoding="utf-8")
        html = html.replace("fkTaxiAppState", f"fkTaxiAppState_{user['id']}")
        html = html.replace("fkTaxiNotes", f"fkTaxiNotes_{user['id']}")
        driver_name = json.dumps(user["display_name"])
        driver_id = json.dumps(f"session-{user['id']}")
        injection = f"""
<style>
    .tab-bar-container, #tab-predictions, #tab-favorites, #tab-planning, #tab-history, #tab-stats,
    #tab-drivers, #tab-addons, #tab-company, #tab-help, #tab-settings {{
        display: none !important;
    }}
    #holiday-toggle-label, .driver-info, #current-driver-name {{
        display: none !important;
    }}
    body {{
        background: transparent !important;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        overflow-x: hidden !important;
    }}
    #app {{
        padding-top: 0 !important;
    }}
    .header {{
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        margin-bottom: 12px !important;
        background: rgba(255, 255, 255, 0.78) !important;
        border: 1px solid rgba(148, 163, 184, 0.12) !important;
        border-radius: 26px !important;
        padding: 14px !important;
        backdrop-filter: blur(18px) !important;
    }}
    .time-display {{
        justify-self: center !important;
    }}
    .timeline-section {{
        margin-top: 0 !important;
        background: rgba(255, 255, 255, 0.9) !important;
        border-radius: 26px !important;
        padding: 16px !important;
    }}
    .content-card, .stat-card, .current-period {{
        box-shadow: 0 18px 38px -28px rgba(15, 23, 42, 0.35) !important;
        border-radius: 24px !important;
    }}
    .control-buttons {{
        margin-top: 14px !important;
    }}
    .tab-content {{
        padding-top: 0 !important;
    }}
    .tab-pane {{ display: none !important; }}
    #tab-work {{ display: block !important; }}
</style>
<script>
    (function() {{
        const loggedInDriver = {{ id: {driver_id}, name: {driver_name} }};
        const syncLoggedInDriver = () => {{
            if (typeof appState === 'undefined') return;
            appState.drivers = [loggedInDriver];
            appState.currentDriver = loggedInDriver;
            if (typeof updateCurrentDriverDisplay === 'function') updateCurrentDriverDisplay();
            if (typeof updateDriverSelect === 'function') updateDriverSelect();
            if (typeof updateDriversList === 'function') updateDriversList();
            if (typeof saveData === 'function') saveData();
        }};
        const collectStatus = () => {{
            const periodType = (document.getElementById('period-type')?.textContent || '').trim();
            const periodTimer = (document.getElementById('period-timer')?.textContent || '00:00:00').trim();
            const workHours = (document.getElementById('work-hours')?.textContent || '00:00:00').trim();
            const restHours = (document.getElementById('rest-hours')?.textContent || '00:00:00').trim();
            const windowMode = (document.getElementById('timeline-window-title')?.textContent || '').includes('48h') ? 48 : 24;
            const workCard = document.getElementById('work-card');
            const state = periodType.includes('ARBETE') ? 'work' : 'rest';
            const style = workCard ? (workCard.style.background || '') : '';
            let warningLevel = 'normal';
            if (state === 'work') {{
                if ((style || '').includes('244, 67, 54') || (style || '').includes('211, 47, 47')) warningLevel = 'danger';
                else if (style && style !== 'none') warningLevel = 'warning';
            }}
            return {{
                state,
                timerText: periodTimer,
                workHoursText: workHours,
                restHoursText: restHours,
                windowMode,
                warningLevel
            }};
        }};
        let lastUiKey = '';
        let lastPersistKey = '';
        let lastSegmentsSnapshot = '';
        let lastAdminSegmentsVersion = 0;
        const applyAdminReset = (resetVersion) => {{
            if (typeof appState === 'undefined') return;
            const appliedVersion = Number(appState.adminResetVersion || 0);
            if (appliedVersion >= Number(resetVersion || 0)) return;
            appState.segments = [];
            appState.currentSegment = null;
            appState.adminResetVersion = Number(resetVersion || 0);
            if (typeof saveData === 'function') saveData();
            if (typeof fullUIUpdate === 'function') fullUIUpdate();
            if (typeof visaMeddelande === 'function') visaMeddelande('⛔ Arbete-perioder nollställda av admin');
        }};
        const collectSegmentsState = () => {{
            if (typeof appState === 'undefined') return {{ segments: [], currentSegment: null, timelineShow48: false }};
            return {{
                segments: Array.isArray(appState.segments) ? appState.segments.map((segment) => ({{
                    type: segment.type === 'work' ? 'work' : 'rest',
                    start: Number(segment.start || 0),
                    end: Number(segment.end || 0)
                }})).filter((segment) => segment.end > segment.start) : [],
                currentSegment: appState.currentSegment ? {{
                    type: appState.currentSegment.type === 'work' ? 'work' : 'rest',
                    start: Number(appState.currentSegment.start || 0)
                }} : null,
                timelineShow48: !!appState.timelineShow48
            }};
        }};
        const applyServerSegmentsState = (state, adminVersion) => {{
            if (typeof appState === 'undefined') return;
            const normalized = state || {{ segments: [], currentSegment: null, timelineShow48: false }};
            appState.segments = Array.isArray(normalized.segments) ? normalized.segments : [];
            appState.currentSegment = normalized.currentSegment || null;
            appState.timelineShow48 = !!normalized.timelineShow48;
            appState.adminSegmentsVersion = Number(adminVersion || 0);
            lastAdminSegmentsVersion = Number(adminVersion || 0);
            lastSegmentsSnapshot = JSON.stringify(collectSegmentsState());
            if (typeof saveData === 'function') saveData();
            if (typeof fullUIUpdate === 'function') fullUIUpdate();
            syncStatus(true);
        }};
        const postStatusToParent = (payload) => {{
            try {{
                if (window.parent && window.parent !== window) {{
                    window.parent.postMessage({{ type: 'arbete-status', payload }}, window.location.origin);
                }}
            }} catch (error) {{}}
        }};
        const persistStatus = async (payload) => {{
            try {{
                await fetch('/api/arbete/status', {{
                    method: 'POST',
                    headers: {{ 'Content-Type': 'application/json' }},
                    credentials: 'same-origin',
                    body: JSON.stringify(payload)
                }});
            }} catch (error) {{}}
        }};
        const syncSegmentsState = async () => {{
            try {{
                const state = collectSegmentsState();
                const serialized = JSON.stringify(state);
                if (serialized === lastSegmentsSnapshot) return;
                lastSegmentsSnapshot = serialized;
                const response = await fetch('/api/arbete/segments/sync', {{
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify({{ state }})
                }});
                if (!response.ok) return;
                const data = await response.json();
                lastAdminSegmentsVersion = Number(data.adminVersion || lastAdminSegmentsVersion || 0);
            }} catch (error) {{}}
        }};
        const syncSegmentsControl = async () => {{
            try {{
                const response = await fetch('/api/arbete/segments', {{ credentials: 'same-origin' }});
                if (!response.ok) return;
                const data = await response.json();
                const nextVersion = Number(data.adminVersion || 0);
                const currentVersion = Number((window.appState && appState.adminSegmentsVersion) || lastAdminSegmentsVersion || 0);
                if (nextVersion > currentVersion) {{
                    applyServerSegmentsState(data.state, nextVersion);
                }}
            }} catch (error) {{}}
        }};
        const syncControl = async () => {{
            try {{
                const response = await fetch('/api/arbete/control', {{ credentials: 'same-origin' }});
                if (!response.ok) return;
                const data = await response.json();
                if (Number(data.resetVersion || 0) > Number((window.appState && appState.adminResetVersion) || 0)) {{
                    applyAdminReset(data.resetVersion);
                    syncStatus(true);
                }}
            }} catch (error) {{}}
        }};
        const syncStatus = (force = false) => {{
            const payload = collectStatus();
            const minuteTimer = (payload.timerText || '00:00:00').slice(0, 5);
            const workMinute = (payload.workHoursText || '00:00:00').slice(0, 5);
            const restMinute = (payload.restHoursText || '00:00:00').slice(0, 5);
            const uiKey = [payload.state, payload.warningLevel, minuteTimer].join('|');
            const persistKey = [payload.state, payload.warningLevel, minuteTimer, workMinute, restMinute, payload.windowMode].join('|');
            if (force || uiKey !== lastUiKey) {{
                postStatusToParent(payload);
                lastUiKey = uiKey;
            }}
            if (force || persistKey !== lastPersistKey) {{
                persistStatus(payload);
                lastPersistKey = persistKey;
            }}
        }};
        window.addEventListener('load', () => {{
            syncLoggedInDriver();
            if (window.showTab) window.showTab('work');
            syncStatus(true);
            syncControl();
            syncSegmentsState();
            syncSegmentsControl();
            setTimeout(syncLoggedInDriver, 250);
            setInterval(() => {{
                syncStatus();
                syncControl();
                syncSegmentsState();
                syncSegmentsControl();
            }}, 1000);
        }});
    }})();
</script>
"""
        html = html.replace("</head>", injection + "\n</head>")
        self.serve_text(html, "text/html; charset=utf-8")

    def serve_ersattning_page(self, parsed) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            query = parse_qs(parsed.query)
            requested_user_id = None
            try:
                requested_user_id = int(query.get("driver_id", [""])[0]) if query.get("driver_id") else None
            except ValueError:
                requested_user_id = None
            target_user = resolve_requested_driver(connection, user, requested_user_id)
            state_payload = build_ersattning_state_payload(connection, target_user)
        if not ERSATTNING_PATH.exists():
            return self.json_response(404, {"error": "Ersättning.html not found"})
        html = ERSATTNING_PATH.read_text(encoding="utf-8")
        context = {
            "storagePrefix": f"kheder_ersattning_{target_user['id']}_",
            "targetUser": {
                "id": target_user["id"],
                "displayName": target_user["display_name"],
                "username": target_user["username"],
            },
            "initialState": state_payload["state"],
        }
        injection = f"""
<style>
    .kheder-ers-scope {{
        margin: 14px 16px 0;
        padding: 10px 14px;
        border-radius: 18px;
        background: rgba(219, 234, 254, 0.7);
        color: #1d4ed8;
        border: 1px solid rgba(147, 197, 253, 0.42);
        font: 800 13px/1.2 Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        display: inline-flex;
        gap: 8px;
        align-items: center;
    }}
</style>
<script>
    window.__ERS_CONTEXT__ = {json.dumps(context, ensure_ascii=False)};
    (function() {{
        const ctx = window.__ERS_CONTEXT__ || {{}};
        const STORAGE_KEYS = ['orders', 'weeklySettings', 'availableWeeks', 'weekUiSettings', 'companyInfo', 'appUiState', 'quickCalcDraft', 'quickCalcRecords'];
        const storageProto = Storage.prototype;
        const nativeGetItem = storageProto.getItem;
        const nativeSetItem = storageProto.setItem;
        const nativeRemoveItem = storageProto.removeItem;
        const scopedKey = (key) => STORAGE_KEYS.includes(key) ? `${{ctx.storagePrefix || ''}}${{key}}` : key;
        const seedState = () => {{
            const initialState = ctx.initialState || {{}};
            STORAGE_KEYS.forEach((key) => {{
                const scoped = scopedKey(key);
                if (Object.prototype.hasOwnProperty.call(initialState, key)) {{
                    nativeSetItem.call(window.localStorage, scoped, JSON.stringify(initialState[key]));
                }} else {{
                    nativeRemoveItem.call(window.localStorage, scoped);
                }}
            }});
        }};
        const buildPayload = () => {{
            const state = {{}};
            STORAGE_KEYS.forEach((key) => {{
                const value = nativeGetItem.call(window.localStorage, scopedKey(key));
                if (value === null) return;
                try {{
                    state[key] = JSON.parse(value);
                }} catch (error) {{}}
            }});
            return state;
        }};
        let saveTimer = null;
        const schedulePersist = () => {{
            clearTimeout(saveTimer);
            saveTimer = setTimeout(() => {{
                fetch('/api/ersattning/state', {{
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify({{ userId: ctx.targetUser?.id, state: buildPayload() }})
                }}).catch(() => {{}});
            }}, 250);
        }};
        seedState();
        storageProto.getItem = function(key) {{
            if (this === window.localStorage) {{
                return nativeGetItem.call(this, scopedKey(key));
            }}
            return nativeGetItem.call(this, key);
        }};
        storageProto.setItem = function(key, value) {{
            if (this === window.localStorage) {{
                nativeSetItem.call(this, scopedKey(key), value);
                if (STORAGE_KEYS.includes(key)) schedulePersist();
                return;
            }}
            return nativeSetItem.call(this, key, value);
        }};
        storageProto.removeItem = function(key) {{
            if (this === window.localStorage) {{
                nativeRemoveItem.call(this, scopedKey(key));
                if (STORAGE_KEYS.includes(key)) schedulePersist();
                return;
            }}
            return nativeRemoveItem.call(this, key);
        }};
    }})();
</script>
"""
        html = html.replace("</head>", injection + "\n</head>")
        html = html.replace(
            "<body x-data=\"app()\" x-init=\"init()\" class=\"min-h-screen\">",
            f"<body x-data=\"app()\" x-init=\"init()\" class=\"min-h-screen\"><div class=\"kheder-ers-scope\"><span>Visar förare</span><span>{target_user['display_name']}</span></div>",
        )
        self.serve_text(html, "text/html; charset=utf-8")

    def serve_text(self, content: str, content_type: str) -> None:
        data = content.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8") or "{}")

    def json_response(self, status: int, payload: dict, extra_headers: dict | None = None) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        if extra_headers:
            for key, value in extra_headers.items():
                self.send_header(key, value)
        self.end_headers()
        self.wfile.write(data)

    def get_session_token(self) -> str | None:
        raw_cookie = self.headers.get("Cookie")
        if not raw_cookie:
            return None
        jar = cookies.SimpleCookie()
        jar.load(raw_cookie)
        morsel = jar.get(SESSION_COOKIE)
        return morsel.value if morsel else None

    def get_current_user(self, connection: sqlite3.Connection) -> sqlite3.Row | None:
        token = self.get_session_token()
        if not token:
            return None
        row = connection.execute(
            """
            SELECT u.*
            FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token = ? AND s.expires_at > ? AND u.active = 1
            """,
            (token, now_iso()),
        ).fetchone()
        return row

    def require_auth(self, connection: sqlite3.Connection) -> sqlite3.Row | None:
        user = self.get_current_user(connection)
        if not user:
            self.json_response(401, {"error": "Unauthorized"})
            return None
        return user

    def require_admin(self, connection: sqlite3.Connection) -> sqlite3.Row | None:
        user = self.require_auth(connection)
        if not user:
            return None
        if user["role"] != "admin":
            self.json_response(403, {"error": "Admin only"})
            return None
        return user

    def require_monitor(self, connection: sqlite3.Connection) -> sqlite3.Row | None:
        user = self.require_auth(connection)
        if not user:
            return None
        if not user_can_monitor(user):
            self.json_response(403, {"error": "Monitor access only"})
            return None
        return user

    def handle_session(self) -> None:
        with get_db() as connection:
            user = self.get_current_user(connection)
            if not user:
                return self.json_response(200, {"authenticated": False})
            self.json_response(200, {"authenticated": True, "user": user_to_dict(user)})

    def handle_login(self) -> None:
        payload = self.read_json()
        username = str(payload.get("username", "")).strip()
        password = str(payload.get("password", ""))
        if not username or not password:
            return self.json_response(400, {"error": "Username and password are required"})
        with get_db() as connection:
            user = find_user_by_username(connection, username)
            if not user or not verify_password(password, user["password_hash"]):
                return self.json_response(401, {"error": "Invalid credentials"})
            if not user["active"]:
                return self.json_response(401, {"error": "Invalid credentials"})
            token = secrets.token_urlsafe(32)
            expires_at = (utc_now() + timedelta(days=SESSION_DAYS)).replace(microsecond=0).isoformat()
            connection.execute(
                "INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
                (token, user["id"], expires_at, now_iso()),
            )
            connection.commit()
            jar = cookies.SimpleCookie()
            jar[SESSION_COOKIE] = token
            jar[SESSION_COOKIE]["path"] = "/"
            jar[SESSION_COOKIE]["httponly"] = True
            jar[SESSION_COOKIE]["samesite"] = "Lax"
            jar[SESSION_COOKIE]["max-age"] = str(SESSION_DAYS * 24 * 60 * 60)
            self.json_response(
                200,
                {"authenticated": True, "user": user_to_dict(user)},
                {"Set-Cookie": jar.output(header="").strip()},
            )

    def handle_logout(self) -> None:
        token = self.get_session_token()
        if token:
            with get_db() as connection:
                connection.execute("DELETE FROM sessions WHERE token = ?", (token,))
                connection.commit()
        jar = cookies.SimpleCookie()
        jar[SESSION_COOKIE] = ""
        jar[SESSION_COOKIE]["path"] = "/"
        jar[SESSION_COOKIE]["max-age"] = "0"
        self.json_response(200, {"ok": True}, {"Set-Cookie": jar.output(header="").strip()})

    def handle_users_list(self) -> None:
        with get_db() as connection:
            monitor = self.require_monitor(connection)
            if not monitor:
                return
            users = connection.execute(
                "SELECT * FROM users WHERE active = 1 ORDER BY role DESC, can_monitor DESC, display_name ASC"
            ).fetchall()
            self.json_response(200, {"users": [user_to_dict(row) for row in users]})

    def handle_user_create(self) -> None:
        with get_db() as connection:
            admin = self.require_admin(connection)
            if not admin:
                return
            payload = self.read_json()
            username = str(payload.get("username", "")).strip()
            display_name = str(payload.get("displayName", "")).strip()
            password = str(payload.get("password", ""))
            legitimation_number = str(payload.get("legitimationNumber", "")).strip()
            legitimation_expiry = str(payload.get("legitimationExpiry", "")).strip()
            phone = str(payload.get("phone", "")).strip()
            email = str(payload.get("email", "")).strip()
            license_expiry = str(payload.get("licenseExpiry", "")).strip()
            can_monitor = 1 if payload.get("canMonitor") else 0
            if not username or not display_name or not password:
                return self.json_response(400, {"error": "Display name, username and password are required"})
            if not legitimation_number or not legitimation_expiry or not phone or not email or not license_expiry:
                return self.json_response(400, {"error": "Driver details are required"})
            if username_exists(connection, username):
                return self.json_response(409, {"error": "Username already exists"})
            timestamp = now_iso()
            try:
                cursor = connection.execute(
                    """
                    INSERT INTO users (username, display_name, password_hash, role, can_monitor, active, created_at, updated_at,
                                       legitimation_number, legitimation_expiry, phone, email, license_expiry)
                    VALUES (?, ?, ?, 'driver', ?, 1, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        username,
                        display_name,
                        hash_password(password),
                        can_monitor,
                        timestamp,
                        timestamp,
                        legitimation_number,
                        legitimation_expiry,
                        phone,
                        email,
                        license_expiry,
                    ),
                )
                connection.commit()
            except sqlite3.IntegrityError:
                return self.json_response(409, {"error": "Username already exists"})
            user = connection.execute("SELECT * FROM users WHERE id = ?", (cursor.lastrowid,)).fetchone()
            self.json_response(201, {"user": user_to_dict(user)})

    def handle_user_update(self, path: str) -> None:
        with get_db() as connection:
            admin = self.require_admin(connection)
            if not admin:
                return
            try:
                user_id = int(path.rsplit("/", 1)[-1])
            except ValueError:
                return self.json_response(400, {"error": "Invalid user id"})
            payload = self.read_json()
            user = connection.execute("SELECT * FROM users WHERE id = ? AND active = 1", (user_id,)).fetchone()
            if not user:
                return self.json_response(404, {"error": "User not found"})
            username = str(payload.get("username", user["username"])).strip()
            display_name = str(payload.get("displayName", user["display_name"])).strip()
            password = str(payload.get("password", "")).strip()
            legitimation_number = str(payload.get("legitimationNumber", user["legitimation_number"])).strip()
            legitimation_expiry = str(payload.get("legitimationExpiry", user["legitimation_expiry"])).strip()
            phone = str(payload.get("phone", user["phone"])).strip()
            email = str(payload.get("email", user["email"])).strip()
            license_expiry = str(payload.get("licenseExpiry", user["license_expiry"])).strip()
            can_monitor = 1 if payload.get("canMonitor") else 0
            if not username or not display_name:
                return self.json_response(400, {"error": "Display name and username are required"})
            if not legitimation_number or not legitimation_expiry or not phone or not email or not license_expiry:
                return self.json_response(400, {"error": "Driver details are required"})
            if username_exists(connection, username, exclude_user_id=user_id):
                return self.json_response(409, {"error": "Username already exists"})
            password_hash = user["password_hash"] if not password else hash_password(password)
            try:
                connection.execute(
                    """
                    UPDATE users
                    SET username = ?, display_name = ?, password_hash = ?, can_monitor = ?, updated_at = ?,
                        legitimation_number = ?, legitimation_expiry = ?, phone = ?, email = ?, license_expiry = ?
                    WHERE id = ?
                    """,
                    (
                        username,
                        display_name,
                        password_hash,
                        can_monitor,
                        now_iso(),
                        legitimation_number,
                        legitimation_expiry,
                        phone,
                        email,
                        license_expiry,
                        user_id,
                    ),
                )
                connection.commit()
            except sqlite3.IntegrityError:
                return self.json_response(409, {"error": "Username already exists"})
            updated = connection.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
            self.json_response(200, {"user": user_to_dict(updated)})

    def handle_user_delete(self, path: str) -> None:
        with get_db() as connection:
            admin = self.require_admin(connection)
            if not admin:
                return
            try:
                user_id = int(path.rsplit("/", 1)[-1])
            except ValueError:
                return self.json_response(400, {"error": "Invalid user id"})
            if user_id == admin["id"]:
                return self.json_response(400, {"error": "Admin account cannot be deleted"})
            user = connection.execute("SELECT * FROM users WHERE id = ? AND active = 1", (user_id,)).fetchone()
            if not user:
                return self.json_response(404, {"error": "User not found"})
            connection.execute("UPDATE users SET active = 0, updated_at = ? WHERE id = ?", (now_iso(), user_id))
            connection.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
            connection.commit()
            self.json_response(200, {"ok": True})

    def handle_dashboard(self, parsed) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            params = parse_qs(parsed.query)
            try:
                target_date = parse_iso_date(params.get("date", [None])[0])
            except ValueError:
                return self.json_response(400, {"error": "Invalid date"})
            requested_user_id = None
            requested_raw = params.get("driver_id", [None])[0]
            if requested_raw not in (None, "", "all"):
                try:
                    requested_user_id = int(requested_raw)
                except ValueError:
                    return self.json_response(400, {"error": "Invalid driver id"})
            dashboard = build_dashboard(connection, user, target_date, requested_user_id)
            self.json_response(200, dashboard)

    def handle_arbete_statuses(self) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            payload = build_arbete_status_payload(connection, user)
            self.json_response(200, payload)

    def handle_arbete_control(self) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            payload = build_arbete_control_payload(connection, user)
            self.json_response(200, payload)

    def handle_arbete_segments_get(self, parsed) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            params = parse_qs(parsed.query)
            requested_user_id = None
            try:
                requested_user_id = int(params.get("user_id", [""])[0]) if params.get("user_id") else None
            except ValueError:
                requested_user_id = None
            target_user = resolve_requested_driver(connection, user, requested_user_id)
            if target_user["id"] != user["id"] and not user_can_monitor(user):
                return self.json_response(403, {"error": "Forbidden"})
            payload = build_arbete_segments_payload(connection, target_user)
            self.json_response(200, payload)

    def handle_arbete_status_update(self) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            payload = self.read_json()
            state = "work" if payload.get("state") == "work" else "rest"
            timer_text = str(payload.get("timerText", "00:00:00")).strip() or "00:00:00"
            work_hours_text = str(payload.get("workHoursText", "00:00:00")).strip() or "00:00:00"
            rest_hours_text = str(payload.get("restHoursText", "00:00:00")).strip() or "00:00:00"
            window_mode = 48 if int(payload.get("windowMode", 24)) == 48 else 24
            warning_level = str(payload.get("warningLevel", "normal")).strip()
            if warning_level not in {"normal", "warning", "danger"}:
                warning_level = "normal"
            connection.execute(
                """
                INSERT INTO arbete_status (user_id, state, timer_text, work_hours_text, rest_hours_text, window_mode, warning_level, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    state = excluded.state,
                    timer_text = excluded.timer_text,
                    work_hours_text = excluded.work_hours_text,
                    rest_hours_text = excluded.rest_hours_text,
                    window_mode = excluded.window_mode,
                    warning_level = excluded.warning_level,
                    updated_at = excluded.updated_at
                """,
                (
                    user["id"],
                    state,
                    timer_text,
                    work_hours_text,
                    rest_hours_text,
                    window_mode,
                    warning_level,
                    now_iso(),
                ),
            )
            connection.commit()
            self.json_response(200, {"ok": True})

    def handle_arbete_segments_sync(self) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            payload = self.read_json()
            state = normalize_arbete_segments_state(payload.get("state", {}))
            row = connection.execute(
                "SELECT admin_version FROM arbete_segments_state WHERE user_id = ?",
                (user["id"],),
            ).fetchone()
            admin_version = int(row["admin_version"] or 0) if row else 0
            connection.execute(
                """
                INSERT INTO arbete_segments_state (user_id, state_json, admin_version, updated_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    state_json = excluded.state_json,
                    updated_at = excluded.updated_at
                """,
                (user["id"], json.dumps(state, ensure_ascii=False), admin_version, now_iso()),
            )
            connection.commit()
            self.json_response(200, {"ok": True, "adminVersion": admin_version})

    def handle_arbete_reset(self) -> None:
        with get_db() as connection:
            admin = self.require_admin(connection)
            if not admin:
                return
            payload = self.read_json()
            try:
                user_id = int(payload.get("userId"))
            except (TypeError, ValueError):
                return self.json_response(400, {"error": "Invalid driver id"})
            target_user = connection.execute(
                "SELECT * FROM users WHERE id = ? AND active = 1 AND role = 'driver'",
                (user_id,),
            ).fetchone()
            if not target_user:
                return self.json_response(404, {"error": "Driver not found"})
            timestamp = now_iso()
            connection.execute(
                """
                INSERT INTO arbete_control (user_id, reset_version, updated_at)
                VALUES (?, 1, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    reset_version = arbete_control.reset_version + 1,
                    updated_at = excluded.updated_at
                """,
                (user_id, timestamp),
            )
            connection.execute(
                """
                INSERT INTO arbete_status (user_id, state, timer_text, work_hours_text, rest_hours_text, window_mode, warning_level, updated_at)
                VALUES (?, 'rest', '00:00:00', '00:00:00', '00:00:00', 24, 'normal', ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    state = 'rest',
                    timer_text = '00:00:00',
                    work_hours_text = '00:00:00',
                    rest_hours_text = '00:00:00',
                    window_mode = 24,
                    warning_level = 'normal',
                    updated_at = excluded.updated_at
                """,
                (user_id, timestamp),
            )
            connection.commit()
            self.json_response(200, {"ok": True, "userId": user_id})

    def handle_arbete_segments_delete(self) -> None:
        with get_db() as connection:
            admin = self.require_admin(connection)
            if not admin:
                return
            payload = self.read_json()
            try:
                user_id = int(payload.get("userId"))
            except (TypeError, ValueError):
                return self.json_response(400, {"error": "Invalid driver id"})
            target_user = connection.execute(
                "SELECT * FROM users WHERE id = ? AND active = 1 AND role = 'driver'",
                (user_id,),
            ).fetchone()
            if not target_user:
                return self.json_response(404, {"error": "Driver not found"})
            row = connection.execute(
                "SELECT state_json, admin_version FROM arbete_segments_state WHERE user_id = ?",
                (user_id,),
            ).fetchone()
            state = {"segments": [], "currentSegment": None, "timelineShow48": False}
            admin_version = 0
            if row and row["state_json"]:
                try:
                    state = normalize_arbete_segments_state(json.loads(row["state_json"]))
                except json.JSONDecodeError:
                    state = {"segments": [], "currentSegment": None, "timelineShow48": False}
                admin_version = int(row["admin_version"] or 0)
            segment_type = str(payload.get("segmentType", "")).strip()
            try:
                segment_start = int(payload.get("segmentStart"))
            except (TypeError, ValueError):
                return self.json_response(400, {"error": "Invalid segment start"})
            if segment_type == "current":
                current_segment = state.get("currentSegment")
                if not current_segment or int(current_segment.get("start", 0)) != segment_start:
                    return self.json_response(404, {"error": "Current period not found"})
                state["currentSegment"] = None
            else:
                updated_segments = []
                removed = False
                for segment in state.get("segments", []):
                    if not removed and segment.get("type") == segment_type and int(segment.get("start", 0)) == segment_start:
                        removed = True
                        continue
                    updated_segments.append(segment)
                if not removed:
                    return self.json_response(404, {"error": "Segment not found"})
                state["segments"] = updated_segments
            next_version = admin_version + 1
            connection.execute(
                """
                INSERT INTO arbete_segments_state (user_id, state_json, admin_version, updated_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    state_json = excluded.state_json,
                    admin_version = excluded.admin_version,
                    updated_at = excluded.updated_at
                """,
                (user_id, json.dumps(state, ensure_ascii=False), next_version, now_iso()),
            )
            connection.commit()
            self.json_response(200, {"ok": True, "userId": user_id, "adminVersion": next_version})

    def handle_ersattning_state_get(self, parsed) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            params = parse_qs(parsed.query)
            requested_user_id = None
            try:
                requested_user_id = int(params.get("driver_id", [""])[0]) if params.get("driver_id") else None
            except ValueError:
                requested_user_id = None
            target_user = resolve_requested_driver(connection, user, requested_user_id)
            payload = build_ersattning_state_payload(connection, target_user)
            self.json_response(200, {"user": user_to_dict(target_user), **payload})

    def handle_ersattning_state_update(self) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            payload = self.read_json()
            try:
                requested_user_id = int(payload.get("userId"))
            except (TypeError, ValueError):
                requested_user_id = None
            target_user = resolve_requested_driver(connection, user, requested_user_id)
            state = payload.get("state", {})
            if not isinstance(state, dict):
                return self.json_response(400, {"error": "Invalid state payload"})
            company_info = state.get("companyInfo") if isinstance(state.get("companyInfo"), dict) else {}
            company_info["driverName"] = target_user["display_name"]
            state["companyInfo"] = company_info
            quick_calc_draft = state.get("quickCalcDraft") if isinstance(state.get("quickCalcDraft"), dict) else {}
            quick_calc_draft["driverName"] = target_user["display_name"]
            state["quickCalcDraft"] = quick_calc_draft
            connection.execute(
                """
                INSERT INTO ersattning_state (user_id, state_json, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    state_json = excluded.state_json,
                    updated_at = excluded.updated_at
                """,
                (target_user["id"], json.dumps(state, ensure_ascii=False), now_iso()),
            )
            connection.commit()
            self.json_response(200, {"ok": True, "userId": target_user["id"]})

    def handle_admin_backups(self) -> None:
        with get_db() as connection:
            admin = self.require_admin(connection)
            if not admin:
                return
        self.json_response(200, {"backups": list_backups()})

    def handle_admin_backup_create(self) -> None:
        with get_db() as connection:
            admin = self.require_admin(connection)
            if not admin:
                return
        backup_path = create_backup_file()
        self.json_response(201, {"ok": True, "backup": backup_path.name, "backups": list_backups()})

    def handle_admin_backup_restore(self) -> None:
        with get_db() as connection:
            admin = self.require_admin(connection)
            if not admin:
                return
        payload = self.read_json()
        backup_name = str(payload.get("backupName", "")).strip()
        if not backup_name or "/" in backup_name or ".." in backup_name:
            return self.json_response(400, {"error": "Ogiltig backup"})
        backup_path = BACKUP_DIR / backup_name
        if not backup_path.exists():
            return self.json_response(404, {"error": "Backup hittades inte"})
        create_backup_file()
        shutil.copy2(backup_path, DB_PATH)
        init_db()
        self.json_response(200, {"ok": True, "backup": backup_name, "backups": list_backups()})

    def handle_admin_export(self) -> None:
        with get_db() as connection:
            admin = self.require_admin(connection)
            if not admin:
                return
            payload = export_system_payload(connection)
            self.json_response(200, payload)

    def handle_admin_document_alerts(self) -> None:
        with get_db() as connection:
            monitor = self.require_monitor(connection)
            if not monitor:
                return
            alerts = build_document_alerts(connection)
            self.json_response(200, {"alerts": alerts, "emailConfigured": smtp_is_configured()})

    def handle_admin_document_alerts_send(self) -> None:
        with get_db() as connection:
            admin = self.require_admin(connection)
            if not admin:
                return
            alerts = build_document_alerts(connection)
        try:
            ok, message = send_document_alert_email(alerts)
        except Exception as error:
            return self.json_response(500, {"error": str(error)})
        if not ok:
            return self.json_response(400, {"error": message})
        self.json_response(200, {"ok": True, "message": message})

    def validate_record_payload(self, payload: dict) -> tuple[dict | None, str | None]:
        korning_number = str(payload.get("korningNumber", "")).strip()
        work_date = str(payload.get("date", "")).strip()
        start_time = str(payload.get("startTime", "")).strip()
        end_time = str(payload.get("endTime", "")).strip()
        raw_price = payload.get("price", None)
        if not korning_number or not work_date or not start_time or not end_time:
            return None, "Körning nr, date, start time and end time are required"
        try:
            parse_iso_date(work_date)
            start_value = parse_time(start_time)
            end_value = parse_time(end_time)
        except ValueError:
            return None, "Invalid date or time format"
        if end_value <= start_value:
            return None, "End time must be after start time"
        duration_minutes = int((end_value - start_value).total_seconds() // 60)
        price = None
        if raw_price not in (None, ""):
            try:
                price = round(float(raw_price), 2)
            except (TypeError, ValueError):
                return None, "Invalid price"
            if price < 0:
                return None, "Price cannot be negative"
        return {
            "korningNumber": korning_number,
            "date": work_date,
            "startTime": start_time,
            "endTime": end_time,
            "price": price,
            "durationMinutes": duration_minutes,
        }, None

    def handle_record_create(self) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            payload = self.read_json()
            validated, error = self.validate_record_payload(payload)
            if error:
                return self.json_response(400, {"error": error})
            record_user_id = user["id"]
            if user["role"] == "admin" and payload.get("userId"):
                try:
                    record_user_id = int(payload["userId"])
                except (TypeError, ValueError):
                    return self.json_response(400, {"error": "Invalid driver id"})
            selected_user = connection.execute(
                "SELECT id FROM users WHERE id = ? AND active = 1",
                (record_user_id,),
            ).fetchone()
            if not selected_user:
                return self.json_response(404, {"error": "Driver not found"})
            timestamp = now_iso()
            cursor = connection.execute(
                """
                INSERT INTO driving_records (
                    user_id, korning_number, work_date, start_time, end_time, price, duration_minutes, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    record_user_id,
                    validated["korningNumber"],
                    validated["date"],
                    validated["startTime"],
                    validated["endTime"],
                    validated["price"],
                    validated["durationMinutes"],
                    timestamp,
                    timestamp,
                ),
            )
            connection.commit()
            row = connection.execute(
                """
                SELECT dr.*, u.display_name
                FROM driving_records dr
                JOIN users u ON u.id = dr.user_id
                WHERE dr.id = ?
                """,
                (cursor.lastrowid,),
            ).fetchone()
            self.json_response(201, {"record": record_to_dict(row)})

    def handle_record_update(self, path: str) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            try:
                record_id = int(path.rsplit("/", 1)[-1])
            except ValueError:
                return self.json_response(400, {"error": "Invalid record id"})
            existing = connection.execute(
                """
                SELECT dr.*, u.display_name
                FROM driving_records dr
                JOIN users u ON u.id = dr.user_id
                WHERE dr.id = ? AND u.active = 1
                """,
                (record_id,),
            ).fetchone()
            if not existing:
                return self.json_response(404, {"error": "Record not found"})
            if user["role"] != "admin" and existing["user_id"] != user["id"]:
                return self.json_response(403, {"error": "Forbidden"})
            payload = self.read_json()
            validated, error = self.validate_record_payload(payload)
            if error:
                return self.json_response(400, {"error": error})
            record_user_id = existing["user_id"]
            if user["role"] == "admin" and payload.get("userId"):
                try:
                    record_user_id = int(payload["userId"])
                except (TypeError, ValueError):
                    return self.json_response(400, {"error": "Invalid driver id"})
            selected_user = connection.execute(
                "SELECT id FROM users WHERE id = ? AND active = 1",
                (record_user_id,),
            ).fetchone()
            if not selected_user:
                return self.json_response(404, {"error": "Driver not found"})
            connection.execute(
                """
                UPDATE driving_records
                SET user_id = ?, korning_number = ?, work_date = ?, start_time = ?, end_time = ?, price = ?, duration_minutes = ?, updated_at = ?
                WHERE id = ?
                """,
                (
                    record_user_id,
                    validated["korningNumber"],
                    validated["date"],
                    validated["startTime"],
                    validated["endTime"],
                    validated["price"],
                    validated["durationMinutes"],
                    now_iso(),
                    record_id,
                ),
            )
            connection.commit()
            row = connection.execute(
                """
                SELECT dr.*, u.display_name
                FROM driving_records dr
                JOIN users u ON u.id = dr.user_id
                WHERE dr.id = ?
                """,
                (record_id,),
            ).fetchone()
            self.json_response(200, {"record": record_to_dict(row)})

    def handle_record_delete(self, path: str) -> None:
        with get_db() as connection:
            user = self.require_auth(connection)
            if not user:
                return
            try:
                record_id = int(path.rsplit("/", 1)[-1])
            except ValueError:
                return self.json_response(400, {"error": "Invalid record id"})
            existing = connection.execute(
                "SELECT * FROM driving_records WHERE id = ?",
                (record_id,),
            ).fetchone()
            if not existing:
                return self.json_response(404, {"error": "Record not found"})
            if user["role"] != "admin" and existing["user_id"] != user["id"]:
                return self.json_response(403, {"error": "Forbidden"})
            connection.execute("DELETE FROM driving_records WHERE id = ?", (record_id,))
            connection.commit()
            self.json_response(200, {"ok": True})


def main() -> None:
    init_db()
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("0.0.0.0", port), AppHandler)
    print(f"KhederApp running on http://localhost:{port}")
    print(f"Admin username: {DEFAULT_ADMIN_USERNAME}")
    server.serve_forever()


if __name__ == "__main__":
    main()
