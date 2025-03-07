from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ScanCreate(BaseModel):
    url: HttpUrl
    scan_type: str = "full"

class ScanResponse(BaseModel):
    id: int
    target_url: str
    scan_type: str
    status: str
    start_time: datetime
    end_time: Optional[datetime]
    results: Optional[Dict[str, Any]]
