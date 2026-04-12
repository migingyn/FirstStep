from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "FirstStep API"
    VERSION: str = "0.1.0"
    API_PREFIX: str = "/api"

    # CORS — comma-separated in .env, e.g. "http://localhost:5173,https://myapp.com"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173"]

    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()  # type: ignore[call-arg]
