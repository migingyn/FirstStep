from app.models.student_orgs import STUDENT_ORGS
from app.schemas.student_orgs import StudentOrgOut


def list_student_orgs() -> list[StudentOrgOut]:
    return [StudentOrgOut(**org) for org in STUDENT_ORGS]
