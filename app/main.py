from fastapi import FastAPI
from .api.v1.api import api_router
from app.core.config import settings
from app.core.exceptions import ServiceExceptions, service_exception_handler
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.middlewares import setup_middlewares
import os



app = FastAPI(title=settings.PROJECT_NAME)
setup_middlewares(app)
app.add_exception_handler(ServiceExceptions, service_exception_handler)

app.include_router(api_router, prefix='/api/v1')


frontend_path = os.path.join(os.getcwd(), "frontend_new", "dist")
app.mount("/frontend_new", StaticFiles(directory=frontend_path), name="frontend_new")


@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(frontend_path, "index.html"))