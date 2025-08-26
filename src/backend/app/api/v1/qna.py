from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


class QuestionCreate(BaseModel):
    title: str
    body: str
    tags: Optional[List[str]] = None


class Question(QuestionCreate):
    id: int


_STORE: Dict[int, Question] = {}
_SEQ = 1

router = APIRouter()


@router.get("/questions", response_model=List[Question])
def list_questions() -> List[Question]:
    return list(_STORE.values())


@router.post("/questions", response_model=Question, status_code=201)
def create_question(payload: QuestionCreate) -> Question:
    global _SEQ
    q = Question(id=_SEQ, **payload.dict())
    _STORE[_SEQ] = q
    _SEQ += 1
    return q


@router.get("/questions/{qid}", response_model=Question)
def get_question(qid: int) -> Question:
    q = _STORE.get(qid)
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    return q

