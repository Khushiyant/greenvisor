import os
from typing import Optional

from dotenv import load_dotenv

from langchain_neo4j import GraphCypherQAChain, Neo4jGraph
from langchain_openai import ChatOpenAI

from .prompt import custom_prompt, cypher_chain_prompt



load_dotenv()


class ChatOpenRouter(ChatOpenAI):
    def __init__(self, model_name: str, openai_api_key: Optional[str] = None, **kwargs):
        openai_api_key = openai_api_key or os.getenv("OPENROUTER_API_KEY")
        super().__init__(
            model_name=model_name,
            openai_api_key=openai_api_key,
            base_url="https://openrouter.ai/api/v1",
            **kwargs,
        )


def initialize_query_chain():
    graph = Neo4jGraph(
        url=os.getenv("NEO4J_URI"),
        username=os.getenv("NEO4J_USERNAME"),
        password=os.getenv("NEO4J_PASSWORD"),
    )

    cypher_llm = ChatOpenRouter(temperature=0, model_name="anthropic/claude-3.7-sonnet")

    qa_llm = ChatOpenRouter(temperature=0.7, model_name="openai/gpt-4.1")

    chain = GraphCypherQAChain.from_llm(
        allow_dangerous_requests=True,
        cypher_llm=cypher_llm,
        qa_llm=qa_llm,
        graph=graph,
        verbose=False,
        prompt=cypher_chain_prompt,
        validate_cypher=True,
        return_intermediate_steps=True,
        top_k=10,
    )
    return chain


def combined_llm_response(user_context:str, question:str, lang:str):

    query_chain = initialize_query_chain()
    result = query_chain.invoke({"query": question})

    graph_context = result['result']

    combined_llm = ChatOpenRouter(
        temperature=0.5, model_name="anthropic/claude-3.7-sonnet"
    )
    custom_prompt.format(
        graph_context=graph_context, user_context=user_context, question=question, output_language=lang
    )

    chain = custom_prompt | combined_llm

    response = chain.invoke(
        {
            "output_language": lang,
            "question": f"{question}",
            "user_context": "",
            "graph_context": graph_context,
        }
    )
    return response.content
