from fastapi import APIRouter

from .qna import router as qna_router
from .quiz import router as quiz_router
from .content import router as content_router

api_v1 = APIRouter()
api_v1.include_router(quiz_router, prefix="/quiz", tags=["quiz"])
api_v1.include_router(qna_router, prefix="/qna", tags=["qna"])
api_v1.include_router(content_router, prefix="/content", tags=["content"])
