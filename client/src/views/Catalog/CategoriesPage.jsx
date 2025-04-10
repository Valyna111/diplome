import React from "react";
import {useParams} from "react-router-dom";
import ProductCard from "../components/ProductCard"; // Импортируем готовый компонент карточки товара
import styles from "./CategoriesPage.module.css"; // Подключаем стили для страницы

const CategoriesPage = () => {
    const {categoryId} = useParams(); // Получаем ID категории из URL

    // Временные данные для карточек товаров
    const products = [
        {
            id: 1,
            image: "https://via.placeholder.com/150",
            title: "Букет роз",
            description: "Классический букет из 25 роз",
            price: 2500,
        },
        {
            id: 2,
            image: "https://via.placeholder.com/150",
            title: "Букет тюльпанов",
            description: "Яркий букет из 15 тюльпанов",
            price: 1800,
        },
        {
            id: 3,
            image: "https://via.placeholder.com/150",
            title: "Букет пионов",
            description: "Нежный букет из 10 пионов",
            price: 3000,
        },
        {
            id: 4,
            image: "https://via.placeholder.com/150",
            title: "Букет лилий",
            description: "Элегантный букет из 7 лилий",
            price: 3500,
        },
    ];

    // Название категории (можно заменить на динамическое получение из данных)
    const categoryName = "Классические букеты";

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{categoryName}</h1>
            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        image={product.image}
                        title={product.title}
                        description={product.description}
                        price={product.price}
                        availableAmount={product.amount}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;