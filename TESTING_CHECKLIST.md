# CodeKids Testing Checklist

## 🚀 Pre-Flight Checklist

### Prerequisites
```
[ ] Python 3.10+ installed
[ ] Node.js 18+ installed
[ ] 500 MB free disk space
[ ] 2 terminal windows ready
```

---

## 📋 Setup Checklist

### Backend Setup
```
[ ] Navigate to: C:\codekids\backend
[ ] Run: pip install -r requirements.txt
[ ] Wait for: "Successfully installed..."
[ ] Verify: python -c "import fastapi; print('OK')"
```

### Frontend Setup
```
[ ] Navigate to: C:\codekids\frontend
[ ] Run: npm install
[ ] Wait for: "added X packages"
[ ] Verify: npm list react (shows version)
```

---

## 🎯 Startup Checklist

### Terminal 1: Backend
```
[ ] cd C:\codekids\backend
[ ] Run: python main.py
[ ] Wait for message:
    "Uvicorn running on http://127.0.0.1:7000"
[ ] See: "Application startup complete"
[ ] Status: READY ✅
```

### Terminal 2: Frontend
```
[ ] NEW terminal window (don't close Terminal 1!)
[ ] cd C:\codekids\frontend
[ ] Run: npm run dev
[ ] Wait for message:
    "Local: http://localhost:5175/"
[ ] See: "ready in XXX ms"
[ ] Status: READY ✅
```

### Browser
```
[ ] Open: http://localhost:5175
[ ] Check: Page loads
[ ] Check: No "Cannot connect" error
[ ] See: CodeKids homepage
[ ] Status: LOADED ✅
```

---

## ✅ Functionality Checklist

### Page Structure
```
[ ] Header displays with "CodeKids" logo
[ ] Blue color is #399aff (brand blue)
[ ] Grade selector shows K-12 grades
[ ] Can click grade buttons
```

### Code Editor
```
[ ] Language dropdown shows exactly 4 options:
    [ ] Python
    [ ] Java
    [ ] C++
    [ ] Go
[ ] Code textarea is visible
[ ] "Run Code" button is present
[ ] Output console is visible
```

### Language: Python
```
[ ] Select: Python
[ ] Type:
    print("Hello World")
[ ] Click: Run Code
[ ] See output: Hello World
[ ] Status: ✅ WORKING
```

### Language: Java
```
[ ] Select: Java
[ ] Type:
    public class Main {
        public static void main(String[] args) {
            System.out.println("Hello Java");
        }
    }
[ ] Click: Run Code
[ ] See output: Hello Java
[ ] Status: ✅ WORKING
```

### Language: C++
```
[ ] Select: C++
[ ] Type:
    #include <iostream>
    int main() {
        std::cout << "Hello C++" << std::endl;
        return 0;
    }
[ ] Click: Run Code
[ ] See output: Hello C++
[ ] Status: ✅ WORKING
```

### Language: Go
```
[ ] Select: Go
[ ] Type:
    package main
    import "fmt"
    func main() {
        fmt.Println("Hello Go")
    }
[ ] Click: Run Code
[ ] See output: Hello Go
[ ] Status: ✅ WORKING
```

### Grade Selection
```
[ ] Click: Grade K
[ ] Interface shows simpler text and larger fonts
[ ] Click: Grade 12
[ ] Interface shows advanced options
[ ] Grade changes properly: ✅ WORKING
```

### Error Handling
```
[ ] Type invalid Python:
    print(undefined)
[ ] Click: Run Code
[ ] See error message (not blank output)
[ ] Error is informative: ✅ WORKING
```

---

## 🔍 Console Checks

### Browser Console (F12)
```
[ ] Open DevTools: F12
[ ] Click: Console tab
[ ] Look for errors (red messages)
    [ ] NO red errors = ✅ GOOD
    [ ] Yellow warnings = OK (ignore)
    [ ] Blue info = OK (ignore)
```

### Backend Terminal
```
[ ] Should see requests like:
    "GET /api/execute"
    "POST /api/execute"
[ ] Status codes: 200, 201, etc.
[ ] NO error messages: ✅ GOOD
```

### Frontend Terminal
```
[ ] Should see:
    "VITE X.X.X ready"
    "ready in XXX ms"
[ ] NO build errors: ✅ GOOD
[ ] NO red text: ✅ GOOD
```

---

## 📊 Visual Verification

### Colors
```
[ ] Header: Blue (#399aff)
[ ] Buttons: Blue when active
[ ] Text: Dark (not gray)
[ ] Borders: Light gray (not black)
```

### Responsive Design
```
[ ] F12 → Device Toolbar
[ ] Select: iPhone 12
[ ] Page still works: ✅ YES
[ ] Text readable: ✅ YES
[ ] Buttons clickable: ✅ YES
```

### Dark Mode (Optional)
```
[ ] Windows: Settings → Colors → Dark
[ ] Refresh browser: F5
[ ] UI changes to dark: ✅ YES
[ ] Text still readable: ✅ YES
```

---

## 🎯 Final Verification

### Summary Table
| Component | Status | Notes |
|-----------|--------|-------|
| Backend Running | ✅ | Port 7000 |
| Frontend Running | ✅ | Port 5175 |
| Homepage Loads | ✅ | No errors |
| Python Works | ✅ | Code executes |
| Java Works | ✅ | Compiles & runs |
| C++ Works | ✅ | Compiles & runs |
| Go Works | ✅ | Builds & runs |
| Grade Selection | ✅ | Updates UI |
| Console Clear | ✅ | No errors |
| 4 Languages Only | ✅ | Not 10 |
| Project Size | ✅ | ~500 MB |

---

## 🚨 Troubleshooting Quick Links

See `LOCAL_TESTING_GUIDE.md` for:
- ❌ Port already in use → Solution
- ❌ Python not found → Solution
- ❌ Backend not responding → Solution
- ❌ npm install fails → Solution
- ❌ Code doesn't execute → Solution

---

## ✨ Success Criteria

✅ **All checked = CodeKids is working!**

You should be able to:
1. Load the homepage
2. Select a grade
3. Write Python code
4. Write Java code
5. Write C++ code
6. Write Go code
7. See all outputs correctly
8. Have no console errors

---

## 📝 Notes for Testing

**Optimal Testing Environment:**
- Windows 10/11
- 8GB+ RAM
- Chrome/Edge browser (recommended)
- Terminal windows: 1000x600px+ each

**Testing Duration:**
- First time setup: 10-15 minutes
- Subsequent tests: 30 seconds

**Expected Performance:**
- Homepage load: < 1 second
- Code execution: < 5 seconds
- No lag when typing: ✅

---

## 🎓 Test Scenarios

### Scenario 1: Fresh Installation
```
1. Install all dependencies
2. Start both servers
3. Load homepage
4. Run code in all 4 languages
5. Check for errors
```

### Scenario 2: User Testing
```
1. Select Grade 4
2. Write Python code
3. Run it
4. See output
5. Change grade to 12
6. Write C++ code
7. Run it
8. See output
```

### Scenario 3: Error Handling
```
1. Write syntax error
2. Run code
3. See clear error message
4. Fix code
5. Run again
6. See correct output
```

---

## 🎉 When Complete

All items checked = **CodeKids tested and verified working!**

You can now:
- ✅ Distribute to others
- ✅ Deploy to school servers
- ✅ Use for teaching K-12
- ✅ Customize further if needed

---

**Happy Testing! 🚀**
