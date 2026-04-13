from app.db.supabase import get_supabase
from app.models.student_orgs import STUDENT_ORGS
from app.schemas.student_orgs import StudentOrgOut


def _map_club_record(record: dict) -> StudentOrgOut:
    return StudentOrgOut(
        id=record["id"],
        name=record["name"],
        abbreviation=record["abbreviation"],
        description=record["description"],
        website=record.get("website"),
        instagram=record.get("instagram"),
        category=record.get("category"),
    )


def _list_student_orgs_from_supabase() -> list[StudentOrgOut]:
    response = (
        get_supabase()
        .table("clubs")
        .select("id, name, abbreviation, description, website, instagram, category")
        .order("name")
        .execute()
    )

    return [_map_club_record(record) for record in (response.data or [])]


def list_student_orgs() -> list[StudentOrgOut]:
    try:
        clubs = _list_student_orgs_from_supabase()
        if clubs:
            return clubs
    except Exception:
        pass

    return [StudentOrgOut(**org) for org in STUDENT_ORGS]
