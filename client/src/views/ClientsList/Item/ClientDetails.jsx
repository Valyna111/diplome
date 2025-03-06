import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ClientDetails.module.css"; // Подключаем стили

const API_URL = "http://localhost:3000/client"; // Серверное API

const ClientDetails = () => {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Запрос на получение данных клиента
        fetch(`${API_URL}/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setClient(data);
                setComments(data.comments || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка загрузки данных:", error);
                setError("Ошибка загрузки данных");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p className="loading">Загрузка...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="client-container">
            <h1>{client.username} {client.usersyrname}</h1>
            <p><strong>Дата рождения:</strong> {client.dateofbirth || "Не указано"}</p>
            <p><strong>Телефон:</strong> {client.phone}</p>
            <p><strong>Email:</strong> {client.email}</p>
            
            <h2>Бонусы</h2>
            <p className="bonus">Баланс: {client.bonusPoints || 0} баллов</p>

            <h2>Комментарии</h2>
            {comments.length > 0 ? (
                <ul className="comments-list">
                    {comments.map((comment, index) => (
                        <li key={index} className="comment-item">
                            <p>{comment.text}</p>
                            <small>{new Date(comment.date).toLocaleDateString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-comments">Нет комментариев</p>
            )}
        </div>
    );
};

export default ClientDetails;
