from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserRoleUpdate(BaseModel):
    role: str

class UserApproval(BaseModel):
    user_id: int
    approve: bool
