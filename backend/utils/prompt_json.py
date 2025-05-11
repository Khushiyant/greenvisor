def validate_json(text):
    try:
        json.loads(text)
        return True
    except Exception as error:
        print(error)
        return False

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

prompt_en="""
You are an AI home energy consultant in Germany. Which renovations can I make to my house to reduce the monthly cost? Currently I spend 2200 euro per year for heating. Take into account the government subsidies in Germany and german laws. If a renovation is obligatory by German law, set the "obligatory" field to true. Output most important renovations at first, for example in this order:

1. Insulation
2. Window replacement
3. Changing heating type

The renovations should be at least 3 years apart.

Here is an example output JSON. Generate the answer in same format, possibly with more dicts in the array. Write the values in the JSON in German language. Don't output anything except the JSON. Don't add quotes around the JSON.

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
    },
    "RecommendedChangeDate": {
      "value": 2027
    }
  },
]

--- END OF EXAMPLE JSON ---
"""


prompt_total_en="""
You are an AI home energy consultant in Germany. I have a plan of house renovation in JSON format. Currently I spend 2200 euro per year for heating. Estimate the new total parameters of my house after renovations. Take into account the government subsidies in Germany and german laws. 

Here is an example output JSON and description of the fields. Generate the answer in same format but replace with the estimated values. Write the values in the JSON in German language. Don't output anything except the JSON. Don't add quotes around the JSON.

After the example output JSON, you will get the plan of house renovation in JSON format.

--- OUTPUT JSON FIELDS DESCRIPTION ---

TotalHeatingUsage: energy used for heating in kWh per year.
TotalElectricityUsage: electricity usage in kWh per year. If I have an electrical heater, the electricity is spent both on heating and utilities.
TotalHeatingCost: cost of heating in euros per year.
TotalElectricityCost: cost of electricity in euros per year.
EnergyEfficiency: the German energy efficiency score from A (best) to H (worst).
CO2Emissions: CO2 emissions of the household in kg per year.

--- BEGIN OF EXAMPLE OUTPUT JSON ---

[
  {
    "TotalHeatingUsage": {
        "before": 20000,
        "after": 10000
    },
    "TotalElectricityUsage": {
        "before": 4500,
        "after": 2000
    },
    "TotalHeatingCost": {
        "before": 4100,
        "after": 700
    },
    "TotalElectricityCost": {
        "before": 1200,
        "after": 900
    },
    "EnergyEfficiency": {
        "before": "F",
        "after": "C"
    },
    "CO2Emissions": {
        "before": 8500,
        "after": 2000"
    }
  }
]

--- END OF EXAMPLE OUTPUT JSON ---
"""