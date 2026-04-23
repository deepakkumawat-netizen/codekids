import React, { useState } from 'react';
import Button from '../common/Button';
import '../../styles/components/FileTree.css';

const FileTree = ({
  files,
  activeFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  useEmojis
}) => {
  const [renameId, setRenameId] = useState(null);
  const [renameName, setRenameName] = useState('');

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop();
    const icons = {
      py: '🐍',
      java: '☕',
      cpp: '⚙️',
      go: '🐹',
      js: '📜',
      json: '📋',
      txt: '📄',
      md: '📝',
      html: '🏠',
      css: '🎨'
    };
    return icons[ext] || '📄';
  };

  const startRename = (fileId, currentName) => {
    setRenameId(fileId);
    setRenameName(currentName);
  };

  const finishRename = (fileId) => {
    if (renameName.trim() && renameName !== files.find(f => f.id === fileId)?.name) {
      onRenameFile(fileId, renameName);
    }
    setRenameId(null);
  };

  return (
    <div className="file-tree">
      <div className="file-tree-header">
        <h3>{useEmojis ? '📁' : ''} Files</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreateFile}
          title="Create new file"
        >
          {useEmojis ? '➕' : '+'}
        </Button>
      </div>

      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${activeFile === file.id ? 'active' : ''}`}
          >
            {renameId === file.id ? (
              <input
                type="text"
                className="file-rename-input"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                onBlur={() => finishRename(file.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') finishRename(file.id);
                  if (e.key === 'Escape') setRenameId(null);
                }}
                autoFocus
              />
            ) : (
              <>
                <div
                  className="file-item-content"
                  onClick={() => onSelectFile(file.id)}
                  onDoubleClick={() => startRename(file.id, file.name)}
                >
                  <span className="file-icon">
                    {useEmojis ? getFileIcon(file.name) : ''}
                  </span>
                  <span className="file-name">{file.name}</span>
                  {file.unsaved && <span className="unsaved-indicator">●</span>}
                </div>

                <div className="file-actions">
                  <button
                    className="action-btn delete"
                    onClick={() => onDeleteFile(file.id)}
                    title="Delete file"
                  >
                    {useEmojis ? '🗑️' : '✕'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="empty-state">
          <p>{useEmojis ? '📁 ' : ''}No files yet</p>
          <p className="hint">Click + to create one</p>
        </div>
      )}
    </div>
  );
};

export default FileTree;
