import React, { useState } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import { FaTrash } from "react-icons/fa";
import styles from "./CartPage.module.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: "/images/product1.jpg",
      title: "Product 1",
      description: "Описание товара 1",
      price: 29.99,
      quantity: 1,
    },
    {
      id: 2,
      image: "/images/product2.jpg",
      title: "Product 2",
      description: "Описание товара 2",
      price: 49.99,
      quantity: 2,
    },
    {
      id: 3,
      image: "/images/product3.jpg",
      title: "Product 3",
      description: "Описание товара 3",
      price: 19.99,
      quantity: 1,
    },
    {
      id: 4,
      image: "/images/product3.jpg",
      title: "Product 3",
      description: "Описание товара 3",
      price: 19.99,
      quantity: 1,
    },
    {
      id:5,
      image: "/images/product3.jpg",
      title: "Product 3",
      description: "Описание товара 3",
      price: 19.99,
      quantity: 1,
    },
    {
      id: 6,
      image: "/images/product3.jpg",
      title: "Product 3",
      description: "Описание товара 3",
      price: 19.99,
      quantity: 1,
    },
  ]);

  const handleClearCart = () => setCartItems([]);
  const handleRemoveItem = (id) => setCartItems((prev) => prev.filter((item) => item.id !== id));
  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Корзина</h1>
        <button className={styles.clearButton} onClick={handleClearCart}>
          Очистить корзину
        </button>
      </div>

      <div className={styles.cartItems}>
        {cartItems.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <ProductCard
              image={item.image}
              title={item.title}
              description={item.description}
              price={item.price}
              onAddToCart={() => {}}
              onToggleFavorite={() => {}}
              isFavorite={false}
            />
            <div className={styles.controls}>
              <button className={styles.removeButton} onClick={() => handleRemoveItem(item.id)}>
                <FaTrash />
              </button>
              <div className={styles.counter}>
                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.totalPrice}>Итого: {totalPrice.toFixed(2)} руб.</div>
        <button className={styles.checkoutButton}>Оформить покупку</button>
      </div>
    </div>
  );
};

export default CartPage;