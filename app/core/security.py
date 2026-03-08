from datetime import datetime, timedelta
from .config import settings
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from jose import JWTError, jwt


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    print(f"DEBUG: Received token: {token[:10]}...")
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_raw = payload.get("sub")
        if user_id_raw is None:
            print("DEBUG: sub is None")
            raise HTTPException(status_code=401)
        return int(user_id_raw)
    except JWTError as e:
        print(f"DEBUG: JWT Error: {e}")
        raise HTTPException(status_code=401)