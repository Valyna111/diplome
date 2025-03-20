import React from "react";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa"; // Добавлена иконка корзины
import styles from "./ProductCard.module.css";

const ProductCard = ({ image, title, description, price, onAddToCart, onToggleFavorite, isFavorite }) => {
  const formattedPrice = typeof price === "number" ? price.toFixed(2) : parseFloat(price).toFixed(2);

  return (
    <div className={styles.card}>
      {/* Кнопка "Избранное" */}
      <button className={styles.favoriteButton} onClick={onToggleFavorite}>
        {isFavorite ? <FaHeart className={styles.favoriteIconActive} /> : <FaRegHeart className={styles.favoriteIcon} />}
      </button>

      {/* Изображение товара */}
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
      </div>

      {/* Информация о товаре */}
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <p className={styles.price}>{formattedPrice} руб.</p>
      </div>

      {/* Иконка корзины */}
      <button className={styles.cartButton} onClick={onAddToCart}>
        <FaShoppingCart className={styles.cartIcon} />
      </button>
    </div>
  );
};

export default ProductCard;
