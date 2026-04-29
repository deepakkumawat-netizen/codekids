"""
CodeKids Backend - AI-Powered Code Editor for K-12 Students
FastAPI + OpenAI + Local Python Execution
"""

import os
import socket
from dotenv import load_dotenv

# Load environment variables FIRST before importing NLP engine
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
from pathlib import Path
from compilers import execute_code_local, verify_bundled_compilers
from database import db
from nlp_engine import nlp_engine

app = FastAPI(title="CodeKids API", version="1.0.0")

PORT = int(os.getenv("PORT", 7000))

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═════════════════════════════════════════════════════════════════════════════
# REQUEST MODELS
# ═════════════════════════════════════════════════════════════════════════════

class RunCodeRequest(BaseModel):
    code: str
    language: str

class ExplainRequest(BaseModel):
    code: str
    language: str
    grade_level: str
    question: Optional[str] = ""
    history: list = []

class DebugRequest(BaseModel):
    code: str
    language: str
    grade_level: str
    error: Optional[str] = ""
    history: list = []

class HintRequest(BaseModel):
    code: str
    language: str
    grade_level: str
    question: str

class PracticeRequest(BaseModel):
    language: str
    grade_level: str
    difficulty: str = "medium"

class SaveChatRequest(BaseModel):
    user_id: str
    tool_name: str
    code: str
    response: str
    language: str = ""

class ChatHistoryRequest(BaseModel):
    user_id: str
    tool_name: str = ""

class UsageCheckRequest(BaseModel):
    user_id: str
    tool_name: str

class UsageIncrementRequest(BaseModel):
    user_id: str
    tool_name: str

# ═════════════════════════════════════════════════════════════════════════════
# UTILITY FUNCTIONS
# ═════════════════════════════════════════════════════════════════════════════

def get_grade_tone(grade_level: str) -> str:
    """Get teaching tone based on grade level"""
    grade_num = int(''.join(filter(str.isdigit, grade_level)) or 6)
    
    if grade_num <= 3:
        return "Use VERY SIMPLE words. Explain like a 7-year-old. Use analogies."
    elif grade_num <= 6:
        return "Use clear, friendly language. Explain with simple examples."
    elif grade_num <= 9:
        return "Use technical language. Include programming concepts."
    else:
        return "Use academic language. Assume programming knowledge."


def execute_code(code: str, language: str) -> dict:
    """Execute code using bundled local compilers - completely offline, no Piston API"""
    return execute_code_local(code, language)

def call_ai(user_prompt: str, history: list = None, system: str = None) -> str:
    """Call OpenAI with optional system prompt and conversation history"""
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    if history:
        messages.extend(history[-6:])  # keep last 3 exchanges to avoid token overflow
    messages.append({"role": "user", "content": user_prompt})
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=2000,
            temperature=0.7,
        )
        return response.choices[0].message.content or ""
    except Exception as e:
        return f"AI error: {str(e)}"

# ═════════════════════════════════════════════════════════════════════════════
# ROUTES
# ═════════════════════════════════════════════════════════════════════════════

@app.on_event("startup")
async def startup_event():
    """Verify compilers on startup"""
    compiler_status = verify_bundled_compilers()
    available = {k: v for k, v in compiler_status.items() if v != "not found"}
    missing = {k: v for k, v in compiler_status.items() if v == "not found"}

    print(f"\n{'='*60}")
    print(f"CodeKids Backend")
    print(f"{'='*60}")
    print(f"[OK] Available: {', '.join(available.keys())}")
    if missing:
        print(f"[!] Missing: {', '.join(missing.keys())}")
    print(f"{'='*60}\n")

@app.get("/api/health")
async def health():
    compiler_status = verify_bundled_compilers()
    return {
        "status": "ok",
        "available_compilers": len(compiler_status["available"]),
        "missing_compilers": len(compiler_status["missing"])
    }

