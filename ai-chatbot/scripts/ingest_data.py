import os
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

def ingest_data_to_vector_store():
    """
    Ingests educational content from a structured knowledge base into ChromaDB.
    """
    print("Ingesting data from the knowledge base into ChromaDB...")
    
    data_dir = "knowledge"
    documents = []

    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    raw_text = f.read()
                
                metadata = {
                    "source": file_path,
                    "subject": root.split(os.sep)[-2] if 'content' in root else root.split(os.sep)[-1],
                    "type": os.path.splitext(file)[0].split('_')[0]
                }
                documents.append(Document(page_content=raw_text, metadata=metadata))

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    docs = text_splitter.split_documents(documents)
    
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    db = Chroma.from_documents(
        documents=docs, 
        embedding=embeddings, 
        persist_directory="./chroma_db"
    )
    
    print(f"Ingestion complete. {len(docs)} document chunks added to the vector store.")

if __name__ == "__main__":
    ingest_data_to_vector_store()