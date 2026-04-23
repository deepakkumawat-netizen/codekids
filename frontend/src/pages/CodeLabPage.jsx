/**
 * CodeLabPage Component
 * Advanced code editor with RAG AI integration
 * Features: syntax highlighting, execution, code analysis, learning assistance
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrade } from '../hooks/useGrade';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import { Spinner } from '../components/common/Loading';
import Header from '../components/layout/Header';
import '../styles/pages/CodeLabPage.css';

const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
];

const CodeLabPage = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { grade, gradeConfig, truncateText, addEmojiIfEligible } = useGrade();

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState("# Welcome to CodeKids! 🚀\nprint('Hello, World!')");

  // Update code when language changes
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    const defaultCodes = {
      python: "# Welcome to CodeKids!\nprint('Hello, World!')",
      java: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}",
      cpp: "#include <iostream>\nint main() {\n  std::cout << \"Hello, World!\" << std::endl;\n  return 0;\n}",
      go: "package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"Hello, World!\")\n}",
    };
    setCode(defaultCodes[newLanguage] || "// Write your code here");
  };
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [ragMode, setRagMode] = useState(null); // 'explain', 'debug', 'improve', 'analyze'
  const [ragResult, setRagResult] = useState('');
  const [ragLoading, setRagLoading] = useState(false);
  const editorRef = useRef(null);

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

      // Truncate for grade level
      const truncated = truncateText(content);
      setRagResult(truncated);
    } catch (err) {
      setRagResult(`❌ Error: ${err.message}`);
    } finally {
      setRagLoading(false);
    }
  };

  const clearCode = () => {
    if (confirm('Clear all code? This cannot be undone.')) {
      setCode('');
      setOutput('');
    }
  };

  const ragButtons = [
    { id: 'explain', label: addEmojiIfEligible('Explain', '📖'), color: 'primary' },
    { id: 'debug', label: addEmojiIfEligible('Debug', '🔍'), color: 'warning' },
    { id: 'improve', label: addEmojiIfEligible('Improve', '✨'), color: 'success' },
    { id: 'analyze', label: addEmojiIfEligible('Analyze', '📊'), color: 'primary' },
  ];

  const menuItems = [
    { label: 'Home', href: '/', onClick: () => navigate('/') },
    { label: 'Code Lab', href: '/code', onClick: () => navigate('/code'), active: true },
    { label: 'Projects', href: '/projects', onClick: () => navigate('/projects') },
    { label: 'Knowledge', href: '/knowledge', onClick: () => navigate('/knowledge') },
  ];

  return (
    <div className="codelab-page">
      <Header
        logo="CodeKids"
        onThemeToggle={() => {}}
        currentTheme="light"
        showMenu={true}
        menuItems={menuItems}
      />

      <div className="codelab-container">
        {/* Top Bar: Language & Grade */}
        <div className="codelab-top-bar">
          <div className="top-bar-left">
            <Select
              label="Language"
              options={LANGUAGES}
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              fullWidth={false}
            />
          </div>

          <div className="top-bar-right">
            <Badge variant="solid" color="primary">
              Grade {grade}
            </Badge>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="codelab-editor-area">
          {/* Code Editor */}
          <div className="code-editor-section">
            <div className="editor-header">
              <h3 className="editor-title">Code Editor</h3>
              <Button variant="ghost" size="sm" onClick={clearCode}>
                Clear
              </Button>
            </div>

            <textarea
              ref={editorRef}
              className="code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your code here..."
              spellCheck="false"
            />

            {/* Editor Actions */}
            <div className="editor-actions">
              <Button
                variant="primary"
                size={gradeConfig.features.largeText ? 'lg' : 'md'}
                onClick={handleRunCode}
                disabled={isRunning}
                loading={isRunning}
              >
                {isRunning ? 'Running...' : `▶ Run Code`}
              </Button>
            </div>
          </div>

          {/* Right Panel: Output & RAG */}
          <div className="codelab-right-panel">
            {/* Output Console */}
            <div className="output-section">
              <div className="section-header">
                <h4 className="section-title">Output</h4>
              </div>
              <pre className="output-console">
                {output || (gradeConfig.features.useEmojis
                  ? '👈 Click "Run Code" to see output here!'
                  : 'Click "Run Code" to see output here')}
              </pre>
            </div>

            {/* RAG Buttons */}
            <div className="rag-buttons-section">
              <div className="section-header">
                <h4 className="section-title">AI Help</h4>
              </div>
              <div className="rag-buttons-grid">
                {ragButtons.map((btn) => (
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
            </div>

            {/* RAG Results */}
            {ragLoading && (
              <div className="rag-loading">
                <Spinner size="md" />
                <p>Thinking...</p>
              </div>
            )}

            {ragResult && !ragLoading && (
              <div className="rag-result-section">
                <div className="section-header">
                  <h4 className="section-title">
                    {ragMode === 'explain' && '📖 Explanation'}
                    {ragMode === 'debug' && '🔍 Debugging Help'}
                    {ragMode === 'improve' && '✨ Improvements'}
                    {ragMode === 'analyze' && '📊 Analysis'}
                  </h4>
                </div>
                <div className="rag-result-content">
                  {ragResult}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        {gradeConfig.features.useEmojis && (
          <div className="codelab-tips">
            <p className="tips-text">
              💡 Tip: Use the AI Help buttons to understand your code better!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeLabPage;
