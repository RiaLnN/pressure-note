from fastapi import Request
from fastapi.responses import JSONResponse

class ServiceExceptions(Exception):
    def __init__(self, name: str, status_code: int = 400):
        self.name = name
        self.status_code = status_code

async def service_exception_handler(request: Request, exc: ServiceExceptions):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "Buisness Logic Error", "message": exc.name}
    )