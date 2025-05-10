import os
from langchain_core.documents import Document
from langchain_neo4j import Neo4jGraph
from dotenv import load_dotenv
from tqdm import tqdm
import pickle
from utils.llm import OpenRouterGraphTransformer

load_dotenv()

NEO4J_URI=os.getenv("NEO4J_URI")
NEO4J_USERNAME=os.getenv("NEO4J_USERNAME")
NEO4J_PASSWORD=os.getenv("NEO4J_PASSWORD")
DIFFBOT_API_KEY=os.getenv("DIFFBOT_API_KEY")
OPENROUTER_API_KEY=os.getenv("OPENROUTER_API_KEY")

def load_text_documents(folder_path):
    documents = []
    for filename in tqdm(os.listdir(folder_path), desc="Loading documents", unit="file"):
        if filename.endswith(".txt"):
            with open(os.path.join(folder_path, filename), 'r', encoding='utf-8') as file:
                content = file.read()
                source = filename.split("_")[0]
                content = content.replace("\n", " ")
                documents.append(Document(page_content=content, metadata={"source": source}))
    return documents

def process_and_store_documents(folder_path):
    documents = load_text_documents(folder_path)
    # diffbot_api_key = DIFFBOT_API_KEY
    graph_transformer = OpenRouterGraphTransformer(
        api_key=OPENROUTER_API_KEY,
        model="openai/gpt-4.1"  # You can change this to other models
    )
    graph_documents = []
    for doc in tqdm(documents, desc="Processing documents"):
        try:
            result = graph_transformer.convert_to_graph_documents([doc])
            if result and result[0].nodes:  # Only add if nodes were extracted
                graph_documents.extend(result)
            else:
                print(f"Warning: No nodes extracted from document: {doc.page_content[:100]}...")
        except Exception as e:
            print(f"Error processing document: {str(e)}")

    if not graph_documents:
        raise ValueError("No valid graph documents were generated")

    pickle_file_path = os.path.join(folder_path, "graph_documents.pkl")
    with open(pickle_file_path, 'wb') as pickle_file:
        pickle.dump(graph_documents, pickle_file)
    print(f"Graph documents saved to {pickle_file_path}")

    graph = Neo4jGraph(
        url=NEO4J_URI,
        username=NEO4J_USERNAME,
        password=NEO4J_PASSWORD
    )

    for graph_doc in tqdm(graph_documents, desc="Storing documents in Neo4j", unit="document"):
        graph.add_graph_documents([graph_doc])
