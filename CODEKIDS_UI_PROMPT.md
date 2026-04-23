# CodeKids Platform - Complete Project Specification for UI Generation

## PROJECT OVERVIEW

**CodeKids** is a K-12 coding education platform that teaches programming to students from Kindergarten through Grade 12. The platform provides an interactive environment for learning, practicing, and mastering code across multiple programming languages.

**Current Phase**: Building a professional unified single-page UI that combines all features into one dashboard.

---

## BACKEND CAPABILITIES & INFRASTRUCTURE

### Backend Technology
- **Framework**: FastAPI (Python)
- **Port**: 7000 (or auto-detected)
- **Compilers Available**: 4 languages bundled locally (completely offline)

### Supported Languages
1. **Python** - Full Python 3.x support
2. **Java** - Java compiler included
3. **C++** - GCC C++ compiler
4. **Go** - Go compiler included

### Core API Endpoints

#### Code Execution
- **POST /api/run**
  - Input: `{ code: string, language: string, grade_level: string }`
  - Output: `{ stdout: string, stderr: string, exit_code: int }`
  - Purpose: Execute code and return results

#### AI Assistance (RAG Integration)
- **POST /api/explain**
  - Input: `{ code: string, language: string, grade_level: string }`
  - Output: `{ explanation: string }`
  - Purpose: Explain what code does

- **POST /api/debug**
  - Input: `{ code: string, language: string, grade_level: string }`
  - Output: `{ solution: string }`
  - Purpose: Debug code and provide fixes

- **POST /api/improve**
  - Input: `{ code: string, language: string, grade_level: string }`
  - Output: `{ response: string }`
  - Purpose: Suggest code improvements

#### Knowledge Base
- **POST /api/mcp/get-topics**
  - Input: `{ subject: string, grade: string }`
  - Output: `{ topics: [string] }`
  - Purpose: Get learning topics for a subject

#### Media
- **POST /api/youtube**
  - Input: `{ query: string, grade: string, subject: string }`
  - Output: `{ videos: [...], count: int }`
  - Purpose: Get educational videos

---

## GRADE SYSTEM (K-12)

The platform adapts UI/UX based on student grade level:

### Grade Levels
- **K-3** (Kindergarten to Grade 3)
  - Emoji-heavy interface
  - Large, easy-to-click buttons
  - Simple language
  - More visual feedback
  - Max 250 characters per message

- **4-6** (Grade 4 to 6)
  - Balanced complexity
  - Standard emoji usage
  - Medium text size
  - Clear instructions

- **7-12** (Grade 7 to 12)
  - Professional interface
  - Minimal emoji (optional)
  - Full technical content
  - Advanced features enabled
  - Academic language

### Grade Context Object
```javascript
{
  grade: "6",              // String: "K", "1-12"
  gradeConfig: {
    features: {
      useEmojis: true,     // Boolean: Show emojis?
      largeText: false,    // Boolean: Larger fonts?
      simplifiedLanguage: false
    }
  }
}
```

---

## DESIGN SYSTEM

### Color Palette
- **Primary Color**: `#399aff` (Professional Blue)
- **Background**: `#fafbfc` (Light Gray)
- **Text Primary**: `#0f172a` (Dark Gray/Black)
- **Text Secondary**: `#64748b` (Medium Gray)
- **Borders**: `#e5e7eb` (Light Gray)
- **White**: `#ffffff`

### Success/Status Colors
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)

### Typography
- **Font Family**: Inter, system fonts
- **Code Font**: Monaco, Courier New, monospace
- **Base Size**: 14px (adjustable per grade)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- 2xl: 32px

### Border Radius
- sm: 4px
- md: 6px
- lg: 8px

### Shadows
- sm: `0 1px 2px rgba(0,0,0,0.05)`
- md: `0 4px 6px rgba(0,0,0,0.1)`
- lg: `0 10px 15px rgba(0,0,0,0.1)`

---

## UNIFIED UI LAYOUT SPECIFICATION

