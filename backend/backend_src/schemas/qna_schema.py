from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, field_validator

from backend_src.db import UserSummary
from backend_src.schemas.comment_schema import CommentResponse # Uncommented for comments field

class QuestionResponse(BaseModel):
    id: int
    title: str
    body: str
    views: int
    answered: bool
    created_at: datetime
    category: Optional[str]
    tags: Optional[List[str]] = None # Explicitly Optional with None default
    author: UserSummary
    comments: Optional[List[CommentResponse]] = None # Made explicitly optional

    model_config = ConfigDict(from_attributes=True)

    @field_validator('comments', mode='before')
    @classmethod
    def validate_comments_list(cls, v):
        if v is None:
            return []
        if not isinstance(v, list):
            return [v] # Wrap single object in a list
        return v

class QuestionListResponse(BaseModel):
    id: int
    title: str
    body: str
    views: int
    answered: bool
    created_at: datetime
    category: Optional[str]
    tags: Optional[List[str]] = None # Re-added tags field

    model_config = ConfigDict(from_attributes=True)
