import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CatalogCategories.module.css";

const categories = [
  { id: 1, name: "Классические букеты", emoji: "🌸", link: "/category/classic" },
  { id: 2, name: "Монобукеты", emoji: "🌿", link: "/category/mono" },
  { id: 3, name: "Романтические букеты", emoji: "💖", link: "/category/romantic" },
  { id: 4, name: "Букеты в коробке", emoji: "🏡", link: "/category/box" },
  { id: 5, name: "Композиции в корзине", emoji: "🎀", link: "/category/basket" },
  { id: 6, name: "Мини-букеты и комплименты", emoji: "🌿", link: "/category/mini" },
  { id: 7, name: "Домашние растения", emoji: "🌱", link: "/category/homeplants" },
  { id: 8, name: "Эко-букеты", emoji: "🌿", link: "/category/eco" },
  { id: 9, name: "Ночные букеты", emoji: "🌙", link: "/category/night" },
  { id: 10, name: "Букеты в стеклянных вазах", emoji: "🌱", link: "/category/vase" },
];

const CatalogCategories = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.catalogContainer}>
        <h2 className={styles.title}>Выберите категорию</h2>
        <div className={styles.grid}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={styles.categoryButton}
              onClick={() => navigate(category.link)}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default CatalogCategories;
