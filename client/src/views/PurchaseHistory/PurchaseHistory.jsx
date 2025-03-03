import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard/ProductCard"; // Импортируем готовый компонент
import styles from "./PurchaseHistory.module.css";

const PurchaseHistory = ({ loggedInUserId }) => {
  // Состояние для хранения заказов
  const [orders, setOrders] = useState([]);

  // Загрузка данных о заказах (например, из API)
  useEffect(() => {
    // Пример данных заказов
    const mockOrders = [
      {
        id: 1,
        userId: 1, // ID залогиненного пользователя
        products: [
          {
            id: 101,
            image: "/images/product1.jpg",
            title: "Product 1",
            description: "Описание товара 1",
            price: 29.99,
          },
          {
            id: 102,
            image: "/images/product2.jpg",
            title: "Product 2",
            description: "Описание товара 2",
            price: 49.99,
          },
        ],
        date: "2023-10-01",
      },
      {
        id: 2,
        userId: 2, // Другой пользователь
        products: [
          {
            id: 103,
            image: "/images/product3.jpg",
            title: "Product 3",
            description: "Описание товара 3",
            price: 19.99,
          },
        ],
        date: "2023-10-02",
      },
      {
        id: 3,
        userId: 1, // ID залогиненного пользователя
        products: [
          {
            id: 104,
            image: "/images/product4.jpg",
            title: "Product 4",
            description: "Описание товара 4",
            price: 99.99,
          },
          {
            id: 105,
            image: "/images/product5.jpg",
            title: "Product 5",
            description: "Описание товара 5",
            price: 59.99,
          },
        ],
        date: "2023-10-03",
      },
    ];

    // Фильтруем заказы по ID пользователя
    const userOrders = mockOrders.filter((order) => order.userId === loggedInUserId);
    setOrders(userOrders);
  }, [loggedInUserId]);

  // Обработчики для кнопок (можно добавить логику)
  const handleAddToCart = (productId) => {
    console.log(`Товар с ID ${productId} добавлен в корзину`);
  };

  const handleToggleFavorite = (productId) => {
    console.log(`Товар с ID ${productId} добавлен/удален из избранного`);
  };

  return (
    <div className={styles.container}>
      <h1>История покупок</h1>

      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className={styles.order}>
            <h2>Заказ от {order.date}</h2>
            <div className={styles.productList}>
              {order.products.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  onAddToCart={() => handleAddToCart(product.id)}
                  onToggleFavorite={() => handleToggleFavorite(product.id)}
                  isFavorite={false} // Можно добавить логику для избранного
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>У вас пока нет заказов.</p>
      )}
    </div>
  );
};

export default PurchaseHistory;