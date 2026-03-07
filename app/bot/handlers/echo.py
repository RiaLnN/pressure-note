from aiogram import Router, types
from app.services import user as user_service
from app.db.session import async_session
from app.core.i18n import i18n

router = Router()

@router.message()
async def echo(message: types.Message):
    async with async_session() as db:
        user, is_new = await user_service.get_or_create_user(
            db, 
            user_id=message.from_user.id, 
            username=message.from_user.username,
            language_code=message.from_user.language_code
        )
        
        lang = user.settings.get("language_code", "en")
        text = i18n.t(lang, "bot.commands.unknown")

        await message.answer(text)