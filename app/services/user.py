from sqlalchemy import select, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.user import UserUpdate, UserCreate, UserSettings
from typing import Optional, List

async def create_user(session: AsyncSession, user_in: UserCreate) -> User:
    user = User(**user_in.model_dump())
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def get_or_create_user(session: AsyncSession, user_id: int, username: Optional[str] = None, language_code: Optional[str] = "en") -> tuple[User, bool]:
    if isinstance(user_id, str):
        user_id = int(user_id)
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    
    if user:
        return user, False
    
    supported_langs = ["en", "ru", "ua"]
    lang = language_code if language_code in supported_langs else "en"
    
    user_settings = UserSettings(language_code=lang)
    user_creation = UserCreate(id=user_id, username=username, settings=user_settings)
    
    new_user = await create_user(session, user_creation)
    return new_user, True

async def update_user(
        session: AsyncSession,
        user: User,
        user_update: UserUpdate
) -> User:
    update_data = user_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if key == "settings" and isinstance(value, dict):
            current_settings = user.settings or {}
            current_settings.update(value)
            user.settings = current_settings
        else:
            setattr(user, key, value)
    
    await session.commit()
    await session.refresh(user)
    return user

async def delete_user(session: AsyncSession, user_id: int) -> None:
    query = delete(User).where(User.id == user_id)
    await session.execute(query)
    await session.commit()
