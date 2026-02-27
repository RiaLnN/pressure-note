import asyncio
import logging
from app.bot.loader import bot, dp
from app.bot.handlers import start
from aiogram.types import MenuButtonWebApp, WebAppInfo
from app.core.config import settings

async def start_bot():
    logging.basicConfig(level=logging.INFO)
    dp.include_router(start.router)

    await bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text="Open App",
            web_app=WebAppInfo(url=settings.WEB_APP_URL)
        )
    )
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(start_bot())