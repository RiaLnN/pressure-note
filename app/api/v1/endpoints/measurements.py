from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.measurements import PressureRead, PressureCreate, PressureUpdate, PressureGroup
from app.services import measurements as measurement_service
from typing import List
from app.core.security import get_current_user

router = APIRouter()

@router.post('', response_model = PressureRead)
async def save_pressure(
    pressure_in: PressureCreate = Body(...), 
    user_id: int = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
    ):
    return await measurement_service.create_measurement(db, pressure_in, user_id)

@router.get('', response_model = List[PressureRead])
async def read_pressure(
    user_id: int = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
    ):
    measurements = await measurement_service.get_measurements(db, user_id)
    return measurements

@router.get('/history', response_model = List[PressureGroup])
async def read_history(
    user_id: int = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
    ):
    measurements = await measurement_service.get_history(db, user_id)
    return measurements

@router.patch('/{pressure_id}', response_model = PressureRead)
async def update_pressure_info(
    pressure_id: int, 
    pressure_update: PressureUpdate, 
    user_id: int = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
    ):
    current_pressure = await measurement_service.get_measurements_by_id(db, user_id, pressure_id)
    if not current_pressure:
        raise HTTPException(status_code=404, detail="Measurement not found")
    
    return await measurement_service.update_measurement(db, current_pressure, pressure_update)

@router.delete('/{pressure_id}', response_model = PressureRead)
async def delete_pressure(
    pressure_id: int,
    user_id: int = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
    ):
    current_pressure = await measurement_service.get_measurements_by_id(db, user_id, pressure_id)
    if not current_pressure:
        raise HTTPException(status_code=404, detail="Measurement not found")
    
    return await measurement_service.delete_measurement(db, user_id, pressure_id)
    
