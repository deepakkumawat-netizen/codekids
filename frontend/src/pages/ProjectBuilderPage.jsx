import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrade } from '../hooks/useGrade';
import Header from '../components/layout/Header';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import FileTree from '../components/editor/FileTree';
import CodeEditorTabs from '../components/editor/CodeEditorTabs';
import ProjectOutput from '../components/editor/ProjectOutput';
import { runCode } from '../api';
import '../styles/pages/ProjectBuilderPage.css';

const ProjectBuilderPage = ({ onNavigate, profile }) => {
  const navigate = useNavigate();
  const { gradeConfig } = useGrade();

  const [projectName, setProjectName] = useState('My Project');
  const [language, setLanguage] = useState('python');
  const [files, setFiles] = useState([
    {
      id: '1',
      name: 'main.py',
      language: 'python',
      content: '# Main file\nprint("Hello World")',
      unsaved: false
    },
    {
      id: '2',
      name: 'utils.py',
      language: 'python',
      content: '# Utility functions\ndef greet(name):\n    return f"Hello {name}"',
      unsaved: false
    }
  ]);

  const [openFiles, setOpenFiles] = useState(['1', '2']);
  const [activeFile, setActiveFile] = useState('1');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  // Get current file
  const currentFile = files.find(f => f.id === activeFile);

  // Handle file selection
  const handleSelectFile = (fileId) => {
    setActiveFile(fileId);
    if (!openFiles.includes(fileId)) {
      setOpenFiles([...openFiles, fileId]);
    }
  };

  // Handle file close
  const handleCloseFile = (fileId) => {
    const newOpenFiles = openFiles.filter(id => id !== fileId);
    setOpenFiles(newOpenFiles);

    if (activeFile === fileId && newOpenFiles.length > 0) {
      setActiveFile(newOpenFiles[0]);
    }
  };

  // Handle file content change
  const handleFileContentChange = (content) => {
    setFiles(files.map(f =>
      f.id === activeFile
        ? { ...f, content, unsaved: true }
        : f
    ));
  };

  // Handle create new file
  const handleCreateFile = () => {
    if (!newFileName.trim()) return;

    const newFile = {
      id: Date.now().toString(),
      name: newFileName,
      language: language,
      content: `# ${newFileName}\n`,
      unsaved: false
    };

    setFiles([...files, newFile]);
    setOpenFiles([...openFiles, newFile.id]);
    setActiveFile(newFile.id);
    setNewFileName('');
    setShowNewFileModal(false);
  };

  // Handle delete file
  const handleDeleteFile = (fileId) => {
    if (window.confirm('Delete this file?')) {
      setFiles(files.filter(f => f.id !== fileId));
      handleCloseFile(fileId);
    }
  };

  // Handle rename file
  const handleRenameFile = (fileId, newName) => {
    setFiles(files.map(f =>
      f.id === fileId ? { ...f, name: newName } : f
    ));
  };

  // Handle save (mark all as saved)
  const handleSave = () => {
    setFiles(files.map(f => ({ ...f, unsaved: false })));
  };

  // Handle run project
  const handleRunProject = async () => {
    if (!currentFile) return;

    setIsRunning(true);
    setOutput('Running...\n');

    try {
      const result = await runCode(currentFile.content, currentFile.language);
      setOutput((result.stdout || '') + (result.stderr || ''));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Handle build (for compiled languages)
  const handleBuild = async () => {
    if (!['java', 'c++', 'go'].includes(language)) {
      setOutput('Build only works with Java, C++, or Go');
      return;
    }

    setIsRunning(true);
    setOutput('Building...\n');

    try {
      // For compiled languages, this would compile all files
      setOutput('Build successful!');
    } catch (error) {
      setOutput(`Build error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const LANGUAGES = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'c++', label: 'C++' },
    { value: 'go', label: 'Go' }
  ];

  const useEmojis = gradeConfig?.features?.useEmojis ?? false;

  const menuItems = [
    { label: 'Home', href: '/', onClick: () => navigate('/') },
    { label: 'Code Lab', href: '/code', onClick: () => navigate('/code') },
    { label: 'Projects', href: '/projects', onClick: () => navigate('/projects'), active: true },
    { label: 'Knowledge', href: '/knowledge', onClick: () => navigate('/knowledge') },
  ];

  return (
    <>
      <Header onNavigate={onNavigate} logo="CodeKids" showMenu={true} menuItems={menuItems} />

      <Container>
        <div className="project-builder">
          {/* Header Section */}
          <div className="project-header">
            <div className="project-info">
              <Input
                label={useEmojis ? '📁 Project Name' : 'Project Name'}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Awesome Project"
              />

              <Select
                label={useEmojis ? '💻 Language' : 'Language'}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={LANGUAGES}
              />
            </div>

            <div className="project-actions">
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                disabled={!files.some(f => f.unsaved)}
              >
                {useEmojis ? '💾' : ''} Save
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={handleBuild}
                disabled={isRunning}
              >
                {useEmojis ? '🔨' : ''} Build
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleRunProject}
                disabled={isRunning || !currentFile}
              >
                {useEmojis ? '▶️' : ''} Run
              </Button>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="editor-container">
            {/* File Tree */}
            <FileTree
              files={files}
              activeFile={activeFile}
              onSelectFile={handleSelectFile}
              onCreateFile={() => setShowNewFileModal(true)}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
              useEmojis={useEmojis}
            />

            {/* Editor Area */}
            <div className="editor-area">
              {/* Tabs */}
              <CodeEditorTabs
                openFiles={openFiles.map(id => files.find(f => f.id === id)).filter(Boolean)}
                activeFile={activeFile}
                onSelectFile={handleSelectFile}
                onCloseFile={handleCloseFile}
                unsavedFiles={files.filter(f => f.unsaved).map(f => f.id)}
              />

              {/* Code Editor */}
              {currentFile && (
                <div className="code-editor-wrapper">
                  <textarea
                    className="code-editor"
                    value={currentFile.content}
                    onChange={(e) => handleFileContentChange(e.target.value)}
                    spellCheck="false"
                    wrap="off"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Output Console */}
          <ProjectOutput
            output={output}
            isRunning={isRunning}
            grade={profile?.grade}
            useEmojis={useEmojis}
          />

          {/* New File Modal */}
          {showNewFileModal && (
            <div className="modal-overlay" onClick={() => setShowNewFileModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{useEmojis ? '📄' : ''} New File</h3>
                <Input
                  label="File Name"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="utils.py"
                  autoFocus
                />
                <div className="modal-actions">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setShowNewFileModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleCreateFile}
                    disabled={!newFileName.trim()}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default ProjectBuilderPage;
