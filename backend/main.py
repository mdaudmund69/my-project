from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import os
from passlib.context import CryptContext
import jwt

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/legalmentor")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI app
app = FastAPI(title="LegalMentor API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    account_type = Column(String, nullable=False)  # lawyer, client, admin
    phone = Column(String)
    company = Column(String)
    specialization = Column(String)
    bar_number = Column(String)
    is_active = Column(Boolean, default=True)
    is_email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    cases = relationship("Case", back_populates="client")
    appointments = relationship("Appointment", back_populates="client")

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, unique=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="active")  # active, pending, completed, on-hold
    priority = Column(String, default="medium")  # high, medium, low
    category = Column(String)
    court = Column(String)
    client_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    next_hearing = Column(DateTime)
    
    # Relationships
    client = relationship("User", back_populates="cases")
    documents = relationship("Document", back_populates="case")
    activities = relationship("Activity", back_populates="case")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String)
    file_size = Column(Integer)
    case_id = Column(Integer, ForeignKey("cases.id"))
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    case = relationship("Case", back_populates="documents")

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    activity_type = Column(String)  # meeting, call, document, court, research
    case_id = Column(Integer, ForeignKey("cases.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    scheduled_at = Column(DateTime)
    duration = Column(Integer)  # in minutes
    billable = Column(Boolean, default=False)
    
    # Relationships
    case = relationship("Case", back_populates="activities")

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    appointment_type = Column(String)  # meeting, court, call, consultation
    client_id = Column(Integer, ForeignKey("users.id"))
    case_id = Column(Integer, ForeignKey("cases.id"))
    location = Column(String)
    status = Column(String, default="scheduled")  # scheduled, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    client = relationship("User", back_populates="appointments")

# Pydantic Models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    account_type: str
    phone: Optional[str] = None
    company: Optional[str] = None
    specialization: Optional[str] = None
    bar_number: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    account_type: str
    phone: Optional[str]
    company: Optional[str]
    specialization: Optional[str]
    bar_number: Optional[str]
    is_active: bool
    is_email_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class CaseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    court: Optional[str] = None
    client_id: int
    priority: str = "medium"

class CaseResponse(BaseModel):
    id: int
    case_number: str
    title: str
    description: Optional[str]
    status: str
    priority: str
    category: Optional[str]
    court: Optional[str]
    client_id: int
    created_at: datetime
    updated_at: datetime
    next_hearing: Optional[datetime]
    
    class Config:
        from_attributes = True

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def generate_case_number() -> str:
    from datetime import datetime
    return f"CASE-{datetime.now().year}-{datetime.now().strftime('%m%d%H%M%S')}"

# API Routes
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = hash_password(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        account_type=user.account_type,
        phone=user.phone,
        company=user.company,
        specialization=user.specialization,
        bar_number=user.bar_number
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/api/auth/login")
async def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate JWT token
    token_data = {"sub": str(user.id), "email": user.email}
    token = jwt.encode(token_data, "secret_key", algorithm="HS256")
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@app.get("/api/cases", response_model=List[CaseResponse])
async def get_cases(db: Session = Depends(get_db)):
    cases = db.query(Case).all()
    return cases

@app.post("/api/cases", response_model=CaseResponse)
async def create_case(case: CaseCreate, db: Session = Depends(get_db)):
    db_case = Case(
        case_number=generate_case_number(),
        title=case.title,
        description=case.description,
        category=case.category,
        court=case.court,
        client_id=case.client_id,
        priority=case.priority
    )
    
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    
    return db_case

@app.get("/api/cases/{case_id}", response_model=CaseResponse)
async def get_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@app.get("/api/users", response_model=List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    total_cases = db.query(Case).count()
    active_cases = db.query(Case).filter(Case.status == "active").count()
    total_clients = db.query(User).filter(User.account_type == "client").count()
    
    return {
        "total_cases": total_cases,
        "active_cases": active_cases,
        "total_clients": total_clients,
        "pending_cases": db.query(Case).filter(Case.status == "pending").count(),
        "completed_cases": db.query(Case).filter(Case.status == "completed").count()
    }

# Create tables
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
