import shutil
import os
from typing import Any
from fastapi import APIRouter, File, UploadFile, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app import models
from app.core.config import settings

router = APIRouter()

import cloudinary
import cloudinary.uploader

@router.post("/upload", response_model=dict)
def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Upload an image to Cloudinary and track it.
    """
    try:
        if settings.CLOUDINARY_URL:
            try:
                # Manual parsing to ensure it works
                # Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
                url = settings.CLOUDINARY_URL.replace("cloudinary://", "")
                if "@" in url and ":" in url:
                    creds, cloud_name = url.split("@")
                    api_key, api_secret = creds.split(":")
                    
                    cloudinary.config(
                        cloud_name=cloud_name,
                        api_key=api_key,
                        api_secret=api_secret
                    )
                else:
                     # Fallback
                     cloudinary.config(cloudinary_url=settings.CLOUDINARY_URL)
            except Exception as e:
                print(f"DEBUG: Parsing error: {e}")
                cloudinary.config(cloudinary_url=settings.CLOUDINARY_URL)
            
        response = cloudinary.uploader.upload(file.file, resource_type="auto")
        secure_url = response.get("secure_url")
        public_id = response.get("public_id")
        
        # Save to DB
        db_image = models.Image(
            url=secure_url,
            public_id=public_id,
            author_id=current_user.id
        )
        db.add(db_image)
        db.commit()
        db.refresh(db_image)
        
        print(f"DEBUG: Upload successful and saved to DB: {secure_url}")
        
        return {"url": secure_url}
    except Exception as e:
        print(f"Upload error: {e}")
        return {"error": str(e)}

@router.get("/debug-config")
def debug_config():
    """
    Debug configuration.
    """
    return {
        "CLOUDINARY_URL_SETTING": settings.CLOUDINARY_URL,
        "ENV_VAR": os.environ.get("CLOUDINARY_URL"),
        "Cloudinary_Config": cloudinary.config().api_key if cloudinary.config().api_key else "Not Configured"
    }
@router.get("/health", response_model=dict)
def health_check():
    return {"status": "ok"}
