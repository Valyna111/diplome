import React, { useState } from "react";
import styles from "./ClientsList.module.css";

const ClientsList = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Иван Иванов",
      bonus: 100,
      comments: [
        { id: 101, text: "Отличный сервис!", date: "2023-10-01", reply: "" },
        { id: 102, text: "Быстрая доставка.", date: "2023-10-05", reply: "" },
      ],
    },
    {
      id: 2,
      name: "Мария Петрова",
      bonus: 200,
      comments: [
        {
          id: 103,
          text: "Не понравилось качество товара.",
          date: "2023-10-02",
          reply: "",
        },
      ],
    },
    {
      id: 3,
      name: "Алексей Сидоров",
      bonus: 50,
      comments: [
        { id: 104, text: "Супер магазин!", date: "2023-10-03", reply: "" },
        { id: 105, text: "Цены немного высокие.", date: "2023-10-04", reply: "" },
      ],
    },
    {
      id: 4,
      name: "Ольга Кузнецова",
      bonus: 150,
      comments: [],
    },
  ]);

  const handleReplySubmit = (userId, commentId, reply) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              comments: user.comments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, reply }
                  : comment
              ),
            }
          : user
      )
    );
  };

  return (
    <div className={styles.container}>
      <h2>Данные клиентов</h2>
      <div className={styles.usersGrid}>
        {users.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.userInfo}>
              <h3>{user.name}</h3>
              <p>Бонусы: {user.bonus}</p>
            </div>
            <div className={styles.commentsSection}>
              <h4>Комментарии:</h4>
              {user.comments.length > 0 ? (
                user.comments.map((comment) => (
                  <div key={comment.id} className={styles.comment}>
                    <p className={styles.commentText}>{comment.text}</p>
                    <p className={styles.commentDate}>{comment.date}</p>
                    {comment.reply && (
                      <p className={styles.replyText}>Ответ: {comment.reply}</p>
                    )}
                    <div className={styles.replySection}>
                      <input
                        type="text"
                        placeholder="Ответить..."
                        className={styles.replyInput}
                        onChange={(e) =>
                          (comment.replyText = e.target.value)
                        }
                      />
                      <button
                        className={styles.replyButton}
                        onClick={() =>
                          handleReplySubmit(
                            user.id,
                            comment.id,
                            comment.replyText
                          )
                        }
                      >
                        Ответить
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Нет комментариев.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsList;