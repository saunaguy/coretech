from fastapi import FastAPI
from .api.v1 import api_v1

app = FastAPI(title="CoreTech API", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(api_v1, prefix="/api/v1")
