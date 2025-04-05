import React, {useContext, useEffect, useState} from "react";
import styles from "./UserProfile.module.css";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";
import Button from "@/components/Form/Button/Button";

const UserProfile = observer(() => {
    const rootStore = useContext(StoreContext);
    const {authStore} = rootStore;
    const user = authStore.currentUser;
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState(user);

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

            {/* Правая часть: место для дополнительного контента */}
            <div className={styles.sideSection}>
                <p>Здесь может быть дополнительный контент.</p>
            </div>
        </div>
    );
});

export default UserProfile;