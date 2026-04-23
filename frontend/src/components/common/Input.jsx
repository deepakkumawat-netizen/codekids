/**
 * Input Component
 * Reusable text input with label, error states, and icon support
 */

import React from 'react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  disabled = false,
  icon = null,          // Icon element (left side)
  helperText,
  required = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const inputClass = [
    'input-wrapper',
    fullWidth && 'input-full-width',
  ]
    .filter(Boolean)
    .join(' ');

  const fieldClass = [
    'input-field',
    error && 'input-error',
    disabled && 'input-disabled',
    icon && 'input-with-icon',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={inputClass}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className={fieldClass}>
        {icon && <span className="input-icon-left">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
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
        />
      </div>

      {error && (
        <span className="input-error-text" id={`${label}-error`}>
          {error}
        </span>
      )}

      {helperText && !error && (
        <span className="input-helper-text" id={`${label}-helper`}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
