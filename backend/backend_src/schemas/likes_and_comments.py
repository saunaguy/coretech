
from pydantic import BaseModel
from typing import List, Optional

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    parent_id: int
    parent_type: str

class Comment(CommentBase):
    id: int
    user_id: int
    created_at: str

    class Config:
        orm_mode = True

class LikeBase(BaseModel):
    parent_id: int
    parent_type: str

class LikeCreate(LikeBase):
    pass

class Like(LikeBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