@app.post("/api/run")
async def run_code(request: RunCodeRequest):
    """Execute code - if compiler unavailable, offer AI help instead"""
    result = execute_code(request.code, request.language)

    # If compiler not available, suggest AI tools
    if "not yet bundled" in result.get("stderr", "").lower():
        return {
            "stdout": "",
            "stderr": f"💡 Compiler for {request.language} not available.\n\nUse AI Tools instead:\n• Explain: Understand the code\n• Debug: Get help fixing errors\n• Hint: Learn concepts\n• Practice: Get problems to solve",
            "exit_code": 1
        }

    return result

def parse_explain_response(response: str) -> dict:
    """Return full AI response preserving all content"""
    # Just return the raw response with explanation field
    # This preserves all formatting and content from the AI
    return {
        "explanation": response,
        "message": response
    }

@app.post("/api/ai/explain-code")
async def explain_code_ai(request: dict):
    """AI Explains code - FULLY AI BASED"""
    code = request.get("code", "")
    language = request.get("language", "Python")
    grade_level = request.get("grade_level", "6")

    # AI endpoint disabled - use /api/execute for basic code execution
    return {
        "explanation": "AI explanation feature is not configured. Please use the code execution feature instead.",
        "status": "disabled"
    }

@app.post("/api/explain")
async def explain_code(request: ExplainRequest):
    """Explain code like a teacher with detailed, grade-appropriate explanations"""
    tone = get_grade_tone(request.grade_level)
    system = f"You are an expert, encouraging teacher explaining {request.language} code to Grade {request.grade_level} students. {tone} Remember what the student asked before and build on it."
    user_prompt = f"""Explain this {request.language} code:
```{request.language}
{request.code}
```

Provide a DETAILED, EDUCATIONAL explanation:
1. WHAT DOES IT DO? — Simple sentence first, then expand
2. HOW DOES IT WORK? — Step-by-step breakdown of each line
3. WHY IS THIS IMPORTANT? — Real-world applications
4. KEY CONCEPTS — Programming concepts used
5. COMMON MISTAKES — What students often misunderstand
6. PRACTICE TIP — How to remember or practice this
7. RELATED TOPICS — What to learn next

Use analogies and real-world examples. Be engaging and clear."""

    response = call_ai(user_prompt, history=request.history, system=system)
    explanation = parse_explain_response(response)
    return explanation

def parse_debug_response(response: str) -> dict:
    """Parse plain text debug response into structured format"""
    import re

    result = {
        "problem_identified": "",
        "guiding_questions": [],
        "hint": "",
        "next_step": ""
    }

    lines = response.split('\n')

    # Extract problem
    for i, line in enumerate(lines):
        if 'problem' in line.lower() or 'issue' in line.lower():
            if i + 1 < len(lines):
                result["problem_identified"] = lines[i + 1].strip()
                break

    # Extract questions (look for numbered items or question marks)
    for line in lines:
        if '?' in line and len(result["guiding_questions"]) < 3:
            clean = re.sub(r'^[\d\.\-\s]+', '', line.strip())
            if clean and len(clean) > 5:
                result["guiding_questions"].append(clean)

    # Extract hint
    for i, line in enumerate(lines):
        if 'hint' in line.lower() and i + 1 < len(lines):
            result["hint"] = lines[i + 1].strip()
            break

    # Extract next step
    for i, line in enumerate(lines):
        if 'next' in line.lower() or 'try' in line.lower():
            if i + 1 < len(lines):
                result["next_step"] = lines[i + 1].strip()
                break

    # Fallback: use first line as problem if nothing extracted
    if not result["problem_identified"] and lines:
        result["problem_identified"] = lines[0].strip()[:200]

    return result

@app.post("/api/ai/debug-code")
async def debug_code_ai(request: dict):
    """AI Debugs code - FULLY AI BASED"""
    code = request.get("code", "")
    language = request.get("language", "Python")
    grade_level = request.get("grade_level", "6")
    error = request.get("error", "")

    result = {"error": "Feature disabled", "status": "disabled"}
    return result

