from app.db.session import SessionLocal
from app.crud.crud_user import create_user
from app.schemas.user import UserCreate
from app.db import base  # Import all models

def init_db():
    db = SessionLocal()
    user_in = UserCreate(
        email="admin@example.com",
        username="admin",
        password="adminpassword"
    )
    user = create_user(db, user_in)
    print(f"Created admin user: {user.username}")

if __name__ == "__main__":
    init_db()
