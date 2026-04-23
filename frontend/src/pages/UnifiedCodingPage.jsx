/**
 * UnifiedCodingPage Component
 * Professional unified coding platform matching Figma design
 * Features: Code editor, file browser, output console, AI help, learning concepts
 */

import React, { useState, useRef } from 'react';
import { useGrade } from '../hooks/useGrade';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import { Spinner } from '../components/common/Loading';
import Header from '../components/layout/Header';
import '../styles/pages/UnifiedCodingPage.css';

const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
];

const UnifiedCodingPage = ({ onNavigate }) => {
  const { grade, gradeConfig, truncateText, addEmojiIfEligible } = useGrade();

  // Code Editor State
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState("# Welcome to CodeKids! 🚀\nprint('Hello, World!')");
  const editorRef = useRef(null);

  // Output State
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // AI Help State
  const [ragMode, setRagMode] = useState(null);
  const [ragResult, setRagResult] = useState('');
  const [ragLoading, setRagLoading] = useState(false);

  // Project Files State
  const [files, setFiles] = useState([
    { id: 1, name: 'main.py', language: 'python', content: code, active: true },
    { id: 2, name: 'utils.py', language: 'python', content: '# Utility functions\n' },
  ]);
  const [activeFileId, setActiveFileId] = useState(1);
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);

  // Learning State
  const [learningQuery, setLearningQuery] = useState('');
  const [learningResults, setLearningResults] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);

  // Handle Language Change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    const defaultCodes = {
      python: "# Welcome to CodeKids!\nprint('Hello, World!')",
      java: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}",
      cpp: "#include <iostream>\nint main() {\n  std::cout << \"Hello, World!\" << std::endl;\n  return 0;\n}",
      go: "package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"Hello, World!\")\n}",
    };
    setCode(defaultCodes[newLanguage] || "// Write your code here");
    updateActiveFile({ ...files.find(f => f.id === activeFileId), content: defaultCodes[newLanguage] });
  };

  // Update active file content
  const updateActiveFile = (updatedFile) => {
    setFiles(files.map(f => f.id === activeFileId ? updatedFile : f));
  };

  // Handle Code Change
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    updateActiveFile({ ...files.find(f => f.id === activeFileId), content: newCode });
  };

  // Run Code
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('⏳ Running code...\n');

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, grade_level: grade }),
      });

      const result = await response.json();
      const output = result.stdout || result.output || result.error || result.message || 'No output';
      const displayOutput = result.stderr ? `${output}\n❌ Error: ${result.stderr}` : output;
      setOutput(displayOutput);
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Request RAG Help
  const handleRAGRequest = async (mode) => {
    if (!code.trim()) {
      setOutput('❌ Please write some code first!');
      return;
    }

    setRagMode(mode);
    setRagLoading(true);
    setRagResult('');

    try {
      const endpoint = {
        explain: '/api/explain',
        debug: '/api/debug',
        improve: '/api/explain',
        analyze: '/api/explain',
      }[mode];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, grade_level: grade }),
      });

      const result = await response.json();
      const content = result.explanation || result.solution || result.response || result.message || '';
      const truncated = truncateText(content);
      setRagResult(truncated);
    } catch (err) {
      setRagResult(`❌ Error: ${err.message}`);
    } finally {
      setRagLoading(false);
    }
  };

  // File Management
  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    const newFile = {
      id: Math.max(...files.map(f => f.id), 0) + 1,
      name: newFileName,
      language: language,
      content: '',
      active: false,
    };
    setFiles([...files, newFile]);
    setNewFileName('');
    setShowNewFileInput(false);
  };

  const handleDeleteFile = (fileId) => {
    if (files.length === 1) {
      alert('Cannot delete the last file');
      return;
    }
    const updated = files.filter(f => f.id !== fileId);
    setFiles(updated);
    if (activeFileId === fileId) {
      setActiveFileId(updated[0].id);
      setCode(updated[0].content);
    }
  };

  const handleSwitchFile = (fileId) => {
    setActiveFileId(fileId);
    const file = files.find(f => f.id === fileId);
    setCode(file.content);
    setLanguage(file.language);
  };

  // Learning Search
  const handleSearchConcepts = (query) => {
    setLearningQuery(query);
    // Mock learning concepts
    const concepts = [
      { id: 1, title: 'Variables', emoji: '📦', desc: 'Named containers for storing data' },
      { id: 2, title: 'Functions', emoji: '⚙️', desc: 'Reusable blocks of code' },
      { id: 3, title: 'Loops', emoji: '🔄', desc: 'Repeat code multiple times' },
      { id: 4, title: 'Conditionals', emoji: '❓', desc: 'Make decisions in code' },
      { id: 5, title: 'Classes', emoji: '🏗️', desc: 'Blueprints for objects' },
      { id: 6, title: 'Arrays', emoji: '📊', desc: 'Collections of items' },
    ];
    const filtered = query ? concepts.filter(c => c.title.toLowerCase().includes(query.toLowerCase())) : [];
    setLearningResults(filtered);
  };

  const ragButtons = [
    { id: 'explain', label: addEmojiIfEligible('Explain', '📖'), color: 'primary' },
    { id: 'debug', label: addEmojiIfEligible('Debug', '🔍'), color: 'warning' },
    { id: 'improve', label: addEmojiIfEligible('Improve', '✨'), color: 'success' },
    { id: 'analyze', label: addEmojiIfEligible('Analyze', '📊'), color: 'primary' },
  ];

  const activeFile = files.find(f => f.id === activeFileId);

  return (
    <div className="unified-page">
      <Header
        logo="CodeKids"
        onThemeToggle={() => {}}
        currentTheme="light"
        showMenu={false}
      />

      <div className="unified-container">
        {/* Top Control Bar */}
        <div className="unified-top-bar">
          <div className="top-bar-left">
            <Select
              label="Language"
              options={LANGUAGES}
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              fullWidth={false}
            />
          </div>
          <div className="top-bar-center">
            <span className="file-indicator">File: <strong>{activeFile?.name}</strong></span>
          </div>
          <div className="top-bar-right">
            <Badge variant="solid" color="primary">
              Grade {grade}
            </Badge>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="unified-main">
          {/* Left Sidebar - File Tree */}
          <aside className="unified-sidebar">
            <div className="sidebar-header">
              <h4>📁 Files</h4>
              <button
                className="sidebar-action-btn"
                onClick={() => setShowNewFileInput(!showNewFileInput)}
                title="New file"
              >
                ➕
              </button>
            </div>

            {showNewFileInput && (
              <div className="new-file-input">
                <input
                  type="text"
                  placeholder="filename.py"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                />
                <button onClick={handleAddFile}>✓</button>
                <button onClick={() => setShowNewFileInput(false)}>✕</button>
              </div>
            )}

            <div className="file-list">
              {files.map(file => (
                <div
                  key={file.id}
                  className={`file-item ${activeFileId === file.id ? 'active' : ''}`}
                  onClick={() => handleSwitchFile(file.id)}
                >
                  <span className="file-name">{file.name}</span>
                  <button
                    className="file-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </aside>

          {/* Center - Code Editor & Output */}
          <div className="unified-editor-section">
            {/* Code Editor */}
            <div className="code-editor-wrapper">
              <div className="editor-header">
                <h3>Code Editor</h3>
                <span className="editor-status">{language.toUpperCase()}</span>
              </div>
              <textarea
                ref={editorRef}
                className="code-textarea"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Write your code here..."
                spellCheck="false"
              />
              <div className="editor-actions">
                <Button
                  variant="primary"
                  onClick={handleRunCode}
                  disabled={isRunning}
                  loading={isRunning}
                >
                  {isRunning ? 'Running...' : '▶ Run Code'}
                </Button>
              </div>
            </div>

            {/* Output Console */}
            <div className="output-wrapper">
              <div className="output-header">
                <h4>Output</h4>
                <button
                  className="output-clear"
                  onClick={() => setOutput('')}
                  title="Clear output"
                >
                  Clear
                </button>
              </div>
              <pre className="output-console">
                {output || (gradeConfig.features.useEmojis
                  ? '👈 Click "Run Code" to see output!'
                  : 'Click "Run Code" to see output')}
              </pre>
            </div>
          </div>

          {/* Right Sidebar - AI Help & Learning */}
          <aside className="unified-right-panel">
            {/* AI Help Tabs */}
            <div className="right-section rag-section">
              <div className="section-header">
                <h4>🤖 AI Help</h4>
              </div>
              <div className="rag-buttons-grid">
                {ragButtons.map(btn => (
                  <Button
                    key={btn.id}
                    variant={ragMode === btn.id ? 'primary' : 'outline'}
                    size="sm"
                    color={btn.color}
                    onClick={() => handleRAGRequest(btn.id)}
                    disabled={ragLoading}
                    fullWidth
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>

              {ragLoading && (
                <div className="rag-loading">
                  <Spinner size="md" />
                  <p>Thinking...</p>
                </div>
              )}

              {ragResult && !ragLoading && (
                <div className="rag-result">
                  <div className="result-title">
                    {ragMode === 'explain' && '📖 Explanation'}
                    {ragMode === 'debug' && '🔍 Debug Help'}
                    {ragMode === 'improve' && '✨ Improvements'}
                    {ragMode === 'analyze' && '📊 Analysis'}
                  </div>
                  <div className="result-content">{ragResult}</div>
                </div>
              )}
            </div>

            {/* Learning Concepts */}
            <div className="right-section learning-section">
              <div className="section-header">
                <h4>📚 Learn Concepts</h4>
              </div>
              <input
                type="text"
                className="learning-search"
                placeholder="Search concepts..."
                value={learningQuery}
                onChange={(e) => handleSearchConcepts(e.target.value)}
              />

              <div className="learning-list">
                {learningResults.length > 0 ? (
                  learningResults.map(concept => (
                    <div
                      key={concept.id}
                      className="concept-card"
                      onClick={() => setSelectedConcept(concept)}
                    >
                      <span className="concept-emoji">{concept.emoji}</span>
                      <div>
                        <div className="concept-title">{concept.title}</div>
                        <div className="concept-desc">{concept.desc}</div>
                      </div>
                    </div>
                  ))
                ) : learningQuery ? (
                  <p className="no-results">No concepts found</p>
                ) : (
                  <p className="learning-hint">Search for a concept to learn</p>
                )}
              </div>

              {selectedConcept && (
                <div className="concept-modal-overlay" onClick={() => setSelectedConcept(null)}>
                  <div className="concept-modal" onClick={e => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setSelectedConcept(null)}>✕</button>
                    <h3>{selectedConcept.emoji} {selectedConcept.title}</h3>
                    <p>{selectedConcept.desc}</p>
                    <p>Learn more about {selectedConcept.title.toLowerCase()} with examples and best practices.</p>
                    <Button variant="primary" fullWidth>Learn More</Button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default UnifiedCodingPage;
