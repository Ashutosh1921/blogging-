from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/admin", response_model=List[schemas.post.Post])
def read_posts_admin(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve all posts (Admin).
    """
    posts = crud.crud_post.get_all_posts_admin(db, skip=skip, limit=limit)
    return posts

@router.get("/admin/{id}", response_model=schemas.post.Post)
def read_post_admin(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get post by ID (Admin).
    """
    post = crud.crud_post.get_post(db, post_id=id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.get("/", response_model=List[schemas.post.Post])
def read_posts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve posts (Public).
    """
    posts = crud.crud_post.get_posts(db, skip=skip, limit=limit)
    return posts

@router.get("/{slug}", response_model=schemas.post.Post)
def read_post(
    slug: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get post by slug (Public).
    """
    post = crud.crud_post.get_post_by_slug(db, slug=slug)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not post.is_published: 
         raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/{id}/like", response_model=schemas.post.Post)
def like_post(
    id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Like a post.
    """
    post = crud.crud_post.like_post(db, post_id=id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# Admin Routes
@router.post("/", response_model=schemas.post.Post)
def create_post(
    *,
    db: Session = Depends(deps.get_db),
    post_in: schemas.post.PostCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new post.
    """
    post = crud.crud_post.create_post(db=db, post=post_in, author_id=current_user.id)
    return post

@router.put("/{id}", response_model=schemas.post.Post)
def update_post(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    post_in: schemas.post.PostUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a post.
    """
    post = crud.crud_post.get_post(db=db, post_id=id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post = crud.crud_post.update_post(db=db, db_obj=post, post_in=post_in)
    return post

@router.delete("/{id}", response_model=schemas.post.Post)
def delete_post(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete a post.
    """
    post = crud.crud_post.get_post(db=db, post_id=id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post = crud.crud_post.delete_post(db=db, post_id=id)
    return post

