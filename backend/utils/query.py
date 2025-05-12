import os
from typing import Optional

from dotenv import load_dotenv

from langchain_neo4j import GraphCypherQAChain, Neo4jGraph
from langchain_openai import ChatOpenAI

from .prompt import custom_prompt, cypher_chain_prompt

from appwrite.client import Client
from appwrite.services.databases import Databases


load_dotenv()

client = Client()

client.set_endpoint("https://cloud.appwrite.io/v1")
client.set_project("greenvisor")
client.set_key(os.getenv("APPWRITE_API_KEY"))


class ChatOpenRouter(ChatOpenAI):
    """
    A wrapper around Langchain's ChatOpenAI to use models from OpenRouter.ai.

    This class configures the ChatOpenAI client to interact with the
    OpenRouter API endpoint, allowing the use of various language models
    hosted on their platform.
    """
    def __init__(self, model_name: str, openai_api_key: Optional[str] = None, **kwargs):
        """
        Initializes the ChatOpenRouter client.

        Args:
            model_name: The name of the model to use from OpenRouter.ai
                        (e.g., "anthropic/claude-3.7-sonnet").
            openai_api_key: The API key for OpenRouter.ai. If not provided,
                            it defaults to the value of the
                            "OPENROUTER_API_KEY" environment variable.
            **kwargs: Additional keyword arguments to pass to the
                      ChatOpenAI constructor.
        """
        openai_api_key = openai_api_key or os.getenv("OPENROUTER_API_KEY")
        super().__init__(
            model_name=model_name,
            openai_api_key=openai_api_key,
            base_url="https://openrouter.ai/api/v1",
            **kwargs,
        )


def initialize_query_chain():
    """
    Initializes and returns a GraphCypherQAChain for querying a Neo4j database.

    This function sets up a connection to a Neo4j graph database using credentials
    from environment variables. It then configures a GraphCypherQAChain
    with two language models (one for Cypher generation and one for question answering)
    sourced from OpenRouter.ai.

    The chain is configured to:
    - Allow potentially dangerous requests (e.g., schema introspection).
    - Use a specific LLM for Cypher query generation (`cypher_llm`).
    - Use another LLM for generating the final answer based on graph results (`qa_llm`).
    - Connect to the specified Neo4j graph.
    - Use a custom prompt (`cypher_chain_prompt`) for Cypher generation.
    - Validate generated Cypher queries.
    - Return intermediate steps (e.g., the generated Cypher query and graph results).
    - Retrieve the top K results from the graph.

    Environment variables used:
    - NEO4J_URI: The URI for the Neo4j database.
    - NEO4J_USERNAME: The username for Neo4j authentication.
    - NEO4J_PASSWORD: The password for Neo4j authentication.
    - OPENROUTER_API_KEY: The API key for OpenRouter.ai (used by ChatOpenRouter).

    Returns:
        GraphCypherQAChain: A configured instance of the GraphCypherQAChain.
    """
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

def _get_user_context(userid:str):
    databases = Databases(client)
    response:dict = databases.get_document(
        database_id="greenvisordb",
        collection_id="users",
        document_id=userid
    )

    for i in [
        "$permissions",
        "$createdAt",
        "$updatedAt",
        "$collectionId",
        "$databaseId",
        "$id",
        "latitude",
        "longitude",
    ]:
        response.pop(i)


    return response



def combined_llm_response(question:str, lang:str, userid:str):
    """
    Generates a response by first querying a Neo4j graph and then using that
    context along with user-provided context to answer a question via an LLM.

    This function orchestrates a two-step process:
    1.  It initializes a `GraphCypherQAChain` using `initialize_query_chain()`
        and invokes it with the user's `question` to retrieve relevant
        information (`graph_context`) from a Neo4j database.
    2.  It then initializes another LLM (`combined_llm`) and uses a custom prompt
        (`custom_prompt`) formatted with the `graph_context`, `user_context`,
        `question`, and desired output `lang`. This combined information is
        used to generate the final answer.

    Args:
        user_context: Additional context provided by the user.
        question: The user's question to be answered.
        lang: The desired language for the output response (e.g., "en", "de").

    Returns:
        str: The content of the language model's response.
    """

    query_chain = initialize_query_chain()
    result = query_chain.invoke({"query": question})

    user_context = str(_get_user_context(userid=userid))

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
            "user_context": user_context,
            "graph_context": graph_context,
        }
    )
    return response.content