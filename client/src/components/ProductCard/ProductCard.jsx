import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import styles from "./ProductCard.module.css"; 

const ProductCard = ({ image, title, description, price, onAddToCart, onToggleFavorite, isFavorite }) => {
  return (
    <div className={styles.card}>
      {/* Кнопка "Избранное" в верхнем правом углу */}
      <button className={styles.favorite} onClick={onToggleFavorite}>
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </button>
      
      <img src={image} alt={title} className={styles.image} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <p className={styles.price}>{price} руб.</p>

      <div className={styles.buttons}>
        <button className={styles.button} onClick={onAddToCart}>
          Добавить в корзину
        </button>
      </div>
    </div>
  );
};

export default ProductCard;