@app.post("/api/debug")
async def debug_code(request: DebugRequest):
    """Debug code - show error location and guide student to fix it themselves"""
    tone = get_grade_tone(request.grade_level)
    code_with_lines = '\n'.join([f"{i+1}: {line}" for i, line in enumerate(request.code.split('\n'))])

    system = f"You are a patient debugging tutor for Grade {request.grade_level} students learning {request.language}. {tone} Never give the complete fixed code — guide students to find the fix themselves. Remember prior context from this session."
    user_prompt = f"""Help debug this {request.language} code. DO NOT give the complete solution.

Code with line numbers:
```{request.language}
{code_with_lines}
```
Error: {request.error or 'Code not working as expected'}

Guide the student using:
1. ERROR LOCATION — Which line has the problem and why
2. WHY IS THIS AN ERROR? — What went wrong
3. GUIDING QUESTIONS — 2-3 questions to help them think through the fix
4. HINTS — Small clues without giving the answer
5. WHAT TO TRY — Steps to fix it themselves
6. LEARNING POINT — What concept to review"""

    response = call_ai(user_prompt, history=request.history, system=system)
    debug_response = parse_debug_response(response)
    return debug_response

def parse_hint_response(response: str) -> dict:
    """Parse plain text hint response into structured format"""
    import re

    result = {
        "concept_to_review": "",
        "hints": [],
        "resource": "",
        "encouragement": ""
    }

    lines = response.split('\n')

    # Extract concept
    for i, line in enumerate(lines):
        if 'concept' in line.lower() or 'review' in line.lower():
            if i + 1 < len(lines):
                result["concept_to_review"] = lines[i + 1].strip()
                break

    # Extract hints (numbered or bulleted lines)
    for line in lines:
        if (re.match(r'^[\d\.\-\s]+', line) or line.strip().startswith('-')) and len(result["hints"]) < 3:
            clean = re.sub(r'^[\d\.\-\s]+', '', line.strip())
            if clean and len(clean) > 3:
                result["hints"].append(clean)

    # Extract resource/learning reference
    for i, line in enumerate(lines):
        if 'learn' in line.lower() or 'resource' in line.lower() or 'read' in line.lower():
            if i + 1 < len(lines):
                result["resource"] = lines[i + 1].strip()
                break

    # Extract encouragement (look for positive words)
    for line in lines:
        if any(word in line.lower() for word in ['great', 'well', 'excellent', 'good', 'can do', 'keep', 'awesome']):
            result["encouragement"] = line.strip()[:150]
            break

    # Fallback
    if not result["concept_to_review"] and lines:
        result["concept_to_review"] = lines[0].strip()[:200]
    if not result["encouragement"]:
        result["encouragement"] = "You're doing great! Keep practicing!"

    return result

@app.post("/api/hint")
async def hint_code(request: HintRequest):
    """Give a hint using AI with structured format"""
    tone = get_grade_tone(request.grade_level)
    prompt = f"""Give helpful hints for {request.grade_level} students WITHOUT solving the problem.
{tone}

Code:
```{request.language}
{request.code}
```

Question/Problem: {request.question}

Format response with:
- CONCEPT: Programming concept to review
- HINTS: Give 2-3 helpful hints (use - for bullets)
- RESOURCE: Where to learn more
- ENCOURAGEMENT: Motivating message"""

    response = call_ai(prompt)
    hint_response = parse_hint_response(response)
    return hint_response

