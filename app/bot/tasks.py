from aiogram import Bot
from sqlalchemy import select
import pytz
from datetime import datetime
from app.db.session import async_session
from app.models.user import User
from app.models.medication import Medication
from app.core.logging import logger
from app.core.i18n import i18n

from datetime import timedelta

async def check_and_send_reminders(bot: Bot, interval_minutes: int):
    async with async_session() as session:
        try:
            users_result = await session.execute(select(User))
            users = users_result.scalars().all()
            
            now_utc = datetime.now(pytz.UTC)
            lookback_period = interval_minutes + 1 

            for user in users:
                settings = user.settings or {}
                if not settings.get("notifications"):
                    continue

                tz_name = settings.get("timezone", "UTC")
                user_tz = pytz.timezone(tz_name)
                user_time = now_utc.astimezone(user_tz)
                
                lang = settings.get("language_code", "ru")

                def is_in_window(reminder_time_str):
                    try:
                        rem_h, rem_m = map(int, reminder_time_str.split(':'))
                        rem_dt = user_time.replace(hour=rem_h, minute=rem_m, second=0, microsecond=0)
                        
                        diff = (user_time - rem_dt).total_seconds() / 60
                        return 0 <= diff < lookback_period
                    except:
                        return False

                pressure_times = settings.get("pressure_reminders", [])
                for t in pressure_times:
                    if is_in_window(t):
                        await bot.send_message(
                            chat_id=user.id,
                            text=i18n.t(lang, "bot.pressure_reminders")
                        )

                meds_result = await session.execute(
                    select(Medication).where(Medication.user_id == user.id)
                )
                user_meds = meds_result.scalars().all()

                for med in user_meds:
                    if med.reminders:
                        for t in med.reminders:
                            if is_in_window(t):
                                await bot.send_message(
                                    chat_id=user.id,
                                    text=i18n.t(lang, "bot.medication_reminders", item_name=med.item_name)
                                )
                                
        except Exception as e:
            pass
