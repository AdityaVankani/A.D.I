import os
import shutil
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

# 1️⃣ Copy from repo to /tmp (writeable path on Render)
def prepare_chroma():
    base_dir = os.path.dirname(__file__)  # /backend/rag
    source_dir = os.path.join(base_dir, "chroma_db")  # your existing chroma DB
    target_dir = "/tmp/chroma_db"

    if not os.path.exists(target_dir):
        shutil.copytree(source_dir, target_dir)
        print(f"✅ Copied Chroma DB to {target_dir}")
    else:
        print(f"🟡 Chroma DB already exists in {target_dir}")
    
    return target_dir

# 2️⃣ Use Gemini Embeddings
embedding = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# 3️⃣ Copy & Load DB from /tmp
chroma_path = prepare_chroma()

vectordb = Chroma(
    persist_directory=chroma_path,
    embedding_function=embedding,
    collection_name="adi-portfolio"
)

retriever = vectordb.as_retriever(search_kwargs={"k": 4})

# 4️⃣ Actual RAG Context Fetch
def get_context(query: str) -> str:
    print("📥 Query:", query)
    docs = retriever.invoke(query)
    return "\n".join([doc.page_content for doc in docs])