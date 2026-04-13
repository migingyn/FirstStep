from fastapi import HTTPException, status

from app.db.supabase import get_supabase
from app.models.events import EVENTS
from app.schemas.events import EventOut


def _format_time(start_time: str, end_time: str | None) -> str:
    return f"{start_time} - {end_time}" if end_time else start_time


def _map_event(record: dict) -> EventOut:
    return EventOut(
        id=record["id"],
        title=record["title"],
        summary=record["summary"],
        description=record["description"],
        date=str(record["event_date"]),
        time=_format_time(record["start_time"], record.get("end_time")),
        location=record["location"],
        category=record["category"],
        tags=record.get("tags", []),
        confidenceTags=record.get("confidence_tags", []),
        imageUrl=record.get("image_url") or "",
        rsvpCount=record.get("rsvp_count", 0),
        organizer=record["organizer"],
        whyRecommended=record.get("why_recommended"),
        externalRsvpUrl=record.get("external_rsvp_url"),
    )


def _map_seed_event(record: dict) -> EventOut:
    return EventOut(**record)


def _list_events_from_supabase(client) -> list[EventOut]:
    response = client.table("events").select("*").order("event_date").order("start_time").execute()
    return [_map_event(record) for record in (response.data or [])]


def list_events() -> list[EventOut]:
    try:
        return _list_events_from_supabase(get_supabase())
    except Exception:
        return [_map_seed_event(record) for record in EVENTS]


def get_event(event_id: str) -> EventOut:
    try:
        response = get_supabase().table("events").select("*").eq("id", event_id).limit(1).execute()

        if response.data:
            return _map_event(response.data[0])
    except Exception:
        pass

    for record in EVENTS:
        if record["id"] == event_id:
            return _map_seed_event(record)

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
