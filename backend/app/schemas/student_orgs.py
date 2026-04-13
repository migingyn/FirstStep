from pydantic import BaseModel


class StudentOrgOut(BaseModel):
    id: str
    name: str
    abbreviation: str
    description: str
    website: str | None = None
    instagram: str | None = None
