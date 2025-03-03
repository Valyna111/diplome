import React, { useState } from "react";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Данные пользователя (заглушка)
  const [userData, setUserData] = useState({
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+7 999 123-45-67",
    login: "ivan123",
    birthdate: "1995-06-15",
  });

  // Копия данных при редактировании
  const [editableData, setEditableData] = useState({ ...userData });

  // Обработчик изменения полей
  const handleChange = (e) => {
    setEditableData({ ...editableData, [e.target.name]: e.target.value });
  };

  // Сохранение данных
  const handleSave = () => {
    setUserData(editableData);
    setIsEditing(false);
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
              name="name"
              value={editableData.name}
              onChange={handleChange}
              className={styles.input}
            />
          ) : (
            <p className={styles.text}>{userData.name}</p>
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
            <p className={styles.text}>{userData.email}</p>
          )}
        </div>

        <div className={styles.infoBlock}>
          <label className={styles.label}>Телефон:</label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={editableData.phone}
              onChange={handleChange}
              className={styles.input}
            />
          ) : (
            <p className={styles.text}>{userData.phone}</p>
          )}
        </div>

        <div className={styles.infoBlock}>
          <label className={styles.label}>Логин:</label>
          <p className={styles.text}>{userData.login} (нельзя изменить)</p>
        </div>

        <div className={styles.infoBlock}>
          <label className={styles.label}>Дата рождения:</label>
          <p className={styles.text}>{userData.birthdate} (нельзя изменить)</p>
        </div>

        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={styles.button}
        >
          {isEditing ? "Сохранить" : "Редактировать"}
        </button>
      </div>

      {/* Правая часть: место для дополнительного контента */}
      <div className={styles.sideSection}>
        <p>Здесь может быть дополнительный контент.</p>
      </div>
    </div>
  );
};

export default UserProfile;