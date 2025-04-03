import classNames from 'classnames';
import s from './Button.module.css';

const Button = ({
                    className,
                    onClick,
                    placeholder,
                    icon,
                    id,
                    loader,
                    disabled,
                    width,
                    type = 'primary',
                    iconPosition,
                    ...props
                }) => (
    <button
        id={id}
        className={classNames(s.button, className, {
            [s.primary]: type === 'primary',
            [s.second]: type === 'second',
        })}
        onClick={onClick}
        style={{width: width}}
        disabled={disabled || loader}
        {...props}
    >
        {loader ? (
            <></>
        ) : (
            <>
                {icon && <div className={classNames(s.icon, s[iconPosition])}>{icon}</div>}
                <label
                    htmlFor={id}
                    className={classNames(s.placeholder)}
                >
                    {placeholder}
                </label>
            </>
        )}
    </button>
);

export default Button;