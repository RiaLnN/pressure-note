from fastapi import FastAPI
from .api.v1.api import api_router
from app.core.config import settings
from app.core.exceptions import ServiceExceptions, service_exception_handler
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from fastapi.middleware.cors import CORSMiddleware




app = FastAPI(title=settings.PROJECT_NAME)

app.add_exception_handler(ServiceExceptions, service_exception_handler)

app.include_router(api_router, prefix='/api/v1')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

frontend_path = os.path.join(os.getcwd(), "frontend")
app.mount("/frontend", StaticFiles(directory=frontend_path), name="frontend")


@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(frontend_path, "index.html"))