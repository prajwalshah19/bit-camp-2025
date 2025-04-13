from fastapi import FastAPI
from app.api.routes import router
from app.core.database import engine, Base
from app.api.auth import router as auth_router
from app.api.protected import router as protected_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShadowScan Backend")

# CORS configuration
origins = [
    "http://localhost:5173",       # React dev server
    "http://127.0.0.1:5173",       # React dev server
    "http://localhost:80",       # React dev server (Docker)
    "http://127.0.0.1:80",       # React dev server (Docker)
    "http://bit-camp-2025-1.onrender.com"


    # "https://app.yourdomain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    # expose_headers=["*"]
)

app.include_router(router)
app.include_router(auth_router)
app.include_router(protected_router)


@app.get("/")
def root():
    return {"message": "ShadowScan API running"}

