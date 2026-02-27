from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, date

class PressureBase(BaseModel):
    sys: int
    dia: int

class PressureRead(PressureBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PressureCreate(PressureBase):
    pass

class PressureUpdate(BaseModel):
    sys: int | None = Field(default=None)
    dia: int | None = Field(default=None)

class PressureGroup(BaseModel):
    date: date
    measurements: list[PressureRead]