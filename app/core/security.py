from __future__ import annotations

import hashlib
import hmac
import json
from typing import Dict, Any

from fastapi import Header, HTTPException

from .config import settings
from .logging import logger
import hmac
import hashlib
import json
import time
from urllib.parse import unquote, parse_qsl
class TelegramInitDataError(Exception):
    """Базовый класс ошибок валидации."""
    pass

class InvalidSignatureError(TelegramInitDataError):
    """Подпись не совпадает — данные подделаны или повреждены."""
    pass

class ExpiredInitDataError(TelegramInitDataError):
    """Данные устарели (auth_date слишком старый)."""
    pass

class MissingFieldError(TelegramInitDataError):
    """Отсутствует обязательное поле."""
    pass

def _validate_telegram_init_data(init_data: str, max_age_seconds: int = 86400) -> Dict[str, Any]:
    params: Dict[str, str] = {
        key: unquote(value)
        for key, value in parse_qsl(init_data, keep_blank_values=True)
    }

    received_hash = params.pop("hash", None)
    if received_hash is None:
        raise MissingFieldError("Поле 'hash' отсутствует в init_data")


    data_check_string = "\n".join(
        f"{key}={value}"
        for key, value in sorted(params.items())
    )


    secret_key = hmac.new(
        key=b"WebAppData",
        msg=settings.BOT_TOKEN.encode("utf-8"),
        digestmod=hashlib.sha256,
    ).digest()


    computed_hash = hmac.new(
        key=secret_key,
        msg=data_check_string.encode("utf-8"),
        digestmod=hashlib.sha256,
    ).hexdigest()


    if not hmac.compare_digest(computed_hash, received_hash):
        raise InvalidSignatureError(
            "Подпись init_data недействительна. Данные могли быть подделаны."
        )

    if max_age_seconds > 0:
        auth_date_raw = params.get("auth_date")
        if auth_date_raw is None:
            raise MissingFieldError("Поле 'auth_date' отсутствует в init_data")

        auth_date = int(auth_date_raw)
        age = int(time.time()) - auth_date

        if age > max_age_seconds:
            raise ExpiredInitDataError(
                f"init_data устарел: возраст {age}s > лимит {max_age_seconds}s"
            )

    result = dict(params)
    for json_field in ("user", "chat", "receiver", "chat_instance"):
        if json_field in result and isinstance(result[json_field], str):
            try:
                result[json_field] = json.loads(result[json_field])
            except json.JSONDecodeError:
                pass

    if "auth_date" in result:
        result["auth_date"] = int(result["auth_date"])

    return result



async def get_current_telegram_user_id(
    x_telegram_init_data: str = Header(..., alias="X-Telegram-Init-Data"),
) -> int:
    data = _validate_telegram_init_data(x_telegram_init_data)

    user = data.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="User not found in Telegram init data")

    user_id = user.get("id")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Missing user id in Telegram init data")

    try:
        return int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid user id in Telegram init data")
