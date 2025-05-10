import os
from langchain.chains import GraphCypherQAChain
from langchain_neo4j import Neo4jGraph
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from typing import Optional
from .prompt import custom_prompt

load_dotenv()


class ChatOpenRouter(ChatOpenAI):
    def __init__(self, model_name: str, openai_api_key: Optional[str] = None, **kwargs):
        openai_api_key = openai_api_key or os.getenv("OPENROUTER_API_KEY")
        super().__init__(
            model_name=model_name,
            openai_api_key=openai_api_key,
            base_url="https://openrouter.ai/api/v1",
            **kwargs
        )


def initialize_query_chain():
    graph = Neo4jGraph(
        url=os.getenv("NEO4J_URI"),
        username=os.getenv("NEO4J_USERNAME"),
        password=os.getenv("NEO4J_PASSWORD")
    )

    llm = ChatOpenRouter(
        temperature=0,
        model_name="openai/gpt-4o"
    )

    chain = GraphCypherQAChain.from_llm(
        allow_dangerous_requests=True,
        cypher_llm=llm,
        qa_llm=llm,
        graph=graph,
        verbose=True,
        prompt=custom_prompt
    )
    return chain
