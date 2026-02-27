from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from app.core.config import settings

def get_main_menu_keyboard():
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Відкрити Pressure Tracker",
                    web_app=WebAppInfo(url=settings.WEB_APP_URL)
                )
            ]
        ]
    )
    return keyboard