from pydantic import BaseModel


class EventOut(BaseModel):
    id: str
    title: str
    summary: str
    description: str
    date: str
    time: str
    location: str
    category: str
    tags: list[str]
    confidenceTags: list[str]
    imageUrl: str
    rsvpCount: int
    organizer: str
    whyRecommended: str | None = None
    externalRsvpUrl: str | None = None
