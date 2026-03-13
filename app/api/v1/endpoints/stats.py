from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.measurements import PressureGroup
from app.services import measurements as measurement_service
from app.core.security import get_current_user
from typing import List
router = APIRouter()

@router.get('', response_model = List[PressureGroup])
async def get_stats(
    period: str = 'week',
    user_id: int = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
    ):
    stats = await measurement_service.get_stats(db, user_id, period)
    if not stats:
        raise HTTPException(status_code=404, detail="Stats not found")
    return stats

