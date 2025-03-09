import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { IoIosArrowDown, IoMdCheckmark } from "react-icons/io";
import s from './Select.module.css';

const Select = ({
                    options,
                    onChange,
                    placeholder,
                    value = { label: '', value: '' }, // value теперь будет объектом { label, value }
                    errorMessage,
                    icon,
                    error,
                    success,
                    warning,
                    id,
                    className,
                    ...props
                }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [input, setInput] = useState(value.label || ''); // Отображаем label в поле ввода
    const [filteredOptions, setFilteredOptions] = useState(options);

    useEffect(() => {
        if (value && value.label) {
            setInput(value.label); // Обновляем input при изменении value
        }
    }, [value]);

    useEffect(() => {
        // Фильтрация опций при изменении input
        const filtered = options.filter(option =>
            value.label.toLowerCase() === input.toLowerCase() ? true : option.label.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [input, options]);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setTimeout(() => setIsFocused(false), 200); // Задержка для обработки клика на опцию
    };

    const handleOptionClick = (option) => {
        setInput(option.label); // Устанавливаем label в поле ввода
        onChange(option); // Передаем весь объект опции в onChange
        setIsFocused(false);
    };

    return (
        <div className={classNames(s.root)}>
            <div
                className={classNames(s.container, className, {
                    [s.error]: error,
                    [s.success]: success,
                    [s.warning]: warning,
                })}
                {...props}
            >
                {icon && <div className={classNames(s.icon)}>{icon}</div>}
                <input
                    id={id}
                    className={s.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    type={'text'}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={classNames(s.placeholder, {
                        [s.placeholderFocused]: isFocused || input,
                    })}
                >
                    {placeholder}
                </label>
                <button
                    className={classNames(s.arrowDropDown, {
                        [s.rotated]: isFocused, // Переворачиваем стрелку при открытии
                    })}
                    onClick={() => setIsFocused(!isFocused)}
                >
                    <IoIosArrowDown />
                </button>
                {errorMessage && error && !isFocused && <span className={s.errorMessage}>{errorMessage}</span>}
            </div>
            {isFocused && (
                <div className={classNames(s.options, isFocused && s.active)}>
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            className={classNames(s.option, option.label === value.label && s.checked)}
                            onClick={() => handleOptionClick(option)}
                        >
                            <span className={s.text}>{option.label}</span>
                            {option.label === value.label && <IoMdCheckmark className={s.checkIcon} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;