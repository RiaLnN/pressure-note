from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_telegram_user_id
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services import user as user_service

router = APIRouter()


@router.post('', response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_new_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):

    return await user_service.create_user(db, user_in)


@router.get('', response_model=UserRead)
async def read_user(
    user_id: int = Depends(get_current_telegram_user_id),
    db: AsyncSession = Depends(get_db),
):

    user, _ = await user_service.get_or_create_user(db, user_id)
    return user


@router.patch('', response_model=UserRead)
async def update_user_info(
    user_update: UserUpdate,
    user_id: int = Depends(get_current_telegram_user_id),
    db: AsyncSession = Depends(get_db),
):

    current_user, _ = await user_service.get_or_create_user(db, user_id)
    return await user_service.update_user(db, current_user, user_update)
