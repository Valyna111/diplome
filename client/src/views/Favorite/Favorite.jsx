import React, { useState } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./Favorite.module.css"; // Импортируем стили

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const productsPerPage = 6; // Количество товаров на странице

  const toggleFavorite = (product) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some((fav) => fav.id === product.id);
      if (isAlreadyFavorite) {
        return prevFavorites.filter((fav) => fav.id !== product.id);
      } else {
        return [...prevFavorites, product];
      }
    });
  };

  const products = [
    { id: 1, image: "image1.jpg", title: "Товар 1", description: "Описание товара 1", price: 1000 },
    { id: 2, image: "image2.jpg", title: "Товар 2", description: "Описание товара 2", price: 2000 },
    { id: 3, image: "image3.jpg", title: "Товар 3", description: "Описание товара 3", price: 3000 },
    { id: 4, image: "image4.jpg", title: "Товар 4", description: "Описание товара 4", price: 4000 },
    { id: 5, image: "image5.jpg", title: "Товар 5", description: "Описание товара 5", price: 5000 },
    { id: 6, image: "image6.jpg", title: "Товар 6", description: "Описание товара 6", price: 6000 },
    { id: 7, image: "image7.jpg", title: "Товар 7", description: "Описание товара 7", price: 7000 },
    { id: 8, image: "image8.jpg", title: "Товар 8", description: "Описание товара 8", price: 8000 },
    { id: 9, image: "image9.jpg", title: "Товар 9", description: "Описание товара 9", price: 9000 },
    { id: 10, image: "image10.jpg", title: "Товар 10", description: "Описание товара 10", price: 10000 },
  ];

  // Вычисляем индексы для текущей страницы
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Функция для переключения страниц
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Избранное</h1>
      <div className={styles.productsFlex}>
        {favorites.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <ProductCard
              image={product.image}
              title={product.title}
              description={product.description}
              price={product.price}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(product)}
              onAddToCart={() => console.log("Добавлено в корзину")}
            />
          </div>
        ))}
      </div>

 

      {/* Пагинация */}
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? styles.activePage : styles.pageButton}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;