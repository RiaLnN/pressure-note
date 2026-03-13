from aiogram import Router, types, F
from aiogram.filters import Command
from app.services import admin as admin_service
from app.db.session import async_session
from app.core.config import settings
from app.bot.filters.admin import IsAdmin
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.exceptions import TelegramForbiddenError, TelegramRetryAfter
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
import asyncio

router = Router()

class Form(StatesGroup):
    broadcast = State()

@router.message(IsAdmin(settings.ADMIN_ID), Command('admin_stats'))
async def cmd_stats(message: types.Message):
    async with async_session() as db:
        stats = await admin_service.get_platform_stats(db)
        
        text = [
            "<b>📊 СТАТИСТИКА ПЛАТФОРМЫ</b>\n",
            f"👥 Всего пользователей: <code>{stats['users']}</code>",
            f"🩸 Всего замеров давления: <code>{stats['measurements']}</code>",
            f"💊 Добавлено лекарств: <code>{stats['medications']}</code>",
            "\n<b>🏆 ТОП активных пользователей:</b>"
        ]
        
        if stats['top']:
            for i, (username, count) in enumerate(stats['top'], 1):
                name = f"@{username}" if username else "Аноним"
                text.append(f"{i}. {name} — {count} замеров")
        else:
            text.append("<i>Пока нет данных для топа</i>")

        await message.answer("\n".join(text), parse_mode="HTML")


@router.message(IsAdmin(settings.ADMIN_ID), Command('admin_broadcast'))
async def cmd_broadcast(message: types.Message, state: FSMContext):
    await state.set_state(Form.broadcast)
    kb = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="❌ Отмена")]],
        resize_keyboard=True,
        one_time_keyboard=True
    )
    
    await message.answer(
        "Введите текст рассылки. Все, что вы пришлете следующим сообщением "
        "(текст, фото, пост), будет разослано всем пользователям.",
        reply_markup=kb
    )

@router.message(IsAdmin(settings.ADMIN_ID), Form.broadcast)
async def process_broadcast(message: types.Message, state: FSMContext):
    await state.clear()
    
    async with async_session() as db:
        uids = await admin_service.get_all_users_ids(db)
    
    count = 0
    blocked = 0
    
    await message.answer(f"🚀 Рассылка запущена на {len(uids)} пользователей...")

    for uid in uids:
        try:
            await message.copy_to(chat_id=uid)
            count += 1
            
            await asyncio.sleep(0.05) 
            
        except TelegramForbiddenError:
            blocked += 1
        except TelegramRetryAfter as e:
            await asyncio.sleep(e.retry_after)
            await message.copy_to(chat_id=uid)
            count += 1
        except Exception as e:
            print(f"Ошибка при отправке {uid}: {e}")

    await message.answer(
        f"✅ Рассылка завершена!\n\n"
        f"👤 Получили: {count}\n"
        f"🚫 Заблокировали бота: {blocked}"
    )

@router.message(IsAdmin(settings.ADMIN_ID), Form.broadcast, F.text == "❌ Отмена")
async def cancel_broadcast(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(
        "Рассылка отменена.", 
        reply_markup=ReplyKeyboardRemove()
    )