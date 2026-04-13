import argparse
import csv
import json
from pathlib import Path
from typing import Any

from app.db.supabase import get_supabase
from app.models.student_orgs import STUDENT_ORGS


def slugify(value: str) -> str:
    return (
        value.lower()
        .replace("&", "and")
        .replace("/", "-")
        .replace("'", "")
        .replace(".", "")
        .replace(" ", "-")
    )


def normalize_instagram(value: str | None) -> str | None:
    if not value:
        return None

    handle = value.strip()
    if not handle:
        return None

    if "instagram.com/" in handle:
        handle = handle.rstrip("/").split("instagram.com/")[-1]

    return handle if handle.startswith("@") else f"@{handle}"


def normalize_club(record: dict[str, Any]) -> dict[str, Any]:
    name = str(record.get("name") or "").strip()
    if not name:
        raise ValueError("Club record is missing a name")

    abbreviation = str(record.get("abbreviation") or name[:4]).strip()

    return {
        "slug": str(record.get("slug") or slugify(name)),
        "name": name,
        "abbreviation": abbreviation,
        "description": str(record.get("description") or "").strip(),
        "website": str(record.get("website")).strip() if record.get("website") else None,
        "instagram": normalize_instagram(record.get("instagram")),
        "category": str(record.get("category") or "General").strip(),
    }


def load_records(source: Path | None) -> list[dict[str, Any]]:
    if source is None:
        return [normalize_club(record) for record in STUDENT_ORGS]

    if source.suffix.lower() == ".json":
        raw = json.loads(source.read_text(encoding="utf-8"))
        if not isinstance(raw, list):
            raise ValueError("JSON source must be a list of club records")
        return [normalize_club(record) for record in raw]

    if source.suffix.lower() == ".csv":
        with source.open("r", encoding="utf-8-sig", newline="") as file:
            reader = csv.DictReader(file)
            return [normalize_club(record) for record in reader]

    raise ValueError("Unsupported source type. Use .json or .csv")


def main() -> None:
    parser = argparse.ArgumentParser(description="Import clubs into Supabase.")
    parser.add_argument("--source", type=Path, help="Path to a JSON or CSV file of clubs.")
    args = parser.parse_args()

    records = load_records(args.source)

    response = get_supabase().table("clubs").upsert(records, on_conflict="slug").execute()
    print(f"Imported {len(response.data or records)} clubs.")


if __name__ == "__main__":
    main()
