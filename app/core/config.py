from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Pressure tracker"
    DATABASE_URL: str = "sqlite+aiosqlite:///./app.db"
    WEB_APP_URL: str = "https://dori-nonrefillable-subgerminally.ngrok-free.dev"
    BOT_TOKEN: str
    SECRET_KEY: str
    ALGORITHM: str
    ADMIN_ID: int


    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()