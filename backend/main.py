from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from graph_db import router as graph_router


app = FastAPI(
    title="Greenvisor API",
    description="API for greenvisor.",
    version="1.0.0",
    docs_url="/docs"
)

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the graph router
app.include_router(graph_router, prefix="/graph", tags=["graph"])

@app.get("/")
def read_root():
    return {"Hello"}







