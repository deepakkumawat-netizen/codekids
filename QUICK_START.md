# CodeKids - Quick Start (5 Minutes)

**Fastest way to test CodeKids locally**

---

## ⚡ Super Quick Steps

### **1. Check Python & Node** (1 min)
```bash
python --version    # Need 3.10+
node --version      # Need 18+
```

### **2. Setup Backend** (2 min)
```bash
cd C:\codekids\backend
pip install -r requirements.txt
```

### **3. Setup Frontend** (2 min)
```bash
cd C:\codekids\frontend
npm install
```

### **4. Open Terminal 1: Backend**
```bash
cd C:\codekids\backend
python main.py
```
Wait for: `Application startup complete`

### **5. Open Terminal 2: Frontend**
```bash
cd C:\codekids\frontend
npm run dev
```
Wait for: `Local: http://localhost:5175/`

### **6. Open Browser**
Go to: **http://localhost:5175**

---

## ✅ Test It Works

1. **See homepage?** → ✅ Working!
2. **Click "Code Practice"?** → ✅ Go to editor
3. **Run Python code:**
   ```python
   print("Hello World")
   ```
4. **See output?** → ✅ **All working!**

---

## 📚 Full Guide

For detailed testing steps, see: `LOCAL_TESTING_GUIDE.md`

---

## 🆘 Quick Help

| Problem | Fix |
|---------|-----|
| Python not found | Reinstall with "Add to PATH" |
| npm not found | Install Node.js from nodejs.org |
| Port already in use | Vite will use next port (5176, 5177...) |
| Backend errors | Make sure Terminal 1 is still running |
| Code doesn't run | Restart both terminals |

---

**That's it! CodeKids is running locally! 🎉**
