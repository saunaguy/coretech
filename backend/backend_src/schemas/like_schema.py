from datetime import datetime
from pydantic import BaseModel

class LikeBase(BaseModel):
    parent_id: int
    parent_type: str # "post" or "question"

class LikeCreate(LikeBase):
    user_id: int # 실제로는 인증된 사용자로부터 가져옴

class LikeResponse(LikeBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True # Pydantic v2
