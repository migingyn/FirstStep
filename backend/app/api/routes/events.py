from fastapi import APIRouter

from app.schemas.events import EventOut
from app.services.events import get_event, list_events

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[EventOut])
async def read_events() -> list[EventOut]:
    return list_events()


@router.get("/{event_id}", response_model=EventOut)
async def read_event(event_id: str) -> EventOut:
    return get_event(event_id)
