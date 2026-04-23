# CodeKids Local Testing Guide

Complete step-by-step guide to test CodeKids on your local machine.

---

## ✅ Step 1: Check Prerequisites

Before starting, verify you have:

### **Windows Terminal/Command Prompt:**
Open a terminal and run:

```bash
python --version      # Should show 3.10 or higher
node --version        # Should show 18 or higher
npm --version         # Should show 9 or higher
git --version         # Optional, for version control
```

### **If any are missing:**

**Python Installation:**
1. Download from https://www.python.org/downloads/
2. During installation, CHECK ✅ "Add Python to PATH"
3. Restart terminal after installation

**Node.js Installation:**
1. Download from https://nodejs.org/ (LTS version)
2. Install with default settings
3. Restart terminal after installation

---

## 📂 Step 2: Navigate to Project Directory

```bash
cd C:\codekids
```

or if in different location:
```bash
cd C:\path\to\codekids
```

Verify you see these folders:
- ✅ `backend/`
- ✅ `frontend/`
- ✅ `README.md`

---

## 🔧 Step 3: Backend Setup

### **3a. Install Python Dependencies**

```bash
cd backend
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed fastapi-0.115.6 uvicorn-0.34.0 ...
```

⏱️ **Takes 2-5 minutes first time**

### **3b. Verify Backend Installation**

```bash
python -c "import fastapi; print('FastAPI installed: OK')"
```

**Expected:** `FastAPI installed: OK`

---

## 🎨 Step 4: Frontend Setup

### **4a. Install Node Dependencies**

```bash
cd ../frontend
npm install
```

**Expected output:**
```
added 200+ packages in 30-45s
```

⏱️ **Takes 1-3 minutes first time**

### **4b. Verify Frontend Installation**

```bash
npm list react
```

**Expected:** Shows react version installed

---

## 🚀 Step 5: Run the Application

### **IMPORTANT: Use 2 Terminal Windows**

You MUST run backend and frontend in separate terminals side-by-side.

---

### **Terminal 1: Start Backend**

```bash
cd C:\codekids\backend
python main.py
```

**You should see:**
```
INFO:     Uvicorn running on http://127.0.0.1:7000
INFO:     Application startup complete
```

✅ **Backend is ready when you see "Application startup complete"**

---

### **Terminal 2: Start Frontend**

In a NEW terminal window:

```bash
cd C:\codekids\frontend
npm run dev
```

**You should see:**
```
VITE v5.0.0 ready in 500 ms

Local:   http://localhost:5175/
press h to show help
```

✅ **Frontend is ready when you see the URL**

---

## 🌐 Step 6: Open Browser

1. **Open any web browser** (Chrome, Firefox, Edge, Safari)
2. **Go to:** `http://localhost:5175`
3. **You should see:** CodeKids homepage with blue header

---

## ✅ Step 7: Test Features

### **Test 1: Homepage**
- [ ] Page loads without errors
- [ ] See "Welcome to CodeKids!" message
- [ ] See grade selector (K-12)
- [ ] See 4 quick start cards

### **Test 2: Select a Grade**
- [ ] Click "Grade 4" button
- [ ] Button becomes highlighted in blue
- [ ] Page updates (if you scroll down)

### **Test 3: Code Editor**
- [ ] Click a "Get Started" button (or manually navigate to Code Editor)
- [ ] See language dropdown with 4 options:
  - [x] Python
  - [x] Java
  - [x] C++
  - [x] Go
- [ ] See code editor textarea
- [ ] See "Run Code" button

### **Test 4: Run Python Code**
```python
print("Hello World")
```
- [ ] Type above code in editor
- [ ] Click "Run Code" button
- [ ] Output shows: `Hello World`

### **Test 5: Run Java Code**
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java");
    }
}
```
- [ ] Select "Java" from dropdown
- [ ] Paste code above
- [ ] Click "Run Code"
- [ ] Output shows: `Hello from Java`

### **Test 6: Run C++ Code**
```cpp
#include <iostream>
int main() {
    std::cout << "Hello from C++" << std::endl;
    return 0;
}
```
- [ ] Select "C++" from dropdown
- [ ] Paste code above
- [ ] Click "Run Code"
- [ ] Output shows: `Hello from C++`

### **Test 7: Run Go Code**
```go
package main
import "fmt"
func main() {
    fmt.Println("Hello from Go")
}
```
- [ ] Select "Go" from dropdown
- [ ] Paste code above
- [ ] Click "Run Code"
- [ ] Output shows: `Hello from Go`

### **Test 8: Error Handling**
```python
print(undefined_variable)
```
- [ ] Run invalid Python code
- [ ] See error message in output
- [ ] Error message is clear and helpful

### **Test 9: Grade Selection Works**
- [ ] Select "Grade 2" (early elementary)
- [ ] Code editor shows simpler prompts
- [ ] Font sizes are larger

- [ ] Select "Grade 12" (high school)
- [ ] Interface shows more advanced features
- [ ] Technical language is used

---

## 🔍 Step 8: Check Developer Console

### **Open Browser DevTools:**
- Press `F12` or `Ctrl+Shift+I` (Windows)
- Click "Console" tab

### **Check for errors:**
- [ ] No red error messages
- [ ] No warning messages (yellow is OK)
- [ ] Only blue "info" messages are OK

---

## 🛠️ Troubleshooting

### **Problem: "Port 5175 already in use"**
```
Address already in use
```

**Solution:**
Vite will automatically use next port (5176, 5177, etc.)
Look for: `Local: http://localhost:5176/`

