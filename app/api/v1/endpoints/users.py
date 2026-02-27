from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import create_access_token, get_current_user
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services import user as user_service

router = APIRouter()

@router.post('/auth/telegram', response_model = dict)
async def login_via_telegram(init_data: str = Body(...), db: AsyncSession = Depends(get_db)):
    user = await user_service.get_or_create_user(db, init_data)
    access_token = create_access_token(data = {"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post('', response_model = UserRead, status_code = status.HTTP_201_CREATED)
async def create_new_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    return await user_service.create_user(db, user_in)

@router.get('', response_model = UserRead)
async def read_user(user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user = await user_service.get_or_create_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch('', response_model = UserRead)
async def update_user_info(user_update: UserUpdate, user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    current_user = await user_service.get_or_create_user(db, user_id)
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return await user_service.update_user(db, current_user, user_update)
