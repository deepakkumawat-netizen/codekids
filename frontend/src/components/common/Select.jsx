/**
 * Select Component
 * Reusable dropdown select with label, error states, and option groups
 */

import React from 'react';
import './Select.css';

const Select = ({
  label,
  options = [],           // Array of {value, label} or strings
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  disabled = false,
  helperText,
  required = false,
  fullWidth = false,
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  // Normalize options to {value, label} format
  const normalizedOptions = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectClass = [
    'select-wrapper',
    fullWidth && 'select-full-width',
  ]
    .filter(Boolean)
    .join(' ');

  const fieldClass = [
    'select-field',
    error && 'select-error',
    disabled && 'select-disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={selectClass}>
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}

      <div className={fieldClass}>
        <select
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          aria-label={label || placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : helperText ? `${label}-helper` : undefined}
          className={className}
          {...props}
        >
          {placeholder && !value && (
            <option value="">{placeholder}</option>
          )}
          {normalizedOptions.map((opt, idx) => (
            <option key={`${opt.value}-${idx}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="select-icon">▼</span>
      </div>

      {error && (
        <span className="select-error-text" id={`${label}-error`}>
          {error}
        </span>
      )}

      {helperText && !error && (
        <span className="select-helper-text" id={`${label}-helper`}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Select;
