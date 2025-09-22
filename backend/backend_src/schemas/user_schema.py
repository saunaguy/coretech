from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    is_admin: bool
    role: str
    created_at: datetime

    class Config:
        from_attributes = True
