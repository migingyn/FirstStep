from fastapi import APIRouter

# Import and register sub-routers here as the project grows, e.g.:
# from app.api.routes import users
# router.include_router(users.router, prefix="/users", tags=["users"])

router = APIRouter()


@router.get("/ping")
async def ping():
    return {"message": "pong"}
