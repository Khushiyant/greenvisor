from fastapi import APIRouter, Depends, HTTPException
from .vectorizer import create_embeddings

router = APIRouter()

@router.post("/create")
async def create_graph(
    collection_name: str,
    path: str
):
    create_embeddings(collection_name=collection_name, path=path)
    return {"message": "Graph created successfully."}


