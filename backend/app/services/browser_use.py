from fastapi import HTTPException, status

from app.core.config import settings


def _get_async_client():
    if not settings.BROWSER_USE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Browser Use is not configured. Add BROWSER_USE_API_KEY to backend/.env.",
        )

    try:
        from browser_use_sdk import AsyncBrowserUse
    except ImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Browser Use SDK is not installed. Run `pip install -r backend/requirements.txt`.",
        ) from exc

    return AsyncBrowserUse(api_key=settings.BROWSER_USE_API_KEY)


async def run_browser_task(task: str) -> dict:
    client = _get_async_client()

    try:
        result = await client.run(task)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Browser Use request failed: {exc}",
        ) from exc

    task_id = getattr(result, "id", None)
    output = getattr(result, "output", None)
    status_value = getattr(result, "status", "completed")

    return {
        "status": str(status_value),
        "taskId": str(task_id) if task_id is not None else None,
        "output": output,
    }
