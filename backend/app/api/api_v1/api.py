from fastapi import APIRouter

from app.api.api_v1.endpoints import login, posts, utils

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
