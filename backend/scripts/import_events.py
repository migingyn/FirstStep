import argparse
import csv
import json
from pathlib import Path
from typing import Any

from app.db.supabase import get_supabase
from app.models.events import EVENTS


def split_time_range(time_value: str) -> tuple[str, str | None]:
    normalized = time_value.replace("–", "-")
    parts = [part.strip() for part in normalized.split("-", maxsplit=1)]
    if len(parts) == 2:
        return parts[0], parts[1]
    return normalized.strip(), None


def normalize_event(record: dict[str, Any]) -> dict[str, Any]:
    date = str(record.get("date") or record.get("event_date") or "").strip()
    title = str(record.get("title") or "").strip()
    if not date or not title:
        raise ValueError("Event record must include title and date")

    start_time, end_time = split_time_range(str(record.get("time") or ""))

    return {
        "id": record.get("id"),
        "title": title,
        "summary": str(record.get("summary") or "").strip(),
        "description": str(record.get("description") or "").strip(),
        "event_date": date,
        "start_time": start_time,
        "end_time": end_time,
        "location": str(record.get("location") or "").strip(),
        "category": str(record.get("category") or "General").strip(),
        "tags": list(record.get("tags") or []),
        "confidence_tags": list(record.get("confidenceTags") or record.get("confidence_tags") or []),
        "organizer": str(record.get("organizer") or "").strip(),
        "image_url": record.get("imageUrl") or record.get("image_url"),
        "why_recommended": record.get("whyRecommended") or record.get("why_recommended"),
        "external_rsvp_url": record.get("externalRsvpUrl") or record.get("external_rsvp_url"),
        "rsvp_count": int(record.get("rsvpCount") or record.get("rsvp_count") or 0),
    }


def load_records(source: Path | None) -> list[dict[str, Any]]:
    if source is None:
        return [normalize_event(record) for record in EVENTS]

    if source.suffix.lower() == ".json":
        raw = json.loads(source.read_text(encoding="utf-8"))
        if not isinstance(raw, list):
            raise ValueError("JSON source must be a list of event records")
        return [normalize_event(record) for record in raw]

    if source.suffix.lower() == ".csv":
        with source.open("r", encoding="utf-8-sig", newline="") as file:
            reader = csv.DictReader(file)
            return [normalize_event(record) for record in reader]

    raise ValueError("Unsupported source type. Use .json or .csv")


def main() -> None:
    parser = argparse.ArgumentParser(description="Import events into Supabase.")
    parser.add_argument("--source", type=Path, help="Path to a JSON or CSV file of events.")
    args = parser.parse_args()

    records = load_records(args.source)
    response = get_supabase().table("events").upsert(records, on_conflict="id").execute()
    print(f"Imported {len(response.data or records)} events.")


if __name__ == "__main__":
    main()
