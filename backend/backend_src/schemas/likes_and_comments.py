
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..db import User # Import User model

class UserBase(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    parent_id: int
    parent_type: str

class CommentUpdate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    user_id: int
    created_at: datetime
    author: UserBase
    is_accepted: bool
    parent_id: int
    parent_type: str

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
