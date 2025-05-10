from langchain_neo4j import Neo4jGraph
from dotenv import load_dotenv
import os
from .app import router

load_dotenv()


url = os.getenv("NEO4J_URI")
username = os.getenv("NEO4J_USERNAME")
password = os.getenv("NEO4J_PASSWORD")

graph = Neo4jGraph(url=url, username=username, password=password)

__all__ = ["graph", "router"]