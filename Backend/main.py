import sys
import os
import logging
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from config import settings  # Add this import
import schemas, models, auth
from database import get_db, engine
from urllib.parse import urlparse  # Add this import

logging.basicConfig(level=logging.INFO)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Optional
from scanners.zap_scanner import ZAPScanner
from scanners.nmap_scanner import NmapScanner

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Security Scanner API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add error handling middleware
@app.middleware("http")
async def error_handling(request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)}
        )

# Initialize scanners
try:
    zap_scanner = ZAPScanner()
    zap_available = True
except Exception as e:
    logging.warning(f"ZAP scanner initialization failed: {e}")
    zap_scanner = None
    zap_available = False

nmap_scanner = NmapScanner()

class ScanRequest(BaseModel):
    url: HttpUrl
    scan_type: Optional[str] = "full"  # full, quick, custom

@app.post("/register", response_model=schemas.User)
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        user = db.query(models.User).filter(models.User.username == form_data.username).first()
        if not user or not auth.verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user.username},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        raise

@app.post("/scan", response_model=schemas.ScanResponse)
async def start_scan(
    scan_request: schemas.ScanCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Create scan record
        db_scan = models.Scan(
            target_url=str(scan_request.url),
            scan_type=scan_request.scan_type,
            status="in_progress",
            user_id=current_user.id
        )
        db.add(db_scan)
        db.commit()
        db.refresh(db_scan)

        results = {}
        
        # Start ZAP scan if available
        if zap_available and zap_scanner:
            try:
                zap_results = await zap_scanner.start_scan(str(scan_request.url))
                results["zap_scan"] = zap_results
            except Exception as e:
                results["zap_scan"] = {"error": str(e)}
        else:
            results["zap_scan"] = {"status": "unavailable", "message": "ZAP scanner is not available"}
        
        # Start Nmap scan
        try:
            domain = urlparse(str(scan_request.url)).netloc
            nmap_results = await nmap_scanner.scan_target(domain)
            results["nmap_scan"] = nmap_results
        except Exception as e:
            results["nmap_scan"] = {"error": str(e)}
        
        # Update scan results
        db_scan.results = results
        db_scan.status = "completed"
        db_scan.end_time = datetime.utcnow()
        db.commit()
        
        return db_scan
    except Exception as e:
        db_scan.status = "failed"
        db_scan.end_time = datetime.utcnow()
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/results/{scan_id}")
async def get_scan_results(scan_id: str):
    try:
        zap_alerts = await zap_scanner.get_scan_results(scan_id)
        return {
            "status": "success",
            "results": zap_alerts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test")
async def test_connection():
    try:
        # Test ZAP connection with simple version check
        zap_version = await zap_scanner.get_version()
        
        return {
            "status": "success",
            "zap_version": zap_version,
            "message": "ZAP scanner is connected"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