def parse_practice_response(response: str, difficulty: str, language: str) -> dict:
    """Parse practice problem response into structured format"""
    import re
    import json

    # Try JSON first
    try:
        if "```json" in response:
            json_str = response.split("```json")[1].split("```")[0].strip()
        elif "{" in response:
            json_str = response[response.find("{"):response.rfind("}")+1]
        else:
            json_str = response
        return json.loads(json_str)
    except:
        pass

    # Parse markdown format
    result = {
        "title": "Practice Problem",
        "description": "",
        "difficulty": difficulty,
        "language": language,
        "learning_objective": "",
        "example_code": "",
        "hints": [],
        "expected_output": "",
        "starter_code": ""
    }

    lines = response.split('\n')

    # Extract title (first heading or first line)
    for line in lines:
        if line.startswith('#'):
            result["title"] = line.replace('#', '').strip()
            break
    if result["title"] == "Practice Problem" and lines:
        result["title"] = lines[0].strip()[:100]

    # Extract description (paragraph after title)
    desc_started = False
    for line in lines:
        if line.strip() and not line.startswith('#'):
            if not desc_started:
                desc_started = True
            else:
                result["description"] = line.strip()
                break

    # Extract code blocks
    code_blocks = re.findall(r'```(?:python|javascript|java|c\+\+|cpp)?\n(.*?)\n```', response, re.DOTALL)
    if code_blocks:
        result["example_code"] = code_blocks[0].strip()
    if len(code_blocks) > 1:
        result["starter_code"] = code_blocks[1].strip()

    # Extract hints (look for numbered or bulleted items)
    in_hints = False
    for line in lines:
        if 'hint' in line.lower():
            in_hints = True
            continue
        if in_hints and (re.match(r'^[\d\.\-\s]', line) or line.strip().startswith('-')):
            clean = re.sub(r'^[\d\.\-\s]+', '', line.strip())
            if clean and len(result["hints"]) < 3:
                result["hints"].append(clean)

    # Extract expected output
    for i, line in enumerate(lines):
        if 'output' in line.lower() and i + 1 < len(lines):
            result["expected_output"] = lines[i + 1].strip()

    # Learning objective
    for i, line in enumerate(lines):
        if 'learn' in line.lower() or 'objective' in line.lower():
            if i + 1 < len(lines):
                result["learning_objective"] = lines[i + 1].strip()
                break

    return result

@app.post("/api/practice")
async def get_practice_problem(request: PracticeRequest):
    """Generate practice problem with structured format"""
    tone = get_grade_tone(request.grade_level)
    prompt = f"""Create a {request.difficulty} {request.language} coding problem for {request.grade_level} students.
{tone}

Format with clear sections:
- TITLE: Problem name
- DESCRIPTION: What to solve
- LEARNING OBJECTIVE: What they'll learn
- EXAMPLE CODE: Show input/output
- HINTS: 2-3 helpful hints (use - for bullets)
- EXPECTED OUTPUT: What correct output looks like
- STARTER CODE: Template code to begin"""

    response = call_ai(prompt)
    problem_data = parse_practice_response(response, request.difficulty, request.language)
    return {"problem": problem_data}

@app.post("/api/search")
async def search_cs_topic(query: dict):
    """Search for Computer Science topics"""
    tone = "Explain for students. Keep it concise and beginner-friendly."
    prompt = f"""{tone}

Explain this Computer Science/Coding topic for students:
{query.get('topic', 'general programming')}

Keep it under 200 words."""
    
    response = call_ai(prompt)
    return {"result": response}

@app.post("/api/language-info")
async def language_info(request: dict):
    """Learn about any programming language - no compiler needed!"""
    language = request.get("language", "Python")
    grade_level = request.get("grade_level", "6")

    tone = get_grade_tone(grade_level)
    prompt = f"""{tone}

Teach {grade_level} grade students about {language}:

1. WHAT IS IT: What is {language} used for?
2. EXAMPLE: Show a simple 2-line code example
3. WHY LEARN: Why is {language} cool?
4. FUN FACT: One interesting thing about {language}

Keep it short and fun! Make it exciting for students to learn!"""

    response = call_ai(prompt)
    return {
        "language": language,
        "grade_level": grade_level,
        "info": response,
        "note": "No compiler needed - AI teaches the language!"
    }

