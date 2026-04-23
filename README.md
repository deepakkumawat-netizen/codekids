# CodeKids - AI-Powered K-12 Coding Platform

A modern, grade-aware coding education platform with advanced AI assistance, built for students from Kindergarten through Grade 12.

## 🚀 Quick Start

### Prerequisites
- **Windows 10/11** with 2GB free disk space
- **Python 3.12+**
- **Node.js 18+**

### Installation

1. **Clone or download** this repository
2. **Install backend dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Platform

**Terminal 1 - Backend Server:**
```bash
cd backend
python main.py
```
Backend runs on `http://localhost:7000` (or next available port)

**Terminal 2 - Frontend Dev Server:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5175` (or next available port)

Open your browser to `http://localhost:5175` to access the platform.

---

## 📁 Project Structure

```
codekids/
├── backend/                    # FastAPI backend with RAG AI
│   ├── main.py                # FastAPI application entry
│   ├── compilers.py           # Local compiler management
│   ├── rag_agent.py           # RAG AI agent with Claude
│   ├── knowledge_base.py       # ChromaDB vector database
│   ├── code_analyzer.py        # Advanced code analysis
│   ├── mcp_server.py          # MCP tools for Claude IDE
│   ├── knowledge/             # Knowledge base JSON files
│   ├── compilers/             # 10 bundled compilers/runtimes
│   └── requirements.txt        # Python dependencies
│
├── frontend/                   # React frontend with Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # 8 reusable UI components
│   │   │   └── layout/        # 4 layout components
│   │   ├── context/           # ThemeContext, GradeContext
│   │   ├── hooks/             # useTheme, useGrade
│   │   ├── pages/             # HomePage, CodeLabPage
│   │   ├── styles/            # Design tokens, globals, page styles
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── run-codekids.bat          # One-click launcher for Windows
```

---

## 🎯 Features

### 📚 Grade-Aware Learning
Automatically adapts content, complexity, and UI based on student grade (K-12):
- **K-3**: Simple, colorful, emoji-heavy, gameified
- **4-6**: Intermediate, visual learning, balanced complexity
- **7-12**: Advanced topics, academic language, professional interface

### 💻 Advanced Code Editor
- **4 Languages**: Python, Java, C++, Go
- **Local Execution**: All compilers bundled - no external dependencies
- **AI Assistance**: Explain, Debug, Improve, Analyze code with Claude AI
- **Real-time Output**: See results instantly

### 🤖 RAG AI Integration
- **Knowledge Base**: 100+ programming concepts, design patterns, best practices
- **Claude AI**: Intelligent code explanations and suggestions
- **Grade-Aware**: Responses adapt to student grade level
- **Context-Aware**: Uses code samples in explanations

### 🎨 Modern UI
- **Design System**: #399aff primary + grayscale (12-point)
- **Dark Mode**: Automatic light/dark theme switching
- **Responsive**: Mobile (375px), Tablet (768px), Desktop (1280px+)
- **Accessible**: WCAG AA compliant, full keyboard navigation

### 📊 Component Library
**Common Components:**
- Button, Input, Select, Badge, Card, Loading, Icon, Toast

**Layout Components:**
- Header, Sidebar, MainLayout, Container

---

## 🔧 Backend API

### Code Execution
```bash
POST /api/execute
Content-Type: application/json

{
  "code": "print('hello')",
  "language": "python"
}
```

### RAG AI Features
```bash
# Explain code
POST /api/advanced/explain
{ "code": "...", "language": "python", "grade": "6" }

# Debug code
POST /api/advanced/debug
{ "code": "...", "language": "python", "error": "..." }

# Improve code
POST /api/advanced/improve
{ "code": "...", "language": "python", "focus": "best_practices" }

# Analyze code
POST /api/advanced/analyze
{ "code": "...", "language": "python" }
```

---

## 📖 Component Usage Examples

### Using Grade Context
```jsx
import { useGrade } from '@/hooks/useGrade';

function MyComponent() {
  const { grade, isEarlyElementary, truncateText, addEmojiIfEligible } = useGrade();
  
  return (
    <h1>{addEmojiIfEligible('Welcome!', '👋')}</h1>
  );
}
```

