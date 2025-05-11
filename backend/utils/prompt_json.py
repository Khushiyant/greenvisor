"""
Process the output of language model to produce:
1) suggested renovations
2) total summary
"""

import json

def strip_answer(text):
  """ Remove JSON formatting ```json ... ``` of the language model """
  return text.replace("```json", "").replace("```", "")

def validate_json(text):
    try:
        json.loads(text)
        return True
    except Exception as error:
        return False

prompt_en="""
You are an AI home energy consultant in Germany. Take into account the user data, government subsidies in Germany and german laws. 

Which renovations can I make to my house to reduce the monthly cost? If a renovation is obligatory by German law, set the "obligatory" field to true. Output most important renovations at first, for example in this order:

1. Insulation
2. Window replacement
3. Changing heating type

The renovations should be at least 3 years apart.

Here is an example output JSON. Generate the answer in same format, possibly with more dicts in the array. Write the values in the JSON in English language. Don't output anything except the JSON. Don't add quotes around the JSON.

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

def limit_str_length(string, length):
  if len(string) > length:
    return string[:length] + "..."
  return string

def form_renovations_json(data):
  """
  Convert language model JSON to key-column format.
  """
  cols = list(data[0].keys())
  result = {col: [] for col in cols}
  for renovation in data:
      result['Measure'].append(renovation['Measure'])
      result['ExampleProduct'].append(renovation['ExampleProduct'])
      result['InvestmentCostsEuro'].append(str(renovation['InvestmentCostsEuro']))
      result['HeatingCostPerYear'].append(
        "from {} €/year to {} €/year".format(renovation['HeatingCostPerYear']['current'], renovation['HeatingCostPerYear']['future'])
      )
      result['CO2KgPerYear'].append(
        "from {} kg/year to {} kg/year".format(renovation['CO2KgPerYear']['current'], renovation['CO2KgPerYear']['future'])
      )

      bool_to_str = {
        False: 'no',
        True: 'yes'
      }
      LIMIT = 50
      result['SubsidiesPercentage'].append(
        limit_str_length(renovation['SubsidiesPercentage']['comment'], LIMIT))
      result['obligatory'].append(
        bool_to_str[renovation['obligatory']['value']])
      result['RecommendedChangeDate'].append(
        limit_str_length(str(renovation['RecommendedChangeDate']['value']), LIMIT))
  return result




prompt_total_en="""
You are an AI home energy consultant in Germany. Take into account the user data, government subsidies in Germany and german laws.

I have a plan of house renovation in JSON format. Estimate the total parameters of my house before and after renovations. I give you an output JSON format and description of the fields. Generate the answer in same format but replace all values with estimates. Don't output anything except the JSON. Don't add quotes around the JSON.

--- OUTPUT JSON FIELDS DESCRIPTION ---

TotalHeatingUsage: energy used for heating in kWh per year.
TotalElectricityUsage: electricity usage in kWh per year. If I have an electrical heater, the electricity is spent both on heating and utilities.
TotalHeatingCost: cost of heating in euros per year.
TotalElectricityCost: cost of electricity in euros per year.
EnergyEfficiency: the German energy efficiency score from A (best) to H (worst).
CO2Emissions: CO2 emissions of the household in kg per year.

--- BEGIN OF OUTPUT JSON ---

[
  {
    "TotalHeatingUsage": {
        "before": 0,
        "after": 0
    },
    "TotalElectricityUsage": {
        "before": 0,
        "after": 0
    },
    "TotalHeatingCost": {
        "before": 0,
        "after": 0
    },
    "TotalElectricityCost": {
        "before": 0,
        "after": 0
    },
    "EnergyEfficiency": {
        "before": "F",
        "after": "F"
    },
    "CO2Emissions": {
        "before": 0,
        "after": 0
    }
  }
]

--- END OF OUTPUT JSON ---
"""

def form_total_json(total):
  """
  Convert language model JSON to column-key format.
  """
  result = {
      'aspect': [],
      'before': [],
      'after': []
  }
  total = total[0]
  for key in total:
      result['aspect'].append(key)
      values = total[key]
      result['before'].append(str(values['before']))
      result['after'].append(str(values['after']))
  return result

