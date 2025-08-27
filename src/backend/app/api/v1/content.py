from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ...services import content as svc


class LessonCreate(BaseModel):
    track: str
    module: str
    slug: str
    title: str
    markdown: str


class LessonOut(BaseModel):
    track: str
    module: str
    slug: str
    title: Optional[str]
    markdown: str


router = APIRouter()


@router.get("/tracks", response_model=List[str])
def get_tracks():
    return svc.list_tracks()


@router.get("/modules", response_model=List[str])
def get_modules(track: str):
    return svc.list_modules(track)


@router.get("/lessons", response_model=List[str])
def get_lessons(track: str, module: str):
    return svc.list_lessons(track, module)


@router.get("/lesson", response_model=LessonOut)
def get_lesson(track: str, module: str, slug: str):
    lesson = svc.read_lesson(track, module, slug)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return LessonOut(**lesson.__dict__)


@router.post("/lesson", response_model=LessonOut, status_code=201)
def create_lesson(payload: LessonCreate):
    try:
        lesson = svc.save_lesson(
            payload.track, payload.module, payload.slug, payload.title, payload.markdown
        )
        return LessonOut(**lesson.__dict__)  # type: ignore
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

