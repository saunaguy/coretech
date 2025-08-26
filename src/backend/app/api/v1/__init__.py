from fastapi import APIRouter

from .quiz import router as quiz_router
from .qna import router as qna_router

api_v1 = APIRouter()
api_v1.include_router(quiz_router, prefix="/quiz", tags=["quiz"])
api_v1.include_router(qna_router, prefix="/qna", tags=["qna"])

