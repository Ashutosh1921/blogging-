from sqlalchemy import Boolean, Column, Integer, String
from app.db.base_class import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    
    # Relationships
    posts = relationship("Post", back_populates="author", lazy="select")
    # images = relationship("Image", back_populates="author", lazy="select")  # Temporarily disabled
