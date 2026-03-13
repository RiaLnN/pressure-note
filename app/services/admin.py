from sqlalchemy import select, func
from app.models.user import User
from app.models.pressure import PressureMeasurement
from app.models.medication import Medication
from sqlalchemy.ext.asyncio import AsyncSession

async def get_platform_stats(session: AsyncSession):
    users_count = await session.scalar(select(func.count(User.id)))
    measurements_count = await session.scalar(select(func.count(PressureMeasurement.id)))
    medications_count = await session.scalar(select(func.count(Medication.id)))
    
    top_users_query = (
        select(User.username, func.count(PressureMeasurement.id).label('m_count'))
        .join(PressureMeasurement)
        .group_by(User.id)
        .order_by(func.count(PressureMeasurement.id).desc())
        .limit(5)
    )
    top_users = await session.execute(top_users_query)
    
    return {
        "users": users_count,
        "measurements": measurements_count,
        "medications": medications_count,
        "top": top_users.all()
    }

async def get_all_users_ids(session: AsyncSession):
    result = await session.execute(
        select(User.id)
    )
    return result.scalars.all()