from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.v1 import api_v1

app = FastAPI(title="CoreTech API", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(api_v1, prefix="/api/v1")

# Dev CORS (Vite: http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
