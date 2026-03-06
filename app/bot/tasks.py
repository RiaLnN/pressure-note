from aiogram import Bot
from sqlalchemy import select
from datetime import datetime
from app.db.session import async_session
from app.models.user import User
from app.models.medication import Medication
from app.core.logging import logger
import random

PRESSURE_MESSAGES = [
    "Time for your scheduled blood pressure check. It only takes a minute! ⌚",
    "How's your heart feeling? Let's take a quick measurement. 🩺",
    "Don't forget to log your blood pressure. Consistency is key! 📈",
    "Ready for your daily check-up? Open the app to save your results. ✨",
    "Health Check Time! Please measure your pressure and log it in HealthFlow. 🩸"
]
MEDICATION_MESSAGES = [
    "Time to take your medication: {item_name}. Stay on track! 💊",
    "Don't forget your dose of {item_name}. Your health comes first! ✅",
    "Quick reminder! Please take {item_name} now. 💊",
    "Time for your medicine: {item_name}. Have you taken it yet? 🤔"
]

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
                        await bot.send_message(
                            chat_id=user.id,
                            text=random.choice(PRESSURE_MESSAGES)
                        )
            meds_result = await session.execute(select(Medication))
            meds = meds_result.scalars().all()

            for med in meds:
                if med.reminders and now_str in med.reminders:
                    await bot.send_message(
                        chat_id=med.user_id,
                        text=random.choice(MEDICATION_MESSAGES).format(item_name=med.item_name)
                    )
        except Exception as e:
            logger.error("Error when checking", e)
