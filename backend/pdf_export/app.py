from fastapi import APIRouter
from pdf_export import json_to_pdf

router = APIRouter()

@router.get("/export")
async def get_pdf(data: dict, output_path: str):
    """
    Exports a PDF file from the provided JSON data.

    This endpoint takes a dictionary of data and an output path,
    uses the `json_to_pdf` function to generate a PDF file from this data,
    and saves it to the specified path.

    Args:
        data: A dictionary containing the data to be included in the PDF.
              The structure of this dictionary is dependent on the
              `json_to_pdf` function's requirements.
        output_path: The file path (including filename and .pdf extension)
                     where the generated PDF should be saved.

    Returns:
        A dictionary with a success message and the output path of the
        generated PDF.
    """
    json_to_pdf(data=data, output_path=output_path)
    return {"message": "PDF generated successfully", "output_path": output_path}