from aiogram import Router, types
from aiogram.filters import Command
from app.services import user as user_service
from app.db.session import async_session
from app.bot.keyboards.inline import get_main_menu_keyboard
from app.core.i18n import i18n

router = Router()

@router.message(Command('help'))
async def cmd_start(message: types.Message):
    async with async_session() as db:
        user, is_new = await user_service.get_or_create_user(
            db, 
            user_id=message.from_user.id, 
            username=message.from_user.username,
            language_code=message.from_user.language_code
        )
        
        lang = user.settings.get("language_code", "en")
        
        if is_new:
            text = i18n.t(lang, "bot.help")
        else:
            text = i18n.t(lang, "bot.help")

        await message.answer(text, reply_markup=get_main_menu_keyboard(lang))