from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    # OWASP ZAP Configuration
    ZAP_API_KEY: str = os.getenv("ZAP_API_KEY", "")
    ZAP_ADDRESS: str = os.getenv("ZAP_ADDRESS", "localhost")
    ZAP_PORT: int = int(os.getenv("ZAP_PORT", "8080"))

    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    DB_NAME: str = os.getenv("DB_NAME")
    DB_USER: str = os.getenv("DB_USER")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD")
    DB_HOST: str = os.getenv("DB_HOST")
    DB_PORT: str = os.getenv("DB_PORT")

    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
