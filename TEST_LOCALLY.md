# Test CodeKids Locally

## Quick Start (3 Steps)

### Step 1: Double-click the startup script
```
C:\codekids\run-codekids.bat
```

This will:
- ✓ Start backend on port 7000
- ✓ Start frontend on port 5175  
- ✓ Open browser automatically

### Step 2: Wait for servers to start
- **Backend**: Should show "Application startup complete"
- **Frontend**: Should show "ready in XXX ms"

### Step 3: Test in browser

The app will open at: **http://localhost:5175**

---

## Manual Testing (If batch script doesn't work)

### Terminal 1: Backend
```bash
cd C:\codekids\backend
python main.py
```

Wait for:
```
INFO:     Uvicorn running on http://127.0.0.1:7000
INFO:     Application startup complete
```

### Terminal 2: Frontend
```bash
cd C:\codekids\frontend
npm run dev
```

Wait for:
```
VITE ... ready in XXX ms
Local: http://localhost:5175
```

### Terminal 3: Open Browser
```
http://localhost:5175
```

---

## Test Features

### 1. Homepage
- [ ] Click "Code Practice" button
- [ ] See 4 language options (Python, Java, C++, Go)

### 2. Python Test
```python
print("Hello World")
```
- [ ] Type above code
- [ ] Click "Run Code"
- [ ] See output: `Hello World`

### 3. Java Test
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}
```
- [ ] Select Java from dropdown
- [ ] Paste above code
- [ ] Click "Run Code"
- [ ] See output: `Hello Java`

### 4. C++ Test
```cpp
#include <iostream>
int main() {
    std::cout << "Hello C++" << std::endl;
    return 0;
}
```
- [ ] Select C++ from dropdown
- [ ] Paste above code
- [ ] Click "Run Code"
- [ ] See output: `Hello C++`

### 5. Go Test
```go
package main
import "fmt"
func main() {
    fmt.Println("Hello Go")
}
```
- [ ] Select Go from dropdown
- [ ] Paste above code
- [ ] Click "Run Code"
- [ ] See output: `Hello Go`

---

## If Something Goes Wrong

### Error: "Port already in use"
- The app will use the next available port (5176, 5177, etc.)
- Check the terminal for the correct URL

### Error: "Backend not responding"
- Make sure backend terminal is still running
- You should see "Application startup complete"
- Restart if needed: Ctrl+C, then `python main.py`

### Error: "Code doesn't run"
- Check browser console: F12 → Console tab
- Look for red error messages
- Check backend terminal for errors

### Browser won't load
- Try: http://localhost:5175
- If that doesn't work, check the frontend terminal for the correct port

---

## Project Structure

```
C:\codekids\
├── backend/                    (Python + FastAPI)
│   ├── main.py                (Main API server)
│   ├── compilers.py           (Code execution)
│   ├── compilers/             (Python, Java, Go, GCC)
│   └── requirements.txt        (Dependencies)
│
├── frontend/                   (React + Vite)
│   ├── src/
│   │   ├── App.jsx            (Main component)
│   │   ├── pages/             (Pages)
│   │   ├── components/        (Reusable components)
│   │   └── styles/            (CSS)
│   ├── package.json           (Dependencies)
│   └── vite.config.js         (Vite config)
│
└── Documentation
    ├── README.md              (Main docs)
    ├── QUICK_START.md         (5-minute guide)
    └── LOCAL_TESTING_GUIDE.md (Detailed testing)
```

---

## Success Checklist

- [ ] Homepage loads without errors
- [ ] Grade selector works
- [ ] Python code executes
- [ ] Java code compiles and runs
- [ ] C++ code compiles and runs
- [ ] Go code compiles and runs
- [ ] Browser console has no errors (F12)
- [ ] Backend shows 4 available compilers

---

**All items checked = CodeKids is working! 🎉**
