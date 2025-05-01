import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Input from '@/components/Form/Input/Input';
import Modal from '@/components/Modal/Modal';
import s from './Auth.module.css';
import StoreContext from '@/store/StoreContext';

const ModalForgotPassword = observer(() => {
    const { authStore } = useContext(StoreContext);
    const [state, setState] = useState({
        email: '',
        errors: {
            email: '',
            general: '',
        },
    });

    // Сбрасываем состояние формы при каждом открытии модального окна
    useEffect(() => {
        if (authStore.isModalForgotPassword) {
            setState({
                email: '',
                errors: {
                    email: '',
                    general: '',
                },
            });
        }
    }, [authStore.isModalForgotPassword]);

    const validateFields = () => {
        const { email } = state;
        const errors = {
            email: '',
        };

        let isValid = true;

        if (!email) {
            errors.email = 'Поле обязательно для заполнения';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Введите корректный email';
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
            await authStore.forgotPassword(state.email);
            setState((prev) => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    general: 'Инструкции по восстановлению пароля отправлены на ваш email',
                },
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    general: error.message || 'Произошла ошибка при отправке запроса',
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
        <Modal
            title="Восстановление пароля"
            isOpen={authStore.isModalForgotPassword}
            onClose={() => authStore.setIsModalForgotPassword(false)}
            onSubmit={handleSubmit}
            width="320px"
            action_text_submit="Отправить"
            footer={s.footer}
            isOverlay={false}
        >
            <Input
                id="email"
                name="email"
                onChange={handleChange}
                value={state.email}
                placeholder="Email"
                iconPosition="left"
                error={!!state.errors.email}
                errorMessage={state.errors.email}
            />
            {state.errors.general && (
                <div className={state.errors.general.includes('отправлены') ? s.successMessage : s.errorMessage}>
                    {state.errors.general}
                </div>
            )}
            <span
                className="link"
                onClick={() => {
                    authStore.setIsModalForgotPassword(false);
                    authStore.setIsModalLogin(true);
                }}
            >
                Вернуться к входу
            </span>
        </Modal>
    );
});

export default ModalForgotPassword; 