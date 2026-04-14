from fastapi import APIRouter
from app.api.routes.browser_use import router as browser_use_router
from app.api.routes.events import router as events_router
from app.api.routes.student_orgs import router as student_orgs_router

router = APIRouter()
router.include_router(browser_use_router)
router.include_router(events_router)
router.include_router(student_orgs_router)


@router.get("/ping", tags=["health"])
async def ping():
    return {"message": "pong"}