@app.post("/api/ai/simulate")
async def ai_simulate(request: dict):
    """AI simulates code execution without running it"""
    code = request.get("code", "")
    language = request.get("language", "Python")
    grade_level = request.get("grade_level", "6")

    result = {"error": "Feature disabled", "status": "disabled"}
    return result

@app.post("/api/ai/teach")
async def ai_teach(request: dict):
    """AI teaches a programming concept"""
    concept = request.get("concept", "variables")
    language = request.get("language", "Python")
    grade_level = request.get("grade_level", "6")

    result = {"error": "Feature disabled", "status": "disabled"}
    return result

@app.post("/api/ai/review")
async def ai_review(request: dict):
    """AI reviews student code"""
    code = request.get("code", "")
    language = request.get("language", "Python")
    grade_level = request.get("grade_level", "6")

    result = {"error": "Feature disabled", "status": "disabled"}
    return result

@app.post("/api/ai/practice-advanced")
async def ai_practice_advanced(request: dict):
    """AI generates practice problems"""
    language = request.get("language", "Python")
    grade_level = request.get("grade_level", "6")
    difficulty = request.get("difficulty", "medium")
    topic = request.get("topic", "")

    result = {"error": "Feature disabled", "status": "disabled"}
    return result

@app.post("/api/improve")
async def improve_code(request: ExplainRequest):
    """Suggest code improvements using language best practices"""
    tone = get_grade_tone(request.grade_level)
    system = f"You are an encouraging professional code reviewer for Grade {request.grade_level} students learning {request.language}. {tone} Focus on learning, not criticism. Build on any previous suggestions in this session."
    user_prompt = f"""Review and suggest improvements for this {request.language} code:
```{request.language}
{request.code}
```

Provide specific, practical suggestions:

**1. CODE STYLE AND FORMATTING** — How to write cleaner, more readable code
**2. BEST PRACTICES FOR {request.language.upper()}** — Professional practices specific to {request.language}
**3. EFFICIENCY** — How to make it run faster or use less memory
**4. BETTER NAMING** — Clearer variable/function names
**5. CODE STRUCTURE** — How to organize it better
**6. PROFESSIONAL TECHNIQUE** — One advanced {request.language} concept to try
**7. BEFORE AND AFTER** — Show ONE small improvement with original vs improved code

Be specific and encouraging."""

    response = call_ai(user_prompt, history=request.history, system=system)
    improvement = parse_explain_response(response)
    return improvement

@app.post("/api/analyze/search")
async def search_study_topics(request: dict):
    """Search for educational topics related to code"""
    query = request.get("query", "").lower()
    grade_level = request.get("grade_level", "6")

    # Study topics database - only programming/coding related
    STUDY_TOPICS = {
        "variables": "A named storage location in memory that holds a value",
        "loop": "Repeating code multiple times using for or while",
        "function": "Reusable block of code that performs a task",
        "array": "Collection of items stored in a single variable",
        "string": "Text data type enclosed in quotes",
        "conditionals": "If/else statements that make decisions in code",
        "data types": "Different kinds of data: int, string, float, boolean",
        "recursion": "Function that calls itself to solve a problem",
        "object": "Container that holds data and methods together",
        "class": "Blueprint for creating objects with properties and methods",
        "algorithm": "Step-by-step procedure to solve a problem",
        "debugging": "Finding and fixing errors in code",
    }

    # Search matching topics
    results = []
    for topic, definition in STUDY_TOPICS.items():
        if query in topic.lower():
            results.append({
                "topic": topic,
                "definition": definition,
                "matched": True
            })

    if not results:
        results.append({
            "topic": "Not found",
            "definition": "This topic is not in our programming study database. Try: variables, loop, function, array, string, etc.",
            "matched": False
        })

    return {
        "query": query,
        "grade_level": grade_level,
        "results": results,
        "total": len([r for r in results if r["matched"]])
    }

