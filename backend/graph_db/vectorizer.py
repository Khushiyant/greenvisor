import os
from langchain_core.documents import Document
from langchain_experimental.graph_transformers.diffbot import DiffbotGraphTransformer
from langchain_neo4j import Neo4jGraph
from dotenv import load_dotenv
from tqdm import tqdm
import pickle

load_dotenv()

def load_text_documents(folder_path):
    documents = []
    for filename in tqdm(os.listdir(folder_path), desc="Loading documents", unit="file"):
        if filename.endswith(".txt"):
            with open(os.path.join(folder_path, filename), 'r', encoding='utf-8') as file:
                content = file.read()
                documents.append(Document(page_content=content))
    return documents

def process_and_store_documents(folder_path):
    documents = load_text_documents(folder_path)
    diffbot_api_key = os.getenv("DIFFBOT_API_KEY", "eb7eee1e23c26a2c9f90d847b0427626")
    diffbot_transformer = DiffbotGraphTransformer(diffbot_api_key=diffbot_api_key)
    graph_documents = diffbot_transformer.convert_to_graph_documents(documents)

    pickle_file_path = os.path.join(folder_path, "graph_documents.pkl")
    with open(pickle_file_path, 'wb') as pickle_file:
        pickle.dump(graph_documents, pickle_file)
    print(f"Graph documents saved to {pickle_file_path}")

    graph = Neo4jGraph(
        url=os.getenv("NEO4J_URI", "neo4j+s://db017d2d.databases.neo4j.io"),
        username=os.getenv("NEO4J_USERNAME", "neo4j"),
        password=os.getenv("NEO4J_PASSWORD", "JzOh86O7v08zwHAfWgzqDv514rULLAuvJZnVLzMTa-E")
    )

    for graph_doc in tqdm(graph_documents, desc="Storing documents in Neo4j", unit="document"):
        graph.add_graph_documents([graph_doc])
