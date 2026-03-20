from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Dict, List

class UserBase(BaseModel):
    username: Optional[str] = None

class UserSettings(BaseModel):
    theme: str = "light"
    target_pressure: Dict[str, int] = {"sys": 120, "dia": 80}
    notifications: bool = True
    pressure_reminders: List[str] = ['09:00', '21:00']
    language_code: str = "en"
    timezone: str = "Europe/Kyiv"

class UserRead(UserBase):
    id: int
    username: str | None
    settings: UserSettings

    model_config = ConfigDict(from_attributes=True)

class UserCreate(UserBase):
    id: int
    settings: Optional[UserSettings] = None

class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=32)
    settings: Optional[UserSettings] = None

    model_config = ConfigDict(from_attributes=True)