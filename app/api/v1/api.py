from fastapi import APIRouter
from .endpoints import users, measurements, stats, medications

app = APIRouter()

api_router = APIRouter()
api_router.include_router(users.router, prefix='/users', tags=["users"])
api_router.include_router(measurements.router, prefix='/measurements', tags=["measurements"])
api_router.include_router(stats.router, prefix='/stats', tags=["stats"])
api_router.include_router(medications.router, prefix='/medications', tags=['medications'])
