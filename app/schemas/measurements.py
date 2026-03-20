from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, date
from typing import List, Optional

class PressureBase(BaseModel):
    sys: int
    dia: int
    created_at: datetime
    description: Optional[str] = None

class PressureRead(PressureBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class PressureCreate(PressureBase):
    pass

class PressureUpdate(BaseModel):
    sys: int | None = Field(default=None)
    dia: int | None = Field(default=None)
    description: Optional[str] = None

class PressureGroup(BaseModel):
    date: date
    measurements: list[PressureRead]

class DayStats(BaseModel):
    date: date
    measurements: List[PressureRead]
    average: Optional[dict] = None
    is_current_month: Optional[bool] = True

class PressureGroupMonthly(BaseModel):
    year: int
    month: int
    month_average: Optional[dict] = None
    days: List[DayStats]

class PressureGroupWeekly(BaseModel):
    year: int
    month: int
    week_average: Optional[dict] = None
    days: List[DayStats]