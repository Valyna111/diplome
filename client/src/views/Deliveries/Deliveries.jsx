import React, { useState } from "react";
import styles from "./Deliveries.module.css";

const DeliveriesPage = () => {
  // Пример данных о доставках
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      date: "2023-10-25",
      address: "ул. Ленина, д. 10, кв. 5",
      contact: "+7 999 123-45-67",
      status: "available", // available, taken, rejected
    },
    {
      id: 2,
      date: "2023-10-26",
      address: "пр. Мира, д. 15, офис 20",
      contact: "+7 999 765-43-21",
      status: "available",
    },
    {
      id: 3,
      date: "2023-10-27",
      address: "ул. Пушкина, д. 3, подъезд 2",
      contact: "+7 999 111-22-33",
      status: "available",
    },
    {
      id: 4,
      date: "2023-10-28",
      address: "ул. Гагарина, д. 7, кв. 12",
      contact: "+7 999 222-33-44",
      status: "available",
    },
    {
      id: 5,
      date: "2023-10-29",
      address: "ул. Садовая, д. 20, офис 5",
      contact: "+7 999 555-66-77",
      status: "available",
    },
  ]);

  // Обработчик для кнопки "Взять доставку"
  const handleTakeDelivery = (id) => {
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === id ? { ...delivery, status: "taken" } : delivery
      )
    );
    alert(`Вы взяли доставку #${id}`);
  };

  // Обработчик для кнопки "Отказаться"
  const handleRejectDelivery = (id) => {
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === id ? { ...delivery, status: "rejected" } : delivery
      )
    );
    alert(`Вы отказались от доставки #${id}`);
  };

  return (
    <div className={styles.container}>
      <h1>Доступные доставки</h1>

      <div className={styles.deliveriesGrid}>
        {deliveries.map((delivery) => (
          <div key={delivery.id} className={styles.deliveryCard}>
            <div className={styles.deliveryInfo}>
              <p><strong>Дата:</strong> {delivery.date}</p>
              <p><strong>Адрес:</strong> {delivery.address}</p>
              <p><strong>Контакт:</strong> {delivery.contact}</p>
            </div>

            <div className={styles.buttons}>
              {delivery.status === "available" && (
                <>
                  <button
                    className={styles.takeButton}
                    onClick={() => handleTakeDelivery(delivery.id)}
                  >
                    Взять доставку
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => handleRejectDelivery(delivery.id)}
                  >
                    Отказаться
                  </button>
                </>
              )}

              {delivery.status === "taken" && (
                <p className={styles.statusMessage}>Вы взяли эту доставку</p>
              )}

              {delivery.status === "rejected" && (
                <p className={styles.statusMessage}>Вы отказались от этой доставки</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveriesPage;