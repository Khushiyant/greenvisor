import os
from langchain_core.documents import Document
from langchain_neo4j import Neo4jGraph
from dotenv import load_dotenv
import pickle
from utils.llm import OpenRouterGraphTransformer
import asyncio

import aiofiles
from tqdm.asyncio import tqdm as async_tqdm
from concurrent.futures import ThreadPoolExecutor


load_dotenv()

NEO4J_URI=os.getenv("NEO4J_URI")
NEO4J_USERNAME=os.getenv("NEO4J_USERNAME")
NEO4J_PASSWORD=os.getenv("NEO4J_PASSWORD")
DIFFBOT_API_KEY=os.getenv("DIFFBOT_API_KEY")
OPENROUTER_API_KEY=os.getenv("OPENROUTER_API_KEY")


ALLOWED_NODES = [
    "Program",  # For funding programs/products
    "Organization",  # For KfW, banks, institutions
    "Requirement",  # For eligibility criteria
    "Amount",  # For funding amounts, limits
    "Document",  # For required documents
    "Contact",  # For addresses, contact details
    "Process",  # For application processes
    "Benefit",  # For promotional benefits, grants
    "Target",  # For target groups, beneficiaries
    "Purpose",  # For funding purposes,
    "Value",  # For specific numerical values and amounts
]

ALLOWED_RELATIONSHIPS = [
    "REQUIRES",  # Program ->REQUIRES-> Document/Requirement
    "OFFERS",  # Organization ->OFFERS-> Program
    "HAS_VALUE",  # Amount ->HAS_VALUE-> Value
    "TARGETS",  # Program ->TARGETS-> Target
    "MANAGED_BY",  # Program ->MANAGED_BY-> Organization
    "APPLIES_TO",  # Requirement ->APPLIES_TO-> Target
    "FOLLOWS",  # Process ->FOLLOWS-> Process
    "SERVES",  # Program ->SERVES-> Purpose
    "LOCATED_AT",  # Organization ->LOCATED_AT-> Contact
    "GRANTS",  # Program ->GRANTS-> Amount
    "INCLUDES",  # Benefit ->INCLUDES-> Amount
]



NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


async def load_text_documents_async(folder_path):
    documents = []
    filenames = os.listdir(folder_path)

    async for filename in async_tqdm(filenames, desc="Loading documents", unit="file"):
        if filename.endswith(".txt"):
            async with aiofiles.open(
                os.path.join(folder_path, filename), "r", encoding="utf-8"
            ) as file:
                content = await file.read()
                source = "_".join(filename.split("_")[:-1])
                content = content.replace("\n", " ")
                documents.append(
                    Document(page_content=content, metadata={"source": source})
                )
    return documents


async def convert_docs_to_graph(graph_transformer, document):
    try:
        result = await asyncio.to_thread(
            graph_transformer.convert_to_graph_documents, [document]
        )
        if result and result[0].nodes:
            return result
        else:
            print(f"Warning: No nodes extracted from: {document.page_content[:100]}...")
            return []
    except Exception as e:
        print(f"Error processing document: {str(e)}")
        return []


async def process_and_store_documents_async(folder_path):
    documents = await load_text_documents_async(folder_path)

    graph_transformer = OpenRouterGraphTransformer(
        api_key=OPENROUTER_API_KEY,
        model="openai/gpt-4.1",
        allowed_nodes=ALLOWED_NODES,
        allowed_relationships=ALLOWED_RELATIONSHIPS,
    )

    # Convert documents concurrently
    tasks = [convert_docs_to_graph(graph_transformer, doc) for doc in documents]
    results = []
    async for result in async_tqdm(
        asyncio.as_completed(tasks), desc="Processing documents", total=len(tasks)
    ):
        results.append(await result)

    graph_documents = [item for sublist in results for item in sublist if sublist]

    if not graph_documents:
        raise ValueError("No valid graph documents were generated")

    pickle_file_path = os.path.join(folder_path, "graph_documents.pkl")
    async with aiofiles.open(pickle_file_path, "wb") as pickle_file:
        await asyncio.to_thread(pickle.dump, graph_documents, pickle_file)
    print(f"Graph documents saved to {pickle_file_path}")

    graph = Neo4jGraph(url=NEO4J_URI, username=NEO4J_USERNAME, password=NEO4J_PASSWORD)

    # Store documents in Neo4j using threads
    def store_to_neo4j(graph_doc):
        graph.add_graph_documents([graph_doc])

    with ThreadPoolExecutor() as executor:
        async_tqdm(
            asyncio.gather(
                *[asyncio.to_thread(store_to_neo4j, doc) for doc in graph_documents]
            ),
            desc="Storing in Neo4j",
            unit="document",
        )