from pydantic import BaseModel

class QueryRequest(BaseModel):
    """
    Represents a query request.

    This model is used to structure a request that includes a question
    and the language in which the question is posed.

    Attributes:
        question: The text of the question being asked.
        lang: The language code (e.g., "english", "german") for the question.
        userid: stored userid
    """
    question: str
    lang: str
    userid: str