from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.medication import Medication
from app.schemas.medications import MedicationUpdate, MedicationCreate
from typing import List


async def create_medication(session: AsyncSession, medication_in: MedicationCreate, user_id: int) -> Medication:
    medication = Medication(**medication_in.model_dump(), user_id=user_id)
    session.add(medication)
    await session.commit()
    await session.refresh(medication)
    return medication

async def get_medication(session: AsyncSession, user_id: int) -> List[Medication]:
    medicatons = await session.execute(
        select(Medication)
        .where(Medication.user_id == user_id)
        .order_by(Medication.created_at.desc())
    )
    return medicatons.scalars().all()

async def get_medication_by_id(session: AsyncSession, medication_id: int, user_id: int) -> Medication:
    medication = await session.execute(
        select(Medication)
        .where(Medication.user_id == user_id)
        .where(Medication.id == medication_id)
    )
    return medication.scalar_one_or_none()

async def update_medication(session: AsyncSession, medication: Medication, medication_update: MedicationUpdate, user_id: int) -> Medication:
    medication_data = medication_update.model_dump(exclude_unset=True)
    
    for key, value in medication_data.items():
        setattr(medication, key, value)

    await session.commit()
    await session.refresh(medication)
    return medication

async def delete_medication(session: AsyncSession, medication_id: int, user_id: int) -> bool:
    result = await session.execute(
        delete(Medication)
        .where(Medication.user_id == user_id)
        .where(Medication.id == medication_id)
    )
    await session.commit()
    return result.rowcount > 0