---

### **Problem: "Backend not responding"**
```
Failed to fetch
```

**Check:**
1. Is Terminal 1 still running? (Should see "Application startup complete")
2. Is backend on correct port? (Should be 7000)
3. Try restarting backend: Press Ctrl+C in Terminal 1, then `python main.py` again

---

### **Problem: "Python command not found"**
```
'python' is not recognized
```

**Solution:**
1. Make sure Python was added to PATH during installation
2. Try: `python3 --version`
3. If that works, use: `python3 main.py`
4. Or reinstall Python with "Add to PATH" checked

---

### **Problem: "npm install fails"**
```
npm ERR! code EACCES
```

**Solution:**
```bash
npm install --legacy-peer-deps
```

---

### **Problem: Code doesn't execute (says "Timeout")**

The compilers might not be in the right path.

**Check:**
```bash
ls C:\codekids\backend\compilers\
```

Should show:
- `python/`
- `java/`
- `gcc/`
- `go/`

---

### **Problem: "Module not found" error**

**Solution:**
```bash
# In backend folder
pip install -r requirements.txt --upgrade

# In frontend folder
npm install
```

---

## 📊 Testing Checklist

### **Functionality**
- [ ] Homepage loads
- [ ] Grade selector works
- [ ] Language dropdown shows 4 languages
- [ ] Python code runs
- [ ] Java code runs
- [ ] C++ code runs
- [ ] Go code runs
- [ ] Error messages display
- [ ] Output console works

### **Performance**
- [ ] Page loads in < 2 seconds
- [ ] Code runs in < 10 seconds
- [ ] No lag when typing code

### **Visual**
- [ ] Colors are correct (blue #399aff)
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] Layout is responsive

### **Console**
- [ ] No red errors in browser console
- [ ] Backend terminal shows requests
- [ ] Frontend terminal shows no build errors

---

## 📱 Test on Mobile/Tablet (Optional)

### **Test Responsive Design:**

**In Browser:**
1. Press `F12` (DevTools)
2. Click "Toggle device toolbar" (phone icon)
3. Select "iPad" or "iPhone"

**Check:**
- [ ] Layout adapts to smaller screen
- [ ] Buttons are still clickable
- [ ] Text is still readable
- [ ] Code editor is usable

---

## 🌙 Test Dark Mode (Optional)

### **Change System Theme:**

**Windows:**
1. Settings → Personalization → Colors
2. Choose "Dark" mode
3. Refresh browser (F5)

**Check:**
- [ ] UI changes to dark colors
- [ ] Text is still readable
- [ ] No brightness issues

---

## 📈 Expected Results Summary

| Feature | Expected | Status |
|---------|----------|--------|
| Homepage loads | Yes | ✅ |
| 4 languages show | Python, Java, C++, Go | ✅ |
| Python code runs | Output displays | ✅ |
| Java code compiles | Output displays | ✅ |
| C++ code compiles | Output displays | ✅ |
| Go code builds | Output displays | ✅ |
| Grade selector | Updates UI | ✅ |
| No console errors | Green checkmark | ✅ |

---

## 🎯 Quick Reference Commands

**Start Everything:**
```bash
# Terminal 1
cd C:\codekids\backend
python main.py

# Terminal 2 (new window)
cd C:\codekids\frontend
npm run dev

# Then open: http://localhost:5175
```

**Stop Everything:**
```bash
# In each terminal, press: Ctrl+C
```

**Restart:**
```bash
# Just press Ctrl+C and run the commands again
```

---

## 📞 Common Questions

**Q: Do I need both terminals open?**  
A: Yes! Backend (port 7000) and Frontend (port 5175) must run simultaneously.

**Q: Can I close the terminals after starting?**  
A: No, closing terminals stops the servers.

**Q: Can I run on a different port?**  
A: Yes! Backend auto-detects ports. Frontend can use: `npm run dev -- --port 3000`

**Q: Does it work without internet?**  
A: Yes! Compilers are bundled locally. No external APIs needed.

**Q: Can others on my network access it?**  
A: No, it's localhost only. To enable: See backend/main.py and change `127.0.0.1` to `0.0.0.0`

**Q: How do I know it's working?**  
A: Run code → see output = working! ✅

---

## 🎉 You're Ready!

Follow the steps above and CodeKids will be running locally. 

**Happy coding! 🚀**

If you get stuck, check the **Troubleshooting** section above!
