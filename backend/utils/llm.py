from utils.query import ChatOpenRouter
from langchain_experimental.graph_transformers import LLMGraphTransformer


class OpenRouterGraphTransformer(LLMGraphTransformer):
    """
    A graph transformer that uses an LLM model from OpenRouter to convert
    text documents into graph structures.

    This class extends `LLMGraphTransformer` and configures it to use a
    specified OpenRouter model for processing. It allows for the transformation
    of unstructured text data into a structured graph format, consisting of
    nodes and relationships, as defined by the underlying LLM's interpretation
    of the text.

    Attributes:
        llm (ChatOpenRouter): An instance of the ChatOpenRouter class,
                              configured with the provided API key and model.
    """
    def __init__(self, api_key: str, model: str = "openai/gpt-4.1", **kwargs):
        """
        Initializes the OpenRouterGraphTransformer.

        Args:
            api_key (str): The API key for accessing OpenRouter services.
            model (str, optional): The specific model name to be used from
                                   OpenRouter. Defaults to "openai/gpt-4.1".
            **kwargs: Additional keyword arguments that are passed to the
                      `LLMGraphTransformer` parent class. These can include:
                        - allowed_nodes (List[str], optional): A list of node types
                          that the transformer is allowed to create. If None, all
                          inferred node types are allowed.
                        - allowed_relationships (List[str], optional): A list of
                          relationship types that the transformer is allowed to
                          create. If None, all inferred relationship types are
                          allowed.
        """
        self.llm = ChatOpenRouter(
            api_key=api_key,
            model_name=model,
        )
        super().__init__(
            llm=self.llm,
            allowed_nodes=kwargs.get("allowed_nodes", None),
            allowed_relationships=kwargs.get("allowed_relationships", None)
        )