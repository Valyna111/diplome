import React, { useState } from 'react';
import classNames from 'classnames';
import { IMaskInput } from 'react-imask';
import s from './Input.module.css';

const Input = ({
  className,
  id,
  value,
  onChange,
  icon,
  iconPosition = 'left',
  onBlur,
  placeholder,
  type = 'text',
  error,
  success,
  warning,
  errorMessage,
  mask, // Проп для маски
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    if (!value) {
      setIsFocused(false);
    }
    if (onBlur) onBlur(e);
  };

  return (
    <div
      className={classNames(s.container, className, {
        [s.error]: error,
        [s.success]: success,
        [s.warning]: warning,
      })}
    >
      {icon && <div className={classNames(s.icon, s[iconPosition])}>{icon}</div>}
      {mask ? (
        <IMaskInput
          mask={mask} // Передаем маску
          id={id}
          className={s.input}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={type}
          {...props}
        />
      ) : (
        <input
          id={id}
          className={s.input}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={type}
          {...props}
        />
      )}
      <label
        htmlFor={id}
        className={classNames(s.placeholder, {
          [s.placeholderFocused]: isFocused || value,
        })}
      >
        {placeholder}
      </label>
      {errorMessage && error && <span className={s.errorMessage}>{errorMessage}</span>}
    </div>
  );
};

export default Input;