import React from 'react';
import '../../styles/components/CodeEditorTabs.css';

const CodeEditorTabs = ({
  openFiles,
  activeFile,
  onSelectFile,
  onCloseFile,
  unsavedFiles
}) => {
  return (
    <div className="code-editor-tabs">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={`tab ${activeFile === file.id ? 'active' : ''}`}
          onClick={() => onSelectFile(file.id)}
        >
          <span className="tab-name">
            {file.name}
            {unsavedFiles?.includes(file.id) && <span className="unsaved">●</span>}
          </span>
          <button
            className="tab-close"
            onClick={(e) => {
              e.stopPropagation();
              onCloseFile(file.id);
            }}
            title="Close file"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default CodeEditorTabs;
