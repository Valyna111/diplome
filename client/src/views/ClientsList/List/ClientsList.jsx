import React, { useState } from "react";
import styles from "./ClientsList.module.css";

const ClientsList = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Иван Иванов", bonus: 100, comments: [{ id: 101, text: "Отличный сервис!", reply: "Спасибо!" }] },
    { id: 2, name: "Мария Петрова", bonus: 200, comments: [{ id: 102, text: "Не понравилось", reply: "Мы исправимся!" }] },
    { id: 3, name: "Алексей Сидоров", bonus: 50, comments: [{ id: 103, text: "Супер магазин!", reply: "Спасибо за отзыв!" }] }
  ]);

  const handleBonusChange = (id, newBonus) => {
    setUsers(users.map(user => user.id === id ? { ...user, bonus: newBonus } : user));
  };

  const handleBonusSubmit = (id, bonus) => {
    console.log(`Бонус для пользователя ${id} обновлен до ${bonus}`);
  };

  const handleReplySubmit = (id, reply) => {
    setUsers(users.map(user => ({
      ...user,
      comments: user.comments.map(comment =>
        comment.id === id ? { ...comment, reply } : comment
      )
    })));
    console.log(`Ответ на комментарий ${id}: ${reply}`);
  };

  return (
    <div className={styles.container}>
      <h2>Управление пользователями</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Бонусы</th>
            <th>Комментарии</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <input
                  type="number"
                  value={user.bonus}
                  className={styles.input}
                  onChange={e => handleBonusChange(user.id, e.target.value)}
                />
                <button
                  className={styles.button}
                  onClick={() => handleBonusSubmit(user.id, user.bonus)}
                >
                  Обновить
                </button>
              </td>
              <td>
                {user.comments.map(comment => (
                  <div key={comment.id} className={styles.commentBlock}>
                    <p className={styles.commentText}>{comment.text}</p>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Ответить..."
                      onChange={e => comment.replyText = e.target.value}
                    />
                    <button
                      className={styles.button}
                      onClick={() => handleReplySubmit(comment.id, comment.replyText)}
                    >
                      Ответить
                    </button>
                    {comment.reply && <p>Ответ: {comment.reply}</p>}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsList;
