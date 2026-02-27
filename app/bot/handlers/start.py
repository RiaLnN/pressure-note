from aiogram import Router, types
from aiogram.filters import CommandStart
from app.services import user as user_service
from app.db.session import async_session
from app.core.config import settings
from app.bot.keyboards.inline import get_main_menu_keyboard

router = Router()

@router.message(CommandStart())
async def cmd_start(message: types.Message):
    async with async_session() as db:
        user = await user_service.get_or_create_user(
            db, 
            user_id=message.from_user.id, 
            username=message.from_user.username
        )
        if not user:
            await message.answer(
                f"Ласкаво просимо в {settings.PROJECT_NAME}!",
                reply_markup=get_main_menu_keyboard()
            )
        else:
            await message.answer(
                f"З поверненням, {user.username}!",
                reply_markup=get_main_menu_keyboard()
            )