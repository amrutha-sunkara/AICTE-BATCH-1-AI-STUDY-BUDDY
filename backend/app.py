from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
app = Flask(__name__)
CORS(app)
# -------------------- API KEY --------------------
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")
# -------------------- FALLBACK ENGINE --------------------
def fallback(text, mode):
    if mode == "explain":
        return f"""
⚠️ AI LIMIT REACHED

📖 Definition:
{text} is an important Computer Science concept.

🔑 Key Points:
• Used in academics
• Important for exams
• Helps in understanding systems

💡 Example:
Basic real-world usage of {text}.
"""

    if mode == "quiz":
        return f"""
⚠️ AI LIMIT REACHED

1. What is {text}?
A) Option A
B) Option B
C) Option C
D) Option D
Answer: A

2. {text} is used in?
A) Systems
B) Networks
C) Databases
D) All of the above
Answer: D
"""

    if mode == "flashcards":
        return f"""
⚠️ AI LIMIT REACHED

Q: What is {text}?
A: It is a key CS concept.

Q: Why important?
A: Used in exams and interviews.
"""

    if mode == "doubt":
        return f"""
⚠️ AI LIMIT REACHED

{text} is explained in simple terms:

• Easy concept explanation
• Real-life usage
• Student-friendly answer
"""


# -------------------- SAFE AI CALL --------------------
def safe_generate(prompt):
    try:
        return model.generate_content(prompt).text, None
    except Exception as e:
        return None, str(e)


# -------------------- EXPLAIN --------------------
@app.route("/explain", methods=["POST"])
def explain():
    data = request.json
    topic = data.get("topic", "")
    answer_type = data.get("answerType", "2")

    prompt = f"""
Explain "{topic}" for a B.Tech student.

Generate a {answer_type}-mark answer.

Rules:
- Simple language
- Structured format
"""

    result, error = safe_generate(prompt)

    if error:
        if "429" in error:
            output = fallback(topic, "explain")
        else:
            output = f"ERROR: {error}"
    else:
        output = result
    return jsonify({"result": output})
# -------------------- QUIZ --------------------
@app.route("/quiz", methods=["POST"])
def quiz():
    data = request.json
    topic = data.get("topic", "")

    prompt = f"""
Generate a quiz on {topic}.
- 5 MCQs
- 4 options each
- Include answers
"""

    result, error = safe_generate(prompt)

    if error:
        if "429" in error:
            output = fallback(topic, "quiz")
        else:
            output = f"ERROR: {error}"
    else:
        output = result
    return jsonify({"result": output})
# -------------------- FLASHCARDS --------------------
@app.route("/flashcards", methods=["POST"])
def flashcards():
    data = request.json
    topic = data.get("topic", "")

    prompt = f"""
Generate 5 flashcards on {topic}.
Format: Q & A
"""

    result, error = safe_generate(prompt)

    if error:
        if "429" in error:
            output = fallback(topic, "flashcards")
        else:
            output = f"ERROR: {error}"
    else:
        output = result
    return jsonify({"result": output})
# -------------------- DOUBT --------------------
@app.route("/doubt", methods=["POST"])
def doubt():
    data = request.json
    doubt_text = data.get("doubt", "")

    prompt = f"""
Explain this doubt simply:
{doubt_text}
"""

    result, error = safe_generate(prompt)

    if error:
        if "429" in error:
            output = fallback(doubt_text, "doubt")
        else:
            output = f"ERROR: {error}"
    else:
        output = result
    return jsonify({"result": output})

@app.route("/studyplan", methods=["POST"])
def studyplan():
    try:
        data = request.json
        topic = data.get("topic", "")

        prompt = f"""
Create a study plan for {topic}.

Rules:
- Divide into Day 1 to Day 7
- Simple language
- Beginner friendly
- Mention daily tasks
- Mention revision day
"""

        response = model.generate_content(prompt)
        return jsonify({
            "result": response.text
        })

    except Exception as e:
        error_msg = str(e)

        if "429" in error_msg:
            return jsonify({
                "result": f"""
⚠️ AI limit reached.

📅 Sample Study Plan for {topic}

Day 1:
Learn basics

Day 2:
Important concepts

Day 3:
Examples

Day 4:
Practice questions

Day 5:
Advanced topics

Day 6:
Mock test

Day 7:
Revision
"""
            })

        return jsonify({
            "result": f"ERROR: {error_msg}"
        })
@app.route("/notes", methods=["POST"])
def notes():
    try:
        data = request.json
        topic = data.get("topic", "")

        prompt = f"""
Generate study notes on {topic}.

Format:

📖 Definition

🔑 Key Points

✅ Advantages

🌍 Applications

📝 Quick Revision

Keep it concise and easy to learn.
"""
        response = model.generate_content(prompt)
        return jsonify({
            "result": response.text
        })

    except Exception as e:
        error_msg = str(e)

        if "429" in error_msg:
            return jsonify({
                "result": f"""
⚠️ AI limit reached.

📖 Notes on {topic}

Definition:
{topic} is an important concept.

🔑 Key Points:
• Frequently asked in exams
• Important for understanding fundamentals
• Useful in practical applications

✅ Advantages:
• Better understanding
• Easy revision

🌍 Applications:
• Academics
• Industry

📝 Quick Revision:
Remember the definition and key concepts.
"""
            })

        return jsonify({
            "result": f"ERROR: {error_msg}"
        })
# -------------------- RUN --------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)