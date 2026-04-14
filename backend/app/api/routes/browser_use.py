from fastapi import APIRouter

from app.schemas.browser_use import BrowserUseRunRequest, BrowserUseRunResponse
from app.services.browser_use import run_browser_task

router = APIRouter(prefix="/browser-use", tags=["browser-use"])


@router.post("/run", response_model=BrowserUseRunResponse)
async def run_browser_use_task(payload: BrowserUseRunRequest) -> BrowserUseRunResponse:
    result = await run_browser_task(payload.task)
    return BrowserUseRunResponse(**result)
