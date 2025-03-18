import React, { useState, useEffect } from "react";
import styles from "./DeliveryDriver.module.css";

const DeliveryDriver = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  // Загрузка данных о доставках
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch("http://localhost:4000/driver/deliveries", {
          credentials: "include", // Для отправки куки (если требуется аутентификация)
        });

        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных о доставках");
        }

        const data = await response.json();
        setDeliveries(data.deliveries);

        // Рассчет общего заработка
        const earnings = data.deliveries.reduce((total, delivery) => {
          return total + delivery.earnings;
        }, 0);
        setTotalEarnings(earnings);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мои доставки</h1>

      {/* Общий заработок */}
      <div className={styles.earnings}>
        <h2>Общий заработок: {totalEarnings.toFixed(2)} ₽</h2>
      </div>

      {/* Список доставок */}
      <div className={styles.deliveriesList}>
        {deliveries.map((delivery) => (
          <div key={delivery.id} className={styles.deliveryCard}>
            <h3>Заказ #{delivery.orderId}</h3>
            <p>
              <strong>Дата заказа:</strong> {new Date(delivery.orderDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Адрес доставки:</strong> {delivery.customerAddress}
            </p>
            <p>
              <strong>Стоимость заказа:</strong> {delivery.orderPrice} ₽
            </p>
            <p>
              <strong>Заработано:</strong> {delivery.earnings.toFixed(2)} ₽
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryDriver;