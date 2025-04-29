import React, {useContext, useEffect, useState} from "react";
import styles from "./UserProfile.module.css";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";
import Button from "@/components/Form/Button/Button";
import Input from '@/components/Form/Input/Input';

const UserProfile = observer(() => {
    const rootStore = useContext(StoreContext);
    const {authStore} = rootStore;
    const user = authStore.currentUser;
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState(user);

    const [passwordState, setPasswordState] = useState({
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

    const [isPasswordChanging, setIsPasswordChanging] = useState(false);

    useEffect(() => {
        setEditableData(user);
    }, [user]);

    // Обработчик изменения полей
    const handleChange = (e) => {
        setEditableData({...editableData, [e.target.name]: e.target.value});
    };

    // Сохранение данных
    const handleSave = async () => {
        try {

            await authStore.updateUser(user.id, editableData);
            setIsEditing(false);
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const validatePasswordFields = () => {
        const { currentPassword, newPassword, confirmPassword } = passwordState;
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

        setPasswordState((prev) => ({ ...prev, errors }));
        return isValid;
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordState((prev) => ({
            ...prev,
            [name]: value,
            errors: {
                ...prev.errors,
                [name]: '',
            },
        }));
    };

    const handlePasswordSubmit = async () => {
        const isFormValid = validatePasswordFields();

        if (!isFormValid) {
            return;
        }

        try {
            await authStore.changePassword(
                passwordState.currentPassword,
                passwordState.newPassword
            );
            setPasswordState({
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
            setIsPasswordChanging(false);
        } catch (error) {
            setPasswordState((prev) => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    general: error.message,
                },
            }));
        }
    };

    return (
        <div className={styles.container}>
            {/* Левая часть: информация о пользователе */}
            <div className={styles.profileSection}>
                <h2 className={styles.title}>Личная информация</h2>

                <div className={styles.infoBlock}>
                    <label className={styles.label}>Имя:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="username"
                            value={editableData.username}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    ) : (
                        <p className={styles.text}>{user?.username}</p>
                    )}
                </div>

                <div className={styles.infoBlock}>
                    <label className={styles.label}>Фамилия:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="surname"
                            value={editableData.surname}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    ) : (
                        <p className={styles.text}>{user?.surname}</p>
                    )}
                </div>

                <div className={styles.infoBlock}>
                    <label className={styles.label}>Email:</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={editableData.email}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    ) : (
                        <p className={styles.text}>{user?.email}</p>
                    )}
                </div>

                <div className={styles.infoBlock}>
                    <label className={styles.label}>Телефон:</label>
                    {isEditing ? (
                        <input
                            type="tel"
                            name="phone"
                            value={editableData?.phone}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    ) : (
                        <p className={styles.text}>{user?.phone}</p>
                    )}
                </div>

                <div className={styles.infoBlock}>
                    <label className={styles.label}>Домашний адрес:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="address"
                            value={editableData?.address}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    ) : (
                        <p className={styles.text}>{user?.address}</p>
                    )}
                </div>

                <div className={styles.infoBlock}>
                    <label className={styles.label}>Дата рождения:</label>
                    {isEditing && !user?.date_of_birth ? (
                        <input
                            type="date"
                            name="date_of_birth"
                            value={editableData.date_of_birth}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    ) : (
                        <p className={styles.text}>
                            {user?.date_of_birth
                                ? new Date(user.date_of_birth).toISOString().split("T")[0]
                                : "Дата рождения не указана"}
                        </p>

                    )}
                </div>
                <Button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    placeholder={isEditing ? "Сохранить" : "Редактировать"}
                    style={{
                        width: "100%"
                    }}
                />
            </div>

            {/* Секция смены пароля */}
            <div className={styles.section}>
                <h2>Смена пароля</h2>
                {isPasswordChanging ? (
                    <div className={styles.passwordForm}>
                        <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            onChange={handlePasswordChange}
                            value={passwordState.currentPassword}
                            placeholder="Текущий пароль"
                            iconPosition="left"
                            error={!!passwordState.errors.currentPassword}
                            errorMessage={passwordState.errors.currentPassword}
                        />
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            onChange={handlePasswordChange}
                            value={passwordState.newPassword}
                            placeholder="Новый пароль"
                            iconPosition="left"
                            error={!!passwordState.errors.newPassword}
                            errorMessage={passwordState.errors.newPassword}
                        />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            onChange={handlePasswordChange}
                            value={passwordState.confirmPassword}
                            placeholder="Подтвердите пароль"
                            iconPosition="left"
                            error={!!passwordState.errors.confirmPassword}
                            errorMessage={passwordState.errors.confirmPassword}
                        />
                        {passwordState.errors.general && (
                            <div className={styles.errorMessage}>{passwordState.errors.general}</div>
                        )}
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => {
                                    setIsPasswordChanging(false);
                                    setPasswordState({
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
                                }}
                            >
                                Отмена
                            </button>
                            <button
                                className={styles.saveButton}
                                onClick={handlePasswordSubmit}
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className={styles.changePasswordButton}
                        onClick={() => setIsPasswordChanging(true)}
                    >
                        Изменить пароль
                    </button>
                )}
            </div>

            {/* Правая часть: место для дополнительного контента */}
            <div className={styles.sideSection}>
                <p>Здесь может быть дополнительный контент.</p>
            </div>
        </div>
    );
});

export default UserProfile;