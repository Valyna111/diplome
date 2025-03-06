import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ClientsList.module.css"; // Подключаем стили

const ClientsList = () => {
  const [clients, setClients] = useState([]); // Данные клиентов
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Количество клиентов на странице
  const navigate = useNavigate();

  // Фейковые данные (пока нет API)
  useEffect(() => {
    const fetchData = () => {
      try {
        setTimeout(() => {
          const fakeClients = [
            { userid: 1, username: "Иван", usersyrname: "Петров" },
            { userid: 2, username: "Анна", usersyrname: "Сидорова" },
            { userid: 3, username: "Павел", usersyrname: "Иванов" },
            { userid: 4, username: "Мария", usersyrname: "Козлова" },
            { userid: 5, username: "Дмитрий", usersyrname: "Федоров" },
            { userid: 6, username: "Екатерина", usersyrname: "Зайцева" },
            { userid: 7, username: "Олег", usersyrname: "Смирнов" },
            { userid: 8, username: "Наталья", usersyrname: "Кузнецова" },
            { userid: 9, username: "Алексей", usersyrname: "Попов" },
            { userid: 10, username: "Юлия", usersyrname: "Михайлова" },
          ];
          setClients(fakeClients);
          setLoading(false);
        }, 1000); // Симуляция задержки
      } catch (err) {
        setError("Ошибка при загрузке данных");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Рассчитываем клиентов для текущей страницы
  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  // Функции для переключения страниц
  const nextPage = () => {
    if (currentPage < Math.ceil(clients.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <p className={styles.loading}>Загрузка...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.clientsContainer}>
      <h1>Список клиентов</h1>

      {/* Список клиентов */}
      <ul className={styles.clientsList}>
        {currentClients.map((client) => (
          <li
            key={client.userid}
            className={styles.clientItem}
            onClick={() => navigate(`/client/${client.userid}`)}
          >
            <span>
              {client.username} {client.usersyrname}
            </span>
          </li>
        ))}
      </ul>

      {/* Пагинация */}
      <div className={styles.pagination}>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Назад
        </button>
        <span className={styles.pageNumber}>
          Страница {currentPage} из {Math.ceil(clients.length / itemsPerPage)}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage >= Math.ceil(clients.length / itemsPerPage)}
          className={styles.paginationButton}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ClientsList;