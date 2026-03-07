from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from app.core.config import settings
from app.core.i18n import i18n

def get_main_menu_keyboard(lang):
    text = i18n.t(lang, "bot.open_app")
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=text,
                    web_app=WebAppInfo(url=settings.WEB_APP_URL)
                )
            ]
        ]
    )
    return keyboard