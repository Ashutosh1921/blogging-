from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate

def get_post(db: Session, post_id: int):
    return db.query(Post).filter(Post.id == post_id).first()

def get_post_by_slug(db: Session, slug: str):
    return db.query(Post).filter(Post.slug == slug).first()

def get_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Post).filter(Post.is_published == True).order_by(Post.published_at.desc()).offset(skip).limit(limit).all()

def get_all_posts_admin(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

from datetime import datetime

def create_post(db: Session, post: PostCreate, author_id: int):
    post_data = post.dict()
    if post.is_published and not post_data.get("published_at"):
        post_data["published_at"] = datetime.utcnow()
        
    db_obj = Post(
        **post_data,
        author_id=author_id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_post(db: Session, db_obj: Post, post_in: PostUpdate):
    obj_data = post_in.dict(exclude_unset=True)
    if obj_data.get("is_published") and not db_obj.published_at:
         obj_data["published_at"] = datetime.utcnow()
         
    for field in obj_data:
        setattr(db_obj, field, obj_data[field])
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_post(db: Session, post_id: int):
    obj = db.query(Post).get(post_id)
    db.delete(obj)
    db.commit()
    return obj

def like_post(db: Session, post_id: int):
    post = db.query(Post).get(post_id)
    if not post:
        return None
    if post.likes is None:
        post.likes = 0
    post.likes += 1
    db.add(post)
    db.commit()
    db.refresh(post)
    return post
