from database import engine, SessionLocal, Base
import models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def cleanup_db():
    try:
        # Drop and recreate all tables
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        logger.info("Database reset successfully!")
    except Exception as e:
        logger.error(f"Error resetting database: {str(e)}")
        raise

if __name__ == "__main__":
    cleanup_db()
