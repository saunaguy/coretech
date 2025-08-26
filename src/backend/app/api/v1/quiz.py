from typing import Dict, List

from fastapi import APIRouter
from pydantic import BaseModel


class QuizQuestion(BaseModel):
    id: str
    prompt: str
    options: List[str]
    answer_index: int


class QuizSubmission(BaseModel):
    answers: Dict[str, int]  # question_id -> selected option index


class QuizResult(BaseModel):
    total: int
    correct: int
    detail: Dict[str, bool]


router = APIRouter()


@router.get("/sample", response_model=List[QuizQuestion])
def get_sample_quiz() -> List[QuizQuestion]:
    return [
        QuizQuestion(id="q1", prompt="리눅스에서 루트 디렉터리는?", options=["/root", "/", "/home"], answer_index=1),
        QuizQuestion(id="q2", prompt="Docker 이미지 빌드 명령은?", options=["docker run", "docker build", "docker ps"], answer_index=1),
    ]


@router.post("/submit", response_model=QuizResult)
def submit_quiz(payload: QuizSubmission) -> QuizResult:
    # 단순 채점 로직(샘플 문제 기준)
    answer_key = {"q1": 1, "q2": 1}
    correct = 0
    detail: Dict[str, bool] = {}
    for qid, selected in payload.answers.items():
        ok = answer_key.get(qid) == selected
        detail[qid] = ok
        if ok:
            correct += 1
    return QuizResult(total=len(answer_key), correct=correct, detail=detail)

