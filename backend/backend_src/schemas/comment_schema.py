from datetime import datetime
from pydantic import BaseModel, ConfigDict
from backend_src.db import UserSummary # Import UserSummary

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
    is_accepted: bool
    author: UserSummary # Add user object

    model_config = ConfigDict(from_attributes=True)
