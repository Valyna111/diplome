import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Input from '@/components/Form/Input/Input';
import Modal from '@/components/Modal/Modal';
import s from './ResetPassword.module.css';
import StoreContext from '@/store/StoreContext';

const ResetPassword = observer(() => {
    const { authStore } = useContext(StoreContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [state, setState] = useState({
        password: '',
        confirmPassword: '',
        errors: {
            password: '',
            confirmPassword: '',
            general: '',
        },
    });

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    const validateFields = () => {
        const { password, confirmPassword } = state;
        const errors = {
            password: '',
            confirmPassword: '',
        };

        let isValid = true;

        if (!password) {
            errors.password = 'Поле обязательно для заполнения';
            isValid = false;
        } else if (password.length < 6) {
            errors.password = 'Пароль должен содержать минимум 6 символов';
            isValid = false;
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Поле обязательно для заполнения';
            isValid = false;
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Пароли не совпадают';
            isValid = false;
        }

        setState((prev) => ({ ...prev, errors }));
        return isValid;
    };

    const handleSubmit = async () => {
        const isFormValid = validateFields();

        if (!isFormValid) {
            return;
        }

        try {
            await authStore.resetPassword(token, state.password);
            setState((prev) => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    general: 'Пароль успешно изменен. Теперь вы можете войти с новым паролем.',
                },
            }));
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            setState((prev) => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    general: error.message || 'Произошла ошибка при сбросе пароля',
                },
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prev) => ({
            ...prev,
            [name]: value,
            errors: {
                ...prev.errors,
                [name]: '',
                general: '',
            },
        }));
    };

    return (
        <div className={s.container}>
            <Modal
                title="Сброс пароля"
                isOpen={true}
                onClose={() => navigate('/')}
                onSubmit={handleSubmit}
                width="320px"
                action_text_submit="Сбросить пароль"
                footer={s.footer}
                isOverlay={false}
            >
                <Input
                    id="password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={state.password}
                    placeholder="Новый пароль"
                    iconPosition="left"
                    error={!!state.errors.password}
                    errorMessage={state.errors.password}
                />
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    onChange={handleChange}
                    value={state.confirmPassword}
                    placeholder="Подтвердите пароль"
                    iconPosition="left"
                    error={!!state.errors.confirmPassword}
                    errorMessage={state.errors.confirmPassword}
                />
                {state.errors.general && (
                    <div className={state.errors.general.includes('успешно') ? s.successMessage : s.errorMessage}>
                        {state.errors.general}
                    </div>
                )}
            </Modal>
        </div>
    );
});

export default ResetPassword; 