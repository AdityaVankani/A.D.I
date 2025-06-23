# rag/retriever.py

import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))

vectordb = Chroma(
    persist_directory=os.path.join(os.path.dirname(__file__), "chroma_db"),
    embedding_function=embedding,
    collection_name="adi-portfolio"
)

retriever = vectordb.as_retriever(search_kwargs={"k": 4})

def get_context(query: str) -> str:
    docs = retriever.invoke(query)
    print(f"🔍 Retrieved {len(docs)} docs for query: {query}")
    for i, doc in enumerate(docs):
        print(f"\n--- Doc {i+1} ---\n{doc.page_content}")
    return "\n".join([doc.page_content for doc in docs])