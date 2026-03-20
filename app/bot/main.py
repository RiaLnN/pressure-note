import asyncio
import logging
from app.bot.loader import bot, dp
from app.bot.handlers import start, help, echo, admin
from aiogram.types import MenuButtonWebApp, WebAppInfo
from app.core.config import settings
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.bot.tasks import check_and_send_reminders


async def start_bot():
    logging.basicConfig(level=logging.INFO)
    dp.include_router(start.router)
    dp.include_router(help.router)
    dp.include_router(admin.router)


    # Always last
    dp.include_router(echo.router)

    await bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text="Open App",
            web_app=WebAppInfo(url=settings.WEB_APP_URL)
        )
    )
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        check_and_send_reminders, 
        trigger='cron', 
        minute='*', 
        kwargs={'bot': bot}
    )
    scheduler.start()
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(start_bot())