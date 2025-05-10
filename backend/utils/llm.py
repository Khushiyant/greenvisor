from utils.query import ChatOpenRouter
from langchain_experimental.graph_transformers import LLMGraphTransformer


class OpenRouterGraphTransformer(LLMGraphTransformer):
    def __init__(self, api_key: str, model: str = "openai/gpt-4.1", **kwargs):
        self.llm = ChatOpenRouter(
            api_key=api_key,
            model_name=model,
        )
        super().__init__(
            llm=self.llm,
            allowed_nodes=kwargs.get("allowed_nodes", None),
            allowed_relationships=kwargs.get("allowed_relationships", None)
        )
