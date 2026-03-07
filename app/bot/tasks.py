from aiogram import Bot
from sqlalchemy import select
import pytz
from datetime import datetime
from app.db.session import async_session
from app.models.user import User
from app.models.medication import Medication
from app.core.logging import logger
from app.core.i18n import i18n

async def check_and_send_reminders(bot: Bot):
    user_now = datetime.now().strftime("%H:%M")
    
    async with async_session() as session:
        try:
            users_result = await session.execute(select(User))
            users = users_result.scalars().all()
            for user in users:
                tz_name = user.settings.get("timezone", "UTC")
                user_tz = pytz.timezone(tz_name)
                user_now = datetime.now(user_tz).strftime("%H:%M")
                settings = user.settings or {}
                if settings.get("notifications"):
                    times = settings.get("pressure_reminders", [])
                    text = i18n.t(settings.get("language_code", "en"), "bot.pressure_reminders")
                    if user_now in times:
                        await bot.send_message(
                            chat_id=user.id,
                            text=text
                        )
            meds_result = await session.execute(select(Medication))
            meds = meds_result.scalars().all()

            for med in meds:
                if med.reminders and user_now in med.reminders:
                    text = i18n.t(settings.get("language_code", "en"), "bot.medication_reminders", item_name=med.item_name)
                    await bot.send_message(
                        chat_id=med.user_id,
                        text=text
                    )
        except Exception as e:
            logger.error("Error when checking", e)