### Overall Structure
**Single-page platform** combining 5 integrated features with 3-column responsive layout:

```
┌─────────────────────────────────────────────────────┐
│              HEADER (60px)                          │
│  CodeKids Logo | File Indicator | Grade Badge      │
├──────┬─────────────────────────┬────────────────────┤
│      │                         │                    │
│ FILE │   CODE EDITOR           │  AI HELP PANEL    │
│ TREE │   (60% width)           │  (Right Sidebar)  │
│      │                         │                    │
│(120px)                         │                    │
├──────┼─────────────────────────┼────────────────────┤
│  OUTPUT CONSOLE (40%)          │  LEARNING PANEL    │
│                                │  (Right Sidebar)   │
└──────┴─────────────────────────┴────────────────────┘
```

### Section Details

#### 1. LEFT SIDEBAR - File Browser (120px)
**Purpose**: Manage project files and navigate between them

**Components**:
- Header with "📁 Files" title + "➕" add button
- List of files (main.py, utils.py, config.py, etc.)
- Active file highlighted in blue (#e8f3ff background, #399aff border)
- Click to switch files
- Hover to show delete button (✕)
- New file input (appears when ➕ clicked)

**Styling**:
- White background
- Borders: #e5e7eb
- File items: #f3f4f6 background
- Active: #e8f3ff with #399aff border
- Hover: Dark gray with blue border

#### 2. CENTER - Code Editor & Output
**Purpose**: Write and execute code, see results

**Code Editor Section**:
- Header with title "Code Editor" + language badge (PYTHON, JAVA, etc.)
- Textarea with syntax highlighting
- 14px monospace font
- Tab size: 2 spaces
- Language selector: Dropdown (Python, Java, C++, Go)
- Run button: Blue (#399aff), full width
- Takes 60% of width, most of vertical height

**Output Console**:
- Title "Output"
- Clear button (top right)
- Monospace text display
- Placeholder: "👈 Click 'Run Code' to see output"
- Shows stdout/stderr
- Fixed height: 180px
- Auto-scroll to bottom

**Interactions**:
- Type code → stored in state
- Select language → code updates with defaults
- Click "Run" → POST /api/run → display results
- Click "Clear" → reset output

#### 3. RIGHT SIDEBAR - AI Help + Learning (240px)

##### AI Help Panel (Top)
**Purpose**: Get AI assistance with code

**Components**:
- Header: "🤖 AI Help"
- 4 buttons in vertical stack:
  - [Explain] (📖) - Understand code
  - [Debug] (🔍) - Fix errors
  - [Improve] (✨) - Optimize code
  - [Analyze] (📊) - Code analysis
- Result area showing AI response
- Loading spinner while processing
- Color-coded headers for each type

**Interactions**:
- Click button → POST /api/{explain|debug|improve|analyze}
- Show spinner while loading
- Display result with emoji header
- Truncate text based on grade level

##### Learning Concepts Panel (Bottom)
**Purpose**: Browse and learn programming concepts

**Components**:
- Header: "📚 Learn Concepts"
- Search input: "🔍 Search..."
- Concept cards in list:
  - [📦 Variables] - Named containers
  - [⚙️ Functions] - Reusable blocks
  - [🔄 Loops] - Repetition
  - [❓ Conditionals] - Logic
  - [🏗️ Classes] - Objects
  - [📊 Arrays] - Collections
- Click concept → modal with details
- Modal shows: Title, definition, key points, examples

**Styling**:
- Concept cards: #f3f4f6 background, hover → blue border
- Search: Gray background, focus → light blue
- Modal: White background, centered, with close button

---

## KEY FEATURES

### 1. Code Editor
- ✅ Multiple language support (Python, Java, C++, Go)
- ✅ Syntax highlighting
- ✅ Real-time code execution
- ✅ Language selector dropdown
- ✅ Default code templates per language
- ✅ Tab size: 2 spaces
- ✅ Line wrapping enabled

### 2. File Management
- ✅ Create new files with input dialog
- ✅ Delete files with confirmation
- ✅ Switch between files by clicking
- ✅ Active file highlighted
- ✅ File list scrollable if many files

### 3. AI Assistance
- ✅ Explain code functionality
- ✅ Debug code and suggest fixes
- ✅ Improve code quality
- ✅ Analyze code structure
- ✅ Loading state with spinner
- ✅ Grade-aware text truncation

### 4. Learning Concepts
- ✅ Search/filter concepts
- ✅ Concept cards with emoji
- ✅ Click to open modal
- ✅ Modal shows full details
- ✅ Related concepts links
- ✅ "Learn More" button

### 5. Output Console
- ✅ Display code execution results
- ✅ Show errors in red
- ✅ Show output in gray
- ✅ Clear button to reset
- ✅ Auto-scroll to latest output
- ✅ Monospace font for code

---

## RESPONSIVE BREAKPOINTS

### Desktop (1280px+)
- Full 3-column layout
- Sidebar: 120px, Center: 1fr, Right: 240px
- All sections visible

### Tablet (768px - 1280px)
- 2-column layout (hide sidebar, keep center + right)
- Right panel: Stacked vertically or as tabs
- Adjusted spacing

### Mobile (< 768px)
- Single column layout
- Files: Dropdown or hamburger menu
- Center: Full width code editor
- Right: Below editor, stacked
- Adjusted font sizes

---

## TECHNICAL STACK

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: CSS (not CSS-in-JS)
- **State Management**: React hooks (useState, useRef)
- **HTTP Client**: Axios or Fetch API

### Dependencies
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "axios": "^1.4.0"  // Optional for API calls
}
```

### File Structure
```
frontend/
├── src/
│   ├── pages/
│   │   └── UnifiedCodingPage.jsx       // Main component
│   ├── styles/
│   │   └── pages/
│   │       └── UnifiedCodingPage.css   // Complete styling
│   ├── components/
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Badge.jsx
│   │       └── Loading.jsx
│   ├── hooks/
│   │   └── useGrade.js                 // Grade context
│   └── App.jsx
├── index.html
└── package.json
```

---

## STATE MANAGEMENT

### Component State
```javascript
const [language, setLanguage] = useState('python');
const [code, setCode] = useState('# Welcome...');
const [files, setFiles] = useState([...]);
const [activeFileId, setActiveFileId] = useState(1);
const [output, setOutput] = useState('');
const [isRunning, setIsRunning] = useState(false);
const [ragMode, setRagMode] = useState(null);
const [ragResult, setRagResult] = useState('');
const [ragLoading, setRagLoading] = useState(false);
const [learningQuery, setLearningQuery] = useState('');
const [learningResults, setLearningResults] = useState([]);
const [selectedConcept, setSelectedConcept] = useState(null);
```

### Context (from useGrade hook)
```javascript
const { grade, gradeConfig, truncateText, addEmojiIfEligible } = useGrade();
```

---

## API INTEGRATION PATTERNS

### Making API Calls
```javascript
// Code execution
const response = await fetch('/api/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    code: code, 
    language: language, 
    grade_level: grade 
  })
});
const result = await response.json();
setOutput(result.stdout || result.error);

