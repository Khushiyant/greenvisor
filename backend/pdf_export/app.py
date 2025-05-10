from fastapi import APIRouter, FastAPI, HTTPException
from pdfexport import json_to_pdf
router = APIRouter()

@router.get("/pdf")
async def get_pdf(data: dict, output_path: str):
    json_to_pdf()