from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from rag.retriever import get_context

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
CORS(app, origins=["https://adi-terminal.vercel.app", "http://localhost:5173"], supports_credentials=True)
@app.route("/")
def home():
    return "Adi's Bot Backend is up and running 🚀"


# @app.route("/api/ask", methods=["OPTIONS"])
# def options_handler():
#     return '', 204

@app.route("/assets/<path:filename>")
def get_file(filename):
    return send_from_directory("assets", filename)

@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.get_json()
    query = data.get("query", "").strip().lower()
    base_url = request.host_url.rstrip("/")
    # Custom commands
    if query in ["show resume", "download resume"]:
        print("✅ Serving resume: /assets/resume.pdf")
        return jsonify({ "type": "pdf", "content": f"{base_url}assets/resume.pdf" })
    if query == "show photo":
        print("✅ Serving photo: /assets/adi_pic.jpg")
        return jsonify({ "type": "image", "content": f"{base_url}assets/adi_pic.jpg" })

    # RAG prompt
    context = get_context(query)
    # print("context: "+context)
    prompt = f"""
hello
"""

    try:
        response = model.generate_content(prompt)
        # response="hello"
        raw = response.text.strip()

        # 🔥 Strip code block formatting (```json\n...\n```)
        if raw.startswith("```json") and raw.endswith("```"):
            raw = raw[7:-3].strip()
        elif raw.startswith("```") and raw.endswith("```"):
            raw = raw[3:-3].strip()

        # 🔍 Try to parse as JSON
        try:
            output = json.loads(raw)
            if not (isinstance(output, dict) and "type" in output and "content" in output):
                output = { "type": "text", "content": raw }
        except:
            output = { "type": "text", "content": raw }

        return jsonify(output)

    except Exception as e:
        return jsonify({ "type": "text", "content": f"❌ Error: {str(e)}" })

if __name__ == "__main__":
    app.run(debug=True,port=5050)