from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, date
from typing import List, Optional

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

class DayStats(BaseModel):
    date: date
    measurements: List[PressureRead]
    average: Optional[dict] = None

class PressureGroupMonthly(BaseModel):
    year: int
    month: int
    month_average: Optional[dict] = None
    days: List[DayStats]
