from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging import logger

async def log_request(request, call_next):
    logger.info("Incoming request: %s %s", request.method, request.url)
    response = await call_next(request)
    logger.info("Response status: %s", response.status_code)
    return response

def setup_middlewares(app: FastAPI):
    app.add_middleware(BaseHTTPMiddleware, dispatch=log_request)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PUT", "PATCH"],
        allow_headers=["Content-Type", "X-Telegram-Init-Data", "Authorization", "Accept"],
        expose_headers=["X-Telegram-Init-Data"],
    )