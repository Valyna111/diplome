import React, { useState } from "react";
import styles from "./FloristOrdersPage.module.css";

// Пример данных заказов
const initialOrders = [
  {
    id: 1,
    customerName: "Иван Иванов",
    status: "В сборке",
    items: [
      { id: 1, name: "Букет роз", quantity: 1, price: 2000 },
      { id: 2, name: "Открытка", quantity: 1, price: 100 },
    ],
  },
  {
    id: 2,
    customerName: "Мария Петрова",
    status: "Собран",
    items: [
      { id: 3, name: "Букет тюльпанов", quantity: 1, price: 1500 },
      { id: 4, name: "Шоколад", quantity: 1, price: 200 },
    ],
  },
];

const FloristOrdersPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Изменение статуса заказа
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className={styles.container}>
      {/* 🔹 Левая колонка (список заказов) */}
      <div className={styles.leftColumn}>
        <h2>Актуальные заказы</h2>
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div
              key={order.id}
              className={styles.orderCard}
              onClick={() => setSelectedOrder(order)}
            >
              <h3>Заказ #{order.id}</h3>
              <p>Клиент: {order.customerName}</p>
              <p>Статус: {order.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Правая колонка (детали заказа) */}
      {selectedOrder && (
        <div className={styles.rightColumn}>
          <h2>Детали заказа #{selectedOrder.id}</h2>
          <p>Клиент: {selectedOrder.customerName}</p>
          <p>Статус: {selectedOrder.status}</p>

          {/* Состав заказа */}
          <h3>Состав заказа:</h3>
          <div className={styles.itemsList}>
            {selectedOrder.items.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <p>{item.name}</p>
                <p>Количество: {item.quantity}</p>
                <p>Цена: {item.price} руб.</p>
              </div>
            ))}
          </div>

          {/* Изменение статуса */}
          <div className={styles.statusButtons}>
            <button
              className={styles.button}
              onClick={() => handleStatusChange(selectedOrder.id, "В сборке")}
              disabled={selectedOrder.status === "В сборке"}
            >
              В сборке
            </button>
            <button
              className={styles.button}
              onClick={() => handleStatusChange(selectedOrder.id, "Собран")}
              disabled={selectedOrder.status === "Собран"}
            >
              Собран
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloristOrdersPage;