from aiogram import Bot
from sqlalchemy import select
from datetime import datetime
from app.db.session import async_session
from app.models.user import User
from app.models.medication import Medication
from app.core.logging import logger

async def check_and_send_reminders(bot: Bot):
    now_str = datetime.now().strftime("%H:%M")
    
    async with async_session() as session:
        try:
            users_result = await session.execute(select(User))
            users = users_result.scalars().all()

            for user in users:
                settings = user.settings or {}
                if settings.get("notifications"):
                    times = settings.get("pressure_reminders", [])
                    if now_str in times:
                        logger.info("Send reminder to %s", user.username)
                        await bot.send_message(
                            chat_id=user.id,
                            text="Time to measure your blood pressure!"
                        )
            meds_result = await session.execute(select(Medication))
            meds = meds_result.scalars().all()

            for med in meds:
                if med.reminders and now_str in med.reminders:
                    await bot.send_message(
                        chat_id=med.user_id,
                        text=f"Reminder: Take {med.item_name}"
                    )
        except Exception as e:
            logger.error("Error when checking", e)
