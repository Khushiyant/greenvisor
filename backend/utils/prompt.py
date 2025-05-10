from langchain.prompts import PromptTemplate

custom_prompt = PromptTemplate(
    input_variables=["user_context", "graph_context", "question"],
    template="""
You are an intelligent assistant.

User Context:
{user_context}

Graph Context:
{graph_context}

Based on the above contexts, answer the following question:
{question}
""",
)
