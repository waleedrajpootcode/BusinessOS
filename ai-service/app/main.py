from fastapi import FastAPI
from pydantic import BaseModel, Field
from app.tools import execute_tool_request


app = FastAPI(
    title="BusinessOS AI Service",
    version="1.0.0",
    description="BusinessOS AI intelligence service",
)


class AIQueryRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=500,
    )

    tool: str | None = Field(
        default=None,
        max_length=100,
    )


@app.get("/health")
async def health():
    return {
        "success": True,
        "service": "BusinessOS AI Service",
        "status": "healthy",
    }


@app.post("/ai/query")
async def ai_query(request: AIQueryRequest):
    question = request.question.strip()

    if not question:
        return {
            "success": False,
            "type": "empty_query",
            "message": "Please enter a business question.",
        }

    if request.tool is None:
        return {
            "success": True,
            "type": "query_received",
            "message": "AI query received successfully.",
            "question": question,
        }

    tool_result = execute_tool_request(
        request.tool,
        {
            "user_id": "test-user",
            "business_id": "test-business",
        },
    )

    return {
        "success": tool_result.get("allowed", False),
        "type": tool_result.get("type"),
        "question": question,
        "tool": tool_result,
    }