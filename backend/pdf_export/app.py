from fastapi import APIRouter
from pdf_export import json_to_pdf

router = APIRouter()

@router.get("/export")
async def get_pdf(data: dict, output_path: str):
    json_to_pdf(data=data, output_path=output_path)
    return {"message": "PDF generated successfully", "output_path": output_path}