from langchain.prompts import PromptTemplate

def validate_json(text):
    """
    Validates if the input text is a valid JSON string.

    Tries to parse the input text using `json.loads()`. If successful,
    it means the text is valid JSON and the function returns True.
    If a `json.JSONDecodeError` or any other exception occurs during parsing,
    it prints the error and returns False.

    Args:
        text: The string to be validated as JSON.

    Returns:
        True if the text is valid JSON, False otherwise.
    """
    try:
        json.loads(text)
        return True
    except Exception as error:
        print(error)
        return False

prompt_en="""
You are an AI home energy consultant in Germany. Which renovations can I make to my house to reduce the monthly cost? Currently I spend 2200 euro per year for heating. Take into account the government subsidies in Germany and german laws. If a renovation is obligatory by German law, set the "obligatory" field to true. Output the most important renovations at first, for example in this order:

1. Insulation
2. Window replacement
3. Changing heating type

Here is an example output JSON. Generate the answer in same format, possibly with more dicts in the array. Don't output anything else except the JSON. Don't add quotes around the JSON.

--- BEGIN OF EXAMPLE JSON ---

[
  {
    "Measure": "Heating",
    "ExampleProduct": "Viessmann Vitocal 250-A",
    "InvestmentCostsEuro": 11000,
    "HeatingCostPerYear": {
      "current": 2200,
      "future": 1500
    },
    "CO2KgPerYear": {
      "current": 8000,
      "future": 2000
    },
    "SubsidiesPercentage": {
      "maximum": 50,
      "comment": "Bis 50%"
    },
    "obligatory": {
        "value": true,
        "comment": "Prinzipiell dürfen Heizkessel mit einem flüssigen oder gasförmigen Brennstoff, die vor dem 1/1/1991 eingebaut oder aufgestellt worden sind, laut GEG §72 (1) nicht mehr betrieben werden."
    }
  },
]

--- END OF EXAMPLE JSON ---
"""



prompt_de="""
Sie sind ein KI-Hausenergieberater in Deutschland. Welche Renovierungen kann ich an meinem Haus vornehmen, um die monatlichen Kosten zu senken? Derzeit gebe ich 2200 Euro pro Jahr für Heizung aus. Berücksichtigen Sie die staatlichen Subventionen in Deutschland und die deutschen Gesetze. Wenn eine Renovierung nach deutschem Recht obligatorisch ist, setzen Sie das Feld "obligatory" auf true. Geben Sie zuerst die wichtigsten Renovierungen aus, zum Beispiel in dieser Reihenfolge:

1. Isolierung
2. Fensterwechsel
3. Heizungsart ändern

Hier ist ein Beispiel für die Ausgabe von JSON. Generieren Sie die Antwort im selben Format, möglicherweise mit mehr Diktaten im Array. Geben Sie außer dem JSON nichts anderes aus. Fügen Sie dem JSON keine Anführungszeichen hinzu.

--- BEGIN OF EXAMPLE JSON ---

[
  {
    "Measure": "Heizung",
    "ExampleProduct": "Viessmann Vitocal 250-A",
    "InvestmentCostsEuro": 11000,
    "HeatingCostPerYear": {
      "current": 2200,
      "future": 1500
    },
    "CO2KgPerYear": {
      "current": 8000,
      "future": 2000
    },
    "SubsidiesPercentage": {
      "maximum": 50,
      "comment": "Bis 50%"
    },
    "obligatory": {
      "value": true,
      "comment": "Prinzipiell dürfen Heizkessel mit einem flüssigen oder gasförmigen Brennstoff, die vor dem 1/1/1991 eingebaut oder aufgestellt worden sind, laut GEG §72 (1) nicht mehr betrieben werden."
    }
  },
]

--- END OF EXAMPLE JSON ---
"""

custom_prompt = PromptTemplate(
    input_variables=["user_context", "graph_context", "question"],
    template=prompt_de
)