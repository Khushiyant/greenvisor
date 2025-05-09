from openai import OpenAI
from dotenv import load_dotenv  

import os

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if OPENROUTER_API_KEY is None:
    raise ValueError("OPENROUTER_API_KEY environment variable not set.")


client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=OPENROUTER_API_KEY,
)

def chat_completion(question: str, model: str = "openai/gpt-4o") -> str:
    """
    Function to get a chat completion from OpenRouter API.
    
    Args:
        question (str): The question to ask the model.
        model (str): The model to use for the completion.
        
    Returns:
        str: The response from the model.
    """
    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": question
            }
        ]
    )

    return {
        "message": response.choices[0].message.content
    }