// AI help
const response = await fetch('/api/explain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    code: code, 
    language: language, 
    grade_level: grade 
  })
});
const result = await response.json();
setRagResult(result.explanation);
```

### Error Handling
```javascript
try {
  // API call
} catch (error) {
  setOutput(`❌ Error: ${error.message}`);
  setRagResult(`❌ Error: ${error.message}`);
}
```

---

## ACCESSIBILITY & UX BEST PRACTICES

### Accessibility
- ✅ Semantic HTML (buttons, sections, headers)
- ✅ Color contrast WCAG AA compliant
- ✅ Keyboard navigation support
- ✅ Focus states visible
- ✅ ARIA labels on interactive elements
- ✅ Screen reader friendly

### User Experience
- ✅ Loading states (spinner, "Running..." text)
- ✅ Empty states (helpful placeholders)
- ✅ Error messages (clear and actionable)
- ✅ Smooth transitions (0.2s ease)
- ✅ Consistent spacing (12px grid)
- ✅ Clear visual hierarchy

### Dark Mode
- ✅ Full dark theme support
- ✅ Auto detect: `@media (prefers-color-scheme: dark)`
- ✅ Color adjustments:
  - Background: `#0f172a` (dark navy)
  - Surface: `#1e293b` (dark slate)
  - Text: `#f8fafc` (off-white)
  - Borders: `#334155` (dark gray)

