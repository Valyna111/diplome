import Input from '@/components/Form/Input/Input';
import Modal from '@/components/Modal/Modal';
import { observer } from 'mobx-react-lite';
import { useContext, useState, useEffect } from 'react';
import StoreContext from '@/store/StoreContext';
import s from './Auth.module.css';

const ModalChangePassword = observer(() => {
    const rootStore = useContext(StoreContext);
    const authStore = rootStore.authStore;

    const [state, setState] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        errors: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            general: '',
        },
    });

    // Сбрасываем состояние формы при каждом открытии модального окна
    useEffect(() => {
        if (authStore.isModalChangePassword) {
            setState({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                errors: {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    general: '',
                },
            });
        }
    }, [authStore.isModalChangePassword]);

    const validateFields = () => {
        const { currentPassword, newPassword, confirmPassword } = state;
        const errors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        };

        let isValid = true;

        if (!currentPassword) {
            errors.currentPassword = 'Поле обязательно для заполнения';
            isValid = false;
        }

        if (!newPassword) {
            errors.newPassword = 'Поле обязательно для заполнения';
            isValid = false;
        } else if (newPassword.length < 6) {
            errors.newPassword = 'Пароль должен содержать минимум 6 символов';
            isValid = false;
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Поле обязательно для заполнения';
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Пароли не совпадают';
            isValid = false;
        }

        setState((prev) => ({ ...prev, errors }));
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prev) => ({
            ...prev,
            [name]: value,
            errors: {
                ...prev.errors,
                [name]: '',
            },
        }));
    };

    const handleSubmit = async () => {
        const isFormValid = validateFields();

        if (!isFormValid) {
            return;
        }

        try {
            await authStore.changePassword(state.currentPassword, state.newPassword);
            authStore.setIsModalChangePassword(false);
        } catch (error) {
            setState((prev) => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    general: error.message,
                },
            }));
        }
    };

    return (
        <Modal
            title="Смена пароля"
            isOpen={authStore.isModalChangePassword}
            onClose={() => authStore.setIsModalChangePassword(false)}
            onSubmit={handleSubmit}
            width="320px"
            action_text_submit="Сменить пароль"
            footer={s.footer}
            isOverlay={false}
        >
            <p className={s.changePasswordText}>Для продолжения работы необходимо сменить пароль</p>
            <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                onChange={handleChange}
                value={state.currentPassword}
                placeholder="Текущий пароль"
                iconPosition="left"
                error={!!state.errors.currentPassword}
                errorMessage={state.errors.currentPassword}
            />
            <Input
                id="newPassword"
                name="newPassword"
                type="password"
                onChange={handleChange}
                value={state.newPassword}
                placeholder="Новый пароль"
                iconPosition="left"
                error={!!state.errors.newPassword}
                errorMessage={state.errors.newPassword}
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
                <div className={s.errorMessage}>{state.errors.general}</div>
            )}
        </Modal>
    );
});

export default ModalChangePassword; 