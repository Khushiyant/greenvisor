from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from graph_db import router as graph_router
from pdf_export import pdf_router

app = FastAPI(
    title="Greenvisor API",
    description="API for greenvisor.",
    version="1.0.0",
    docs_url="/docs"
)
"""
The main FastAPI application instance for the Greenvisor API.

This application serves as the central entry point for the API,
configuring CORS middleware, and including various routers for different
functionalities such as graph database operations and PDF exports.
"""

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

# Include the PDF export router
app.include_router(pdf_router, prefix="/pdf", tags=["pdf"])

@app.get("/")
def read_root():
    """
    Root endpoint for the Greenvisor API.

    Returns a simple greeting message. This can be used as a basic
    health check or a welcome message for the API.
    """
    return {"Hello"}