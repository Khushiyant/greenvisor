from fastapi import APIRouter, HTTPException
from models import QueryRequest
from utils.query import initialize_query_chain
import os
from graph_db.vectorizer import process_and_store_documents_async

BASE_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))

query_chain = initialize_query_chain()
router = APIRouter()


@router.post("/query")
async def query_graph(request: QueryRequest):
    try:
        response = query_chain.run(request.question)
        return {"response": response['result']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/process-folder/{folder_path:path}")
async def process_folder(folder_path: str):
    # Ensure the folder path is absolute
    abs_folder_path = os.path.abspath(folder_path)

    if not abs_folder_path.startswith(os.path.abspath(BASE_DATA_DIR)):
        raise HTTPException(status_code=403, detail="Access to the specified folder is forbidden")

    # Check if the folder exists
    if not os.path.isdir(abs_folder_path):
        raise HTTPException(status_code=404, detail="Folder not found")

    try:
        await process_and_store_documents_async(abs_folder_path)
        return {"message": f"Successfully processed folder: {abs_folder_path}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))