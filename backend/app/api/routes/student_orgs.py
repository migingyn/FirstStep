from fastapi import APIRouter

from app.schemas.student_orgs import StudentOrgOut
from app.services.student_orgs import list_student_orgs

router = APIRouter(prefix="/student-orgs", tags=["student-orgs"])


@router.get("", response_model=list[StudentOrgOut])
async def read_student_orgs() -> list[StudentOrgOut]:
    return list_student_orgs()