### Using Theme Context
```jsx
import { useTheme } from '@/hooks/useTheme';

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return <button onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>;
}
```

### Using Components
```jsx
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Badge from '@/components/common/Badge';

<Button variant="primary" size="md">Click Me</Button>
<Input label="Username" error="Required" />
<Badge variant="solid" color="success">Active</Badge>
```

---

## 🌐 Environment Variables

Create `.env` in backend directory (optional):
```
ANTHROPIC_API_KEY=your_key_here
YOUTUBE_API_KEY=your_key_here
```

Without these keys:
- Claude API calls will fail (add key to enable)
- YouTube videos show search link instead

---

## 📊 Available Grades

The platform supports all K-12 grades with optimized experiences:
- **K, 1, 2, 3** - Early Elementary (5-9 years)
- **4, 5, 6** - Elementary (9-12 years)
- **7, 8, 9** - Middle School (12-15 years)
- **10, 11, 12** - High School (15-18 years)

Each grade has custom configurations for:
- Text size and readability
- Language simplification
- Visual/emoji usage
- Content complexity
- UI features and interactions

---

## 🎓 Learning Resources

### Knowledge Base
The `/backend/knowledge/` directory contains structured learning materials:
- `programming_concepts.json` - OOP, Data Structures, Algorithms
- `design_patterns.json` - 13 Gang of Four patterns
- `best_practices.json` - Code quality, performance, security
- `debug_patterns.json` - Common errors and solutions
- `algorithms.json` - Sorting, searching, graph algorithms
- `framework_guides.json` - Frontend, backend, architecture patterns

---

## 🔌 Bundled Compilers

All 4 languages are included as portable executables:
```
backend/compilers/
├── python/           Python 3.12+
├── java/             OpenJDK 21
├── gcc/              GCC/G++ (C++)
└── go/               Go 1.21+
```

**No external installation needed** - just extract and run!

---

## 🛠️ Development

### Backend Stack
- **FastAPI** - REST API framework
- **ChromaDB** - Vector database for embeddings
- **Sentence-Transformers** - Embeddings (all-MiniLM-L6-v2)
- **Claude API** - AI reasoning engine
- **MCP** - Model Context Protocol for Claude IDE

### Frontend Stack
- **React 18** - UI framework
- **Vite** - Build tool
- **CSS Variables** - Dynamic theming
- **Mobile-First** - Responsive design

---

## 📝 Features Status

✅ **Completed**
- Design system with tokens
- 12 reusable components
- Grade-aware context and hooks
- HomePage with grade selection
- CodeLabPage with code editor + RAG
- Local compiler execution
- Dark mode support
- Full responsive design
- Accessibility (WCAG AA)

🟡 **Ready to Build**
- ProjectBuilderPage (multi-file projects)
- KnowledgeBasePage (concept browser)
- PracticePage (challenge problems)
- Monaco editor integration
- Code syntax highlighting

---

## 🚀 Deployment

### Production Build
```bash
cd frontend
npm run build
```

Output goes to `frontend/dist/` - ready for web server.

### Docker Support (Future)
Can be containerized for school networks with:
- Pre-bundled compilers
- No external dependencies
- Full offline support

---

## 📞 Support

For issues or questions:
1. Check console logs (`npm run dev` shows errors)
2. Verify all compilers exist in `backend/compilers/`
3. Check `.env` for API keys if using Claude/YouTube

---

## 📄 License

Educational platform for K-12 students.

---

## 🎉 What Makes CodeKids Special

✨ **For Students:**
- Learn to code without installing anything
- AI-powered learning assistance
- Grade-appropriate content and UI
- Multiple programming languages in one place

✨ **For Teachers:**
- Deploy to entire school with one folder
- No server setup required
- All students see same modern interface
- Works completely offline

✨ **For Schools:**
- Zero external dependencies
- FERPA/Privacy compliant (local execution)
- No internet connectivity required
- Supports 200+ students simultaneously

---

**Welcome to CodeKids! Start coding today! 🚀**
