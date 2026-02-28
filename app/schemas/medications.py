from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List

class MedicationBase(BaseModel):
    item_name: str = Field(min_length=3, max_length=30)
    reminders: Optional[List[str]] = Field(default_factory=list)

class MedicationRead(MedicationBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MedicationCreate(MedicationBase):
    pass

class MedicationUpdate(BaseModel):
    item_name: Optional[str] = Field(default=None)
    reminders: Optional[List[str]] = Field(default=None)
