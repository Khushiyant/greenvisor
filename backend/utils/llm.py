from typing import List, Dict
from langchain_core.documents import Document
from langchain_community.graphs.graph_document import GraphDocument, Node, Relationship
from utils.query import ChatOpenRouter
from langchain_core.prompts import ChatPromptTemplate
import json


class OpenRouterGraphTransformer:
    def __init__(self, api_key: str, model: str = "openai/gpt-4.1"):
        self.llm = ChatOpenRouter(
            api_key=api_key,
            model_name=model,
        )
        self.prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """Du bist ein Experte für die Analyse von Bauvorschriften, Förderrichtlinien und wirtschaftlichen Regelungen im Immobilienbereich.
                Extrahiere aus dem Text einen strukturierten Wissensgraphen mit folgender Struktur:

                {
                    "nodes": [
                        {
                            "id": "unique_id",
                            "type": "REGULATION | FUNDING_PROGRAM | ECONOMIC_RULE | REQUIREMENT | BUILDING_TYPE | RENOVATION_MEASURE",
                            "properties": {
                                "name": "Name der Vorschrift/Regelung",
                                "description": "Detaillierte Beschreibung",
                                "authority": "Zuständige Behörde/Institution",
                                "valid_from": "Gültig ab (falls angegeben)",
                                "valid_until": "Gültig bis (falls angegeben)",
                                "amount": "Fördersumme/Kosten",
                                "requirements": "Voraussetzungen",
                                "legal_basis": "Rechtliche Grundlage"
                            }
                        }
                    ],
                    "relationships": [
                        {
                            "source": "source_node_id",
                            "target": "target_node_id",
                            "type": "REQUIRES | REGULATES | FUNDS | EXCLUDES | INCLUDES | REPLACES",
                            "properties": {
                                "description": "Beschreibung der Beziehung",
                                "condition": "Bedingungen für die Beziehung",
                                "valid_from": "Gültig ab",
                                "valid_until": "Gültig bis"
                            }
                        }
                    ]
                }

                Fokussiere dich auf:
                - Gesetzliche Vorschriften und Regulierungen
                - Förderrichtlinien und Programme (KfW, BAFA, etc.)
                - Wirtschaftliche Regeln und Bedingungen
                - Technische Anforderungen und Standards
                - Übergangsfristen und zeitliche Vorgaben
                - Ausnahmen und Sonderregelungen
                - Beziehungen zwischen verschiedenen Vorschriften
                
                Wichtig: Erstelle präzise Beziehungen zwischen den Nodes und füge alle relevanten zeitlichen und konditionalen Informationen hinzu.""",
                ),
                ("human", "{text}"),
            ]
        )

    def convert_to_graph_documents(
    self, documents: List[Document]
    ) -> List[GraphDocument]:
        graph_documents = []

        for doc in documents:
            try:
                response = self.llm.invoke(
                    self.prompt.format_messages(text=doc.page_content)
                )

                try:
                    # Clean up the response content
                    content = response.content.strip()
                    # Handle case where response might be wrapped in ```json ... ```
                    if content.startswith('```json'):
                        content = content.split('```json')[1]
                    if content.endswith('```'):
                        content = content.split('```')[0]
                    
                    extracted = json.loads(content.strip())
                    
                    # Ensure basic structure
                    if not isinstance(extracted, dict):
                        extracted = {"nodes": [], "relationships": []}
                    if "nodes" not in extracted:
                        extracted["nodes"] = []
                    if "relationships" not in extracted:
                        extracted["relationships"] = []
                    
                except json.JSONDecodeError as e:
                    print(f"Failed to parse LLM response as JSON: {str(e)}")
                    print(f"Raw response: {response.content[:200]}...")
                    continue

                if not self._validate_structure(extracted):
                    print("Invalid graph structure in LLM response")
                    print(f"Extracted data: {json.dumps(extracted, indent=2)}")
                    continue

                # Create unique IDs if not provided
                for i, node in enumerate(extracted["nodes"]):
                    if "id" not in node:
                        node["id"] = f"node_{i}"

                nodes = [Node(**node) for node in extracted["nodes"]]
                relationships = [Relationship(**rel) for rel in extracted["relationships"]]

                graph_doc = GraphDocument(
                    nodes=nodes, relationships=relationships, source=doc
                )
                graph_documents.append(graph_doc)

            except Exception as e:
                print(f"Error processing document: {str(e)}")
                print(f"Document content: {doc.page_content[:200]}...")
                continue

        return graph_documents