---

## DEFAULT CODE TEMPLATES

### Python
```python
# Welcome to CodeKids!
print('Hello, World!')
```

### Java
```java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}
```

### C++
```cpp
#include <iostream>
int main() {
  std::cout << "Hello, World!" << std::endl;
  return 0;
}
```

### Go
```go
package main
import "fmt"
func main() {
  fmt.Println("Hello, World!")
}
```

---

## CONCEPT LIBRARY (Sample)

```javascript
const concepts = [
  {
    id: 'variables',
    title: 'Variables',
    emoji: '📦',
    desc: 'Named containers for storing data',
    definition: 'A variable is a named location in memory that holds a value...'
  },
  {
    id: 'functions',
    title: 'Functions',
    emoji: '⚙️',
    desc: 'Reusable blocks of code',
    definition: 'A function is a reusable block of code that performs a specific task...'
  },
  // ... more concepts
];
```

---

## DEPLOYMENT & PERFORMANCE

### Frontend Optimization
- ✅ Code splitting (lazy load components)
- ✅ Minified CSS and JS
- ✅ Image optimization (if any)
- ✅ Caching strategies
- ✅ LCP target: < 2.5s
- ✅ FID target: < 100ms
- ✅ CLS target: < 0.1

### Browser Support
- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## TESTING CHECKLIST

- [ ] Code execution works (all 4 languages)
- [ ] File switching works
- [ ] File creation works
- [ ] File deletion works
- [ ] AI help buttons return results
- [ ] Learning concepts display correctly
- [ ] Output displays correctly
- [ ] Dark mode toggles correctly
- [ ] Responsive at all breakpoints
- [ ] Grade-aware content shows correctly
- [ ] Emojis display on K-3 grades
- [ ] No console errors
- [ ] All buttons are clickable
- [ ] Modals open and close
- [ ] Loading states show correctly

---

## FUTURE ENHANCEMENTS

- [ ] Code syntax highlighting (Prism or Highlight.js)
- [ ] Code formatter (Prettier)
- [ ] Unit test integration
- [ ] Project save/load
- [ ] Collaborative editing (WebSocket)
- [ ] Code snippets library
- [ ] Achievements/badges
- [ ] Progress tracking
- [ ] Parent dashboard
- [ ] Teacher assessment tools

---

## SECURITY NOTES

⚠️ **IMPORTANT**: 
- Never expose API keys in frontend code
- Use environment variables (VITE_API_URL)
- Backend handles all sensitive operations
- Code execution is sandboxed on backend
- User input is validated on backend
- CORS properly configured
- XSS protection enabled

---

## NOTES FOR AI UI GENERATORS

1. **Use this specification to generate a modern, professional React component**
2. **Follow the exact color scheme and layout**
3. **Implement all 5 features as described**
4. **Make it fully responsive**
5. **Include dark mode support**
6. **Use semantic HTML for accessibility**
7. **Add smooth transitions (0.2s ease)**
8. **Grade-aware UI adjustments**
9. **Proper error handling**
10. **Loading states for all async operations**

---

## CONTACT & SUPPORT

For questions about the backend or API endpoints, refer to the backend documentation. This specification is for frontend UI implementation only.

**Last Updated**: 2026-04-09
**Version**: 1.0
**Status**: Ready for UI Implementation
