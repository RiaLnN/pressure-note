from sqlalchemy import select, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.user import UserUpdate, UserCreate
from typing import Optional

async def create_user(session: AsyncSession, user_in: UserCreate) -> User:
    user = User(**user_in.model_dump())
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def get_or_create_user(session: AsyncSession, user_id: int, username: Optional[str] = None) -> User | None:
    result = await session.execute(
        select(User)
        .where(User.id == user_id)
    )
    user = result.scalars().first()
    if user:
        return user
    else:
        user_creation = UserCreate(id=user_id, username=username)
        return await create_user(session, user_creation)

async def update_user(
        session: AsyncSession,
        user: User,
        user_update: UserUpdate
) -> User:
    update_data = user_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(user, key, value)
    
    await session.commit()
    await session.refresh(user)
    return user

async def delete_user(session: AsyncSession, user_id: int) -> None:
    query = delete(User).where(User.id == user_id)
    await session.execute(query)
    await session.commit()
