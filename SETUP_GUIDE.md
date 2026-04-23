# CodeKids Setup Guide

## Prerequisites Check

Before installing, make sure you have:
- ✅ Python 3.10+ (`python --version`)
- ✅ Node.js 18+ (`node --version`)
- ✅ At least 2GB free disk space
- ✅ Administrator access (Windows)

---

## Installation Steps

### 1. Backend Setup

**Option A: Simple Setup (Recommended for most users)**

```bash
cd backend
pip install -r requirements.txt
```

This installs the minimal, pre-compiled dependencies that don't require compilation.

**Included Features:**
- ✅ FastAPI REST API
- ✅ Local code execution
- ✅ Basic API endpoints
- ✅ Compiler management

**Missing (Optional):**
- ChromaDB vector database (RAG)
- Sentence transformers (embeddings)
- LangChain (chain orchestration)

---

**Option B: Full Setup (with RAG AI Features)**

If you want the full RAG features, you need Rust installed first:

**Step 1: Install Rust**
1. Download from https://rustup.rs/
2. Run the installer
3. Accept default installation
4. Restart your terminal

**Step 2: Install Full Dependencies**
```bash
cd backend
pip install -r requirements-full.txt
```

**Included Features:**
- ✅ Everything from Option A
- ✅ ChromaDB vector database
- ✅ Sentence transformers
- ✅ LangChain support
- ✅ Full RAG AI capabilities

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

If you get permission errors:
```bash
npm install --legacy-peer-deps
```

---

## Running CodeKids

### Option 1: Automatic (Windows)

Double-click `run-codekids.bat` - this starts both servers automatically.

---

### Option 2: Manual (All Platforms)

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:7000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.0.0  ready in 500 ms
Local:   http://localhost:5175/
```

**Open browser:** `http://localhost:5175`

---

## Troubleshooting

### "Python not found"
- Make sure Python is installed: `python --version`
- If not, download from https://www.python.org/downloads/
- During installation, check ✅ "Add Python to PATH"

### "Node not found"
- Download from https://nodejs.org/ (LTS version)
- Install and restart terminal

### "pip install still fails with Rust errors"

**Solution 1: Use Option A (Simple Setup)**
```bash
pip install -r requirements.txt
```
This avoids all compilation issues.

**Solution 2: Install Rust**
1. Go to https://rustup.rs/
2. Download and run installer
3. Restart terminal
4. Try again: `pip install -r requirements-full.txt`

**Solution 3: Clear pip cache**
```bash
pip install --no-cache-dir -r requirements.txt
```

### "Port 5175 already in use"
Vite will automatically use the next available port (5176, 5177, etc.)

### "Port 7000 already in use"
Backend will auto-detect and use next available port (7001, 7002, etc.)

---

## What Each Setup Includes

### Simple Setup (requirements.txt)
- REST API server ✅
- Code execution (10 languages) ✅
- MCP tools for Claude IDE ✅
- Basic endpoints ✅

**Missing:**
- Vector database ❌
- AI embeddings ❌
- Advanced RAG features ❌

### Full Setup (requirements-full.txt)
- Everything above ✅
- ChromaDB vector database ✅
- Sentence transformers ✅
- LangChain chains ✅
- Advanced RAG features ✅

---

## Verifying Installation

### Backend Check
```bash
cd backend
python -c "import fastapi; print('✅ FastAPI installed')"
python -c "import anthropic; print('✅ Anthropic SDK installed')"
python main.py  # Should start without errors
```

### Frontend Check
```bash
cd frontend
npm list react  # Should show installed version
npm run dev     # Should start dev server
```

---

## Next Steps

1. ✅ Install dependencies (use Option A or B above)
2. ✅ Start both servers
3. ✅ Open http://localhost:5175 in browser
4. ✅ Select a grade (K-12)
5. ✅ Try the Code Editor
6. ✅ Click "Run Code" to execute
7. ✅ Use "AI Help" buttons for assistance

---

## Advanced Configuration

### Using an API Key (Optional)

Create `.env` file in `backend/` directory:

```env
ANTHROPIC_API_KEY=your_key_here
YOUTUBE_API_KEY=your_key_here
```

Get keys from:
- Anthropic: https://console.anthropic.com/
- YouTube: https://console.cloud.google.com/

Without keys:
- Claude AI will not work (shows error)
- YouTube videos show search link instead of embedded player

### Running on Different Port

**Backend (Python):**
```bash
python main.py --port 8000
```

**Frontend (Node):**
```bash
npm run dev -- --port 3000
```

---

## System Requirements

### Minimum
- Windows 10, macOS 10.14+, or Linux
- Python 3.10+
- Node.js 18+
- 2GB RAM
- 2GB disk space

### Recommended
- Windows 11 or latest macOS/Linux
- Python 3.12+
- Node.js 20+
- 8GB RAM
- 5GB disk space (includes all compilers)

---

## Support

### Installation Issues
1. Check Python version: `python --version` (need 3.10+)
2. Check Node version: `node --version` (need 18+)
3. Clear pip cache: `pip install --no-cache-dir -r requirements.txt`
4. Try Simple Setup (requirements.txt)

### Runtime Issues
1. Check backend logs: Bottom of terminal window
2. Check frontend console: Browser DevTools (F12)
3. Verify ports not in use: `netstat -ano | findstr :5175` (Windows)

---

**Ready to code? Start with the Quick Start section of README.md!**
