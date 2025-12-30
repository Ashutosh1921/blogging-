from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class PostBase(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    cover_image_url: Optional[str] = None
    likes: Optional[int] = 0
    is_published: Optional[bool] = False

# Properties to receive on creation
class PostCreate(PostBase):
    title: str
    slug: str
    content: str

# Properties to receive on update
class PostUpdate(PostBase):
    pass

# Properties shared by models stored in DB
class PostInDBBase(PostBase):
    id: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    author_id: int

    class Config:
        orm_mode = True

# Properties to return to client
class Post(PostInDBBase):
    pass

# Properties properties stored in DB
class PostInDB(PostInDBBase):
    pass
