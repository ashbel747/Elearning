import os
import logging
from typing import Optional, List, Dict
from dotenv import load_dotenv

from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.schema import Document

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CHROMA_DB_DIR = "./chroma_db"

def setup_retriever(k: int = 3, filters: Optional[Dict] = None):
    """
    Load the persisted ChromaDB vector store and return a retriever.

    Args:
        k (int): Number of documents to retrieve per query.
        filters (dict): Optional metadata filters for subject, difficulty, etc.

    Returns:
        retriever: LangChain retriever object
    """
    try:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

        vectordb = Chroma(
            persist_directory=CHROMA_DB_DIR,
            embedding_function=embeddings
        )

        search_kwargs = {"k": k}
        if filters:
            search_kwargs["filter"] = filters

        retriever = vectordb.as_retriever(search_kwargs=search_kwargs)

        logger.info(f"Retriever initialized with k={k}, filters={filters}")
        return retriever

    except Exception as e:
        logger.error(f"Error initializing retriever: {e}")
        raise


def test_retriever(query: str, k: int = 3, filters: Optional[Dict] = None) -> List[Document]:
    """
    Utility function to test retriever queries.

    Args:
        query (str): The search query.
        k (int): Number of docs to retrieve.
        filters (dict): Metadata filters.

    Returns:
        List[Document]: Retrieved documents.
    """
    retriever = setup_retriever(k=k, filters=filters)
    results = retriever.get_relevant_documents(query)

    logger.info(f"Query: {query}")
    logger.info(f"Retrieved {len(results)} documents")

    for idx, doc in enumerate(results, 1):
        logger.info(f"\nDoc {idx} [source: {doc.metadata.get('source', 'unknown')}]:\n{doc.page_content[:300]}...\n")

    return results


if __name__ == "__main__":
    test_query = "What are the main goals of the Gen AI module?"
    test_retriever(test_query, k=2)