from pydantic import BaseModel, Field


class BrowserUseRunRequest(BaseModel):
    task: str = Field(..., min_length=1, description="Natural-language browser task to run")


class BrowserUseRunResponse(BaseModel):
    status: str
    taskId: str | None = None
    output: str | dict | list | None = None
