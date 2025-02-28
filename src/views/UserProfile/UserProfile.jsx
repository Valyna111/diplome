import React, { useState } from "react";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Данные пользователя (пока заглушка, потом заменишь API-запрос)
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
    <div className={styles.profileContainer}>
      <h2>Личная информация</h2>
      
      <div className={styles.infoBlock}>
        <label>Имя:</label>
        {isEditing ? (
          <input type="text" name="name" value={editableData.name} onChange={handleChange} />
        ) : (
          <p>{userData.name}</p>
        )}
      </div>

      <div className={styles.infoBlock}>
        <label>Email:</label>
        {isEditing ? (
          <input type="email" name="email" value={editableData.email} onChange={handleChange} />
        ) : (
          <p>{userData.email}</p>
        )}
      </div>

      <div className={styles.infoBlock}>
        <label>Телефон:</label>
        {isEditing ? (
          <input type="tel" name="phone" value={editableData.phone} onChange={handleChange} />
        ) : (
          <p>{userData.phone}</p>
        )}
      </div>

      <div className={styles.infoBlock}>
        <label>Логин:</label>
        <p>{userData.login} (нельзя изменить)</p>
      </div>

      <div className={styles.infoBlock}>
        <label>Дата рождения:</label>
        <p>{userData.birthdate} (нельзя изменить)</p>
      </div>

      <button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
        {isEditing ? "Сохранить" : "Редактировать"}
      </button>
    </div>
  );
};

export default UserProfile;
