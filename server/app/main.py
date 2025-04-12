from fastapi import FastAPI
from app.api.routes import router
from app.core.database import engine, Base
from app.api.auth import router as auth_router
from app.api.protected import router as protected_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShadowScan Backend")
app.include_router(router)
app.include_router(auth_router)
app.include_router(protected_router)


@app.get("/")
def root():
    return {"message": "ShadowScan API running"}
