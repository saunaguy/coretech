from datetime import datetime
from pydantic import BaseModel

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    parent_id: int
    parent_type: str # "post" or "question"
    user_id: int # 실제로는 인증된 사용자로부터 가져옴

class CommentResponse(CommentBase):
    id: int
    parent_id: int
    parent_type: str
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True # Pydantic v2
