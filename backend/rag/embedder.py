# rag/embedder.py

import os
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

# Step 1: Load & split documents
# loader = TextLoader("backend/rag/docs/about_adi.txt")
loader = TextLoader("backend/rag/docs/about_adi.txt")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
docs = splitter.split_documents(documents)

# Step 2: Gemini embeddings
embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))
print(embedding)
# Step 3: Store in Chroma
# persist_dir = "./chroma_db"
vectordb = Chroma.from_documents(
    documents=docs,
    embedding=embedding,
    persist_directory=os.path.join(os.path.dirname(__file__), "chroma_db"),
    # persist_directory=persist_dir,
    collection_name="adi-portfolio"
)

# vectordb.persist()
print(f"✅ Embedded {len(docs)} chunks using Gemini embeddings.")