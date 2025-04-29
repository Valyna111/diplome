import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import StoreContext from '@/store/StoreContext';
import Input from '@/components/Form/Input/Input';
import Modal from '@/components/Modal/Modal';
import s from './Auth.module.css';

const ModalResetPassword = observer(() => {
    const rootStore = useContext(StoreContext);
    const authStore = rootStore.authStore;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            await authStore.resetPassword(password);
            setSuccess(true);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Modal
            title="Сброс пароля"
            isOpen={authStore.isModalResetPassword}
            onClose={() => {
                authStore.setIsModalResetPassword(false);
                setPassword('');
                setConfirmPassword('');
                setError('');
                setSuccess(false);
            }}
            onSubmit={handleSubmit}
            width="320px"
            action_text_submit="Сбросить пароль"
            footer={s.footer}
            isOverlay={false}
        >
            {success ? (
                <div className={s.successMessage}>
                    Пароль успешно изменен. Теперь вы можете войти с новым паролем.
                </div>
            ) : (
                <>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Новый пароль"
                        iconPosition="left"
                        error={!!error}
                        errorMessage={error}
                    />
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Подтвердите пароль"
                        iconPosition="left"
                        error={!!error}
                    />
                </>
            )}
        </Modal>
    );
});

export default ModalResetPassword; 