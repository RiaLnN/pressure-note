from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.medications import MedicationRead, MedicationCreate, MedicationUpdate
from app.services import medications as medication_service
from app.core.security import get_current_user
from typing import List

router = APIRouter()

@router.post('', response_model = MedicationRead)
async def save_medication(medication_in: MedicationCreate, user_id: int = Depends(get_current_user), db: AsyncSession= Depends(get_db)):
    return await medication_service.create_medication(db, medication_in, user_id)

@router.get('', response_model = List[MedicationRead])
async def read_medication(user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    medications = await medication_service.get_medication(db, user_id)
    return medications

@router.get('/{medication_id}', response_model = MedicationRead)
async def read_medication_by_id(medication_id: int, user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await medication_service.get_medication_by_id(db, medication_id, user_id)

@router.patch('/{medication_id}', response_model = MedicationRead)
async def update_medication(medication_id: int, medication_update: MedicationUpdate, user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    medication = await medication_service.get_medication_by_id(db, medication_id, user_id)
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")
    return await medication_service.update_medication(db, medication, medication_update, user_id)

@router.delete('/{medication_id}', status_code=204)
async def delete_medication(medication_id: int, user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    success = await medication_service.delete_medication(db, medication_id, user_id)
    if not success:
        return HTTPException(status_code=404, detail="Medication not found")
    return Response(status_code=204)