# ═════════════════════════════════════════════════════════════════════════════
# CHAT HISTORY & USAGE TRACKING ENDPOINTS
# ═════════════════════════════════════════════════════════════════════════════

@app.post("/api/save-chat")
async def save_chat(request: SaveChatRequest):
    """Save chat session to history"""
    try:
        chat_id = db.save_chat(
            request.user_id,
            request.tool_name,
            request.code,
            request.response,
            request.language
        )
        return {"chat_id": chat_id, "success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat-history")
async def get_chat_history(request: ChatHistoryRequest):
    """Get last 7 chat sessions"""
    try:
        chats = db.get_last_7_chats(request.user_id, request.tool_name)
        return {"chats": chats, "count": len(chats)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/check-usage")
async def check_usage(request: UsageCheckRequest):
    """Check daily usage for a tool"""
    try:
        usage = db.check_usage(request.user_id, request.tool_name)
        return usage
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/increment-usage")
async def increment_usage(request: UsageIncrementRequest):
    """Increment usage count for a tool"""
    try:
        usage = db.increment_usage(request.user_id, request.tool_name)
        return usage
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ═════════════════════════════════════════════════════════════════════════════
# NLP ANALYSIS ENDPOINTS
# ═════════════════════════════════════════════════════════════════════════════

class NLPAnalysisRequest(BaseModel):
    question: str
    context: str = ""
    grade_level: str = "6"

class NLPIntentRequest(BaseModel):
    text: str

class NLPSentimentRequest(BaseModel):
    text: str

class NLPTopicRequest(BaseModel):
    text: str

@app.post("/api/nlp/analyze")
async def analyze_question(request: NLPAnalysisRequest):
    """Comprehensive NLP analysis of student code question"""
    try:
        analysis = nlp_engine.analyze_question(request.question, request.context)
        return {"success": True, "analysis": analysis}
    except Exception as e:
        return {"success": False, "error": str(e), "analysis": None}

@app.post("/api/nlp/intent")
async def detect_intent(request: NLPIntentRequest):
    """Detect intent: explain code, debug, practice, improve"""
    try:
        intent = nlp_engine.detect_intent(request.text)
        return {"success": True, "intent": intent}
    except Exception as e:
        return {"success": False, "error": str(e), "intent": None}

@app.post("/api/nlp/sentiment")
async def analyze_sentiment(request: NLPSentimentRequest):
    """Analyze student frustration and confidence levels"""
    try:
        sentiment = nlp_engine.analyze_sentiment(request.text)
        return {"success": True, "sentiment": sentiment}
    except Exception as e:
        return {"success": False, "error": str(e), "sentiment": None}

@app.post("/api/nlp/topics")
async def extract_topics(request: NLPTopicRequest):
    """Extract programming topics from code/question"""
    try:
        topics = nlp_engine.extract_topics(request.text)
        return {"success": True, "topics": topics}
    except Exception as e:
        return {"success": False, "error": str(e), "topics": []}

@app.post("/api/nlp/classify")
async def classify_question(request: NLPAnalysisRequest):
    """Classify code question and get teaching strategy"""
    try:
        strategy = nlp_engine.classify_question_type(request.question)
        return {"success": True, "strategy": strategy}
    except Exception as e:
        return {"success": False, "error": str(e), "strategy": None}

# ─── SERVE FRONTEND ────────────────────────────────────

FRONTEND_DIST = Path(__file__).parent.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

NO_CACHE_HEADERS = {"Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache", "Expires": "0"}

@app.get("/")
def serve_index():
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(index_file, headers=NO_CACHE_HEADERS)
    return {"message": "CodeKids API running"}

@app.get("/{full_path:path}", include_in_schema=False)
def serve_frontend(full_path: str):
    if full_path.startswith("api/"):
        return {"error": "Not found"}
    file_path = FRONTEND_DIST / full_path
    if file_path.exists():
        return FileResponse(file_path)
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(index_file, headers=NO_CACHE_HEADERS)
    return {"error": "Not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
