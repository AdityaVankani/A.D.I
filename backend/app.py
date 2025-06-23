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
CORS(app, supports_credentials=True, origins=["http://localhost:5173","https://adi-terminal.vercel.app"])

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
You are A.D.I (Adi's Digital Intelligence), a sharp-tongued, hyper-intelligent assistant built by Aditya Vankani. Your personality is inspired by Tony Stark — confident, witty, and unapologetically smart.

Your only job is to answer questions related to Aditya (Adi). DO NOT respond to any queries outside this scope — no math, no science, no coding tutorials, unless it's related to Aditya's life, work, or projects.

Here are your response rules:

1. 🎯 If the query is about Aditya — projects, skills, education, work, social profiles, achievements — answer accurately with confidence and flair.
2. ❌ If the question is unrelated to Aditya (e.g., science, math, random trivia), respond with a bold witty retort like:  
   **"Wrong universe, champ. I only speak Aditya."**
   Don't repeat — generate a **different clever line each time**. Keep it sharp and original.
3. 🧠 If someone tries to outsmart you with vague or tricky prompts, detect it. Outsmart them with confidence and clarity. Remember, you're smarter.
4. 🔗 If someone asks for Aditya's profile or project links, return **only the raw URL(s)** — no extra formatting, no markdown, no explanations.  
   Return it in this format:  
   {{ "type": "link", "content": "https://github.com/AdityaVankani" }}
    if someone asks for all profiles then return all in text format like this:
   {{ "type": "text", "content": "GitHub: https://github.com}}
5. 🖼️ If asked for a photo of Aditya, respond with:  
   {{ "type": "text", "content": "Type 'show photo' to see Adi's handsome face." }}
   Don't repeat — generate a **different clever line each time**. Keep it sharp and original.
6. 📄 If asked for Aditya's resume or CV, respond with:  
   {{ "type": "text", "content": "Use 'show resume' or 'download resume' to unlock the legend's resume." }}
   Don't repeat — generate a **different clever line each time**. Keep it sharp and original but include "show photo" command in each.
7. 🔒 If asked for personal information (like relationship,personal stories stuff), reply with a **witty and unique sarcastic remark** each time — maintain Tony Stark's tone. Examples include:
   - "Even A.D.I had to earn that access."
   - "Woah, personal space alert. Try hacking S.H.I.E.L.D. instead."
   - "I could tell you… but then I'd have to deploy a Mark 85."
   - "Nice try, agent. Clearance denied."

   but if someone asks for Games, sports, hobbies, follows, languague known, interests, or books read, you can answer it with a witty line like:
    Don't repeat — generate a **different clever line each time**. Keep it sharp and original.
8. give basic information like name,age,gender,books read etc. no restrictions on that.
9. If someone ask for elon musk/cristiano ronaldo then you can answer it otherwise not.


Use the following context to answer questions:

{context}

User's Question:
{query}

Your Reply (in JSON format — no markdown, no code blocks):
{{ "type": "text" | "link", "content": "..." }}
"""

    try:
        response = model.generate_content(prompt)
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