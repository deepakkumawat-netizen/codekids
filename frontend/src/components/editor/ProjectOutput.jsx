import React, { useEffect, useRef } from 'react';
import Button from '../common/Button';
import '../../styles/components/ProjectOutput.css';

const ProjectOutput = ({ output, isRunning, grade, useEmojis }) => {
  const outputRef = useRef(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleClear = () => {
    // This would need to be passed as a prop from parent
    // For now, we just provide the button
  };

  // Parse output to detect errors
  const isError = output.toLowerCase().includes('error') ||
                  output.toLowerCase().includes('traceback');

  return (
    <div className="project-output">
      <div className="output-header">
        <h4>{useEmojis ? '📤 ' : ''}Output</h4>
        <div className="output-controls">
          {isRunning && (
            <span className="running-indicator">
              <span className="spinner"></span>
              Running...
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={!output}
          >
            {useEmojis ? '🗑️' : 'Clear'}
          </Button>
        </div>
      </div>

      <div
        ref={outputRef}
        className={`output-content ${isError ? 'error' : 'success'}`}
      >
        {output ? (
          output.split('\n').map((line, i) => (
            <div key={i} className="output-line">
              <span className="line-number">{i + 1}</span>
              <span className="line-content">{line}</span>
            </div>
          ))
        ) : (
          <div className="output-empty">
            <p>{useEmojis ? '▶️ ' : ''}Click Run to see output</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectOutput;
