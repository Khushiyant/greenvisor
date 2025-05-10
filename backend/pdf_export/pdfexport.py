# requirements
# sudo apt install wkhtmltopdf
# pip install pdfkit==1.0.0 jinja2==3.1.6

import json
import pandas as pd
import pdfkit

# pdfkit is just a wrapper for whktmltopdf. you need to install wkhtml and have it on the path
# alternatively, you can move wkhtmltoimage.exe, wkhtmltopdf.exe and wkhtmltox.dll into the working directory

def json_to_pdf(data, output_path):
    """
    data: json in format {"column 1": ["row 1", ..., "row n"], "column 2": ["row 1", ..., "row n"] }

    For example:
    data = {
        "criterion": ["heating", "windows", "ventilation"],
        "example product": ["Viessmann Vitocal 250-A", "EcoTherm Dreifachverglasung", "AirPro 200"]
    }
    """

    df = pd.DataFrame(data)

    html_header = """<!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Einzelmaßnahmen</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f2f5; /* A light grey, adjust if needed */
                display: flex;
                justify-content: center;
                align-items: flex-start; /* Align to top for longer content */
                min-height: 100vh;
                padding: 20px;
                box-sizing: border-box;
            }

            .measures-container {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 1100px; /* Adjusted max-width */
                overflow: hidden; /* To contain the header's background */
            }

            .measures-header {
                background-color: #e0f2e9; /* Light green background */
                padding: 20px 25px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #d0e0d8; /* Subtle border */
            }

            .measures-header h2 {
                margin: 0;
                font-size: 22px;
                color: #333;
                font-weight: bold;
            }

            .add-budget-btn {
                background-color: #34a853; /* Green button */
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
            }

            .measures-table {
                width: 100%;
                border-collapse: collapse; /* Removes gaps between cells */
            }

            .measures-table th,
            .measures-table td {
                padding: 15px 25px; /* Increased padding for better spacing */
                text-align: left;
                border-bottom: 1px solid #e8e8e8; /* Lighter border for rows */
                font-size: 14px;
                vertical-align: top; /* Align content to the top of the cell */
            }

            .measures-table th {
                color: #555;
                font-weight: normal; /* As per screenshot, headers are not bold */
                font-size: 13px; /* Slightly smaller header font */
                padding-top: 20px; /* More space above header text */
                padding-bottom: 10px;
                white-space: nowrap; /* Prevent header text from wrapping */
            }

            .measures-table tr:last-child td {
                border-bottom: none; /* No border for the last row */
            }

            .measure-name {
                font-weight: bold;
                color: #333;
                font-size: 15px;
            }

            .product-name {
                color: #444;
            }

            .investment {
                color: #333;
                white-space: nowrap;
            }

            .savings {
                color: #2e7d32; /* Green color for savings */
                font-weight: bold;
            }

            .savings .arrow {
                display: inline-block;
                margin-right: 4px;
            }

            .savings-detail {
                font-size: 12px;
                color: #555;
                font-weight: normal;
                display: block; /* Make it appear on a new line */
                margin-top: 2px;
            }

            .funding-info {
                color: #555;
            }

            .more-info-link {
                color: #34a853; /* Green link */
                text-decoration: underline;
                font-size: 13px;
                display: block;
                margin-top: 2px;
            }

            .action-icons {
                display: flex;
                align-items: center;
                gap: 15px; /* Space between icons */
                white-space: nowrap;
            }

            .action-icons span {
                font-size: 20px; /* Adjust icon size as needed */
                color: #757575; /* Icon color */
                cursor: pointer;
            }

            /* Column specific widths (approximate, adjust as needed) */
            .col-measure { width: 15%; }
            .col-product { width: 20%; }
            .col-investment { width: 12%; text-align: right; }
            .col-heating-savings { width: 18%; }
            .col-co2-savings { width: 15%; }
            .col-funding { width: 15%; }
            .col-actions { width: 5%; text-align: right; }
        </style>
    </head>
    """

    table_head = """
    <div class="measures-container">
        <div class="measures-header">
            <h2>Einzelmaßnahmen</h2>
        </div>

        <table class="measures-table">
            <thead><tr>
    """

    # generate table head
    for col_i in range(df.shape[1]):
        table_head += '<th>' + df.columns[col_i] + '</th>'  # class="col-measure"
        
    table_head += "</tr></thead>"

    table_end = """
    </table>
    </div>
    """

    # add all rows to table body
    table_body = ""

    # iterate over dataframe
    for row_i in range(df.shape[0]):
        row = df.iloc[row_i, :]

        row_html = []
        for col_i in range(df.shape[1]):
            row_html.append('<td>' + row.iloc[col_i] + '</td>')  # class="col-measure measure-name"
        
        row_html = '<tr>' + "\n".join(row_html) + '</tr>'
        table_body += row_html

    table_body = '<tbody>' + table_body + '</tbody>'

    html_out = html_header + "<body>" + table_head + table_body + table_end + "</body>"


    # write the html to file
    #with open("output.html", "wb") as file_:
    #    file_.write(html_out.encode("utf-8"))

    # without this access to other files is blocked
    options = {
        "enable-local-file-access": None
    }

    # write the pdf to file
    pdfkit.from_string(html_out, output_path=output_path, options=options)  # css=["template.css"],


if __name__ == "__main__":
    df = pd.read_json("data-einzel.json")

    with open("data-einzel.json") as f:
        data = json.load(f)
    json_to_pdf(data, "output.pdf")