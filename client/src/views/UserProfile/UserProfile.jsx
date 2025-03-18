import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    surname: "",
    birthdate: "", // Поле для даты рождения
  });
  const [editableData, setEditableData] = useState({ ...userData });

  // Загрузка данных пользователя при монтировании компонента
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:4000/profile", {
          credentials: "include", // Для отправки куки
        });

        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных пользователя");
        }

        const data = await response.json();
        setUserData(data.user);
        setEditableData(data.user);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Обработчик изменения полей
  const handleChange = (e) => {
    setEditableData({ ...editableData, [e.target.name]: e.target.value });
  };

  // Сохранение данных
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:4000/profile", {
        method: "PUT", // Используем PUT для обновления данных
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при сохранении данных");
      }

      const data = await response.json();
      setUserData(data.user); // Обновляем данные пользователя
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
            <p className={styles.text}>{userData.username}</p>
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
            <p className={styles.text}>{userData.surname}</p>
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
          <label className={styles.label}>Дата рождения:</label>
          {isEditing && !userData.birthdate ? (
            <input
              type="date"
              name="birthdate"
              value={editableData.birthdate}
              onChange={handleChange}
              className={styles.input}
            />
          ) : (
            <p className={styles.text}>
              {userData.birthdate || "Дата рождения не указана"}
            </p>
          )}
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