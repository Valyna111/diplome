import React, {useCallback, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {FaHeart, FaRegHeart, FaShoppingCart} from "react-icons/fa";
import styles from "./ProductCard.module.css";
import classNames from "classnames";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";

const ProductCard = observer(({
                                  id, // Добавляем id товара для перенаправления
                                  image,
                                  title,
                                  description,
                                  price,
                                  onToggleFavorite,
                                  isFavorite,
                                  className,
                                  withDiscount,
                                  discountPercentage
                              }) => {
    const rootStore = useContext(StoreContext);
    const navigate = useNavigate();

    // Обработчик клика по карточке
    const handleCardClick = () => {
        navigate(`/main/catalog/${id}`); // Перенаправляем на страницу товара
    };

    // Останавливаем всплытие события для кнопок
    const handleButtonClick = (e, callback) => {
        e.stopPropagation();
        if (callback) callback();
    };

    const calculateDiscountedPrice = (price) => {
        const priceNumber = typeof price === "string" ? parseFloat(price.replace(/\D/g, '')) : price;
        return (priceNumber * (1 - (0.01 * discountPercentage))).toFixed(2);
    };

    const formattedPrice = typeof price === "number" ? price.toFixed(2) : parseFloat(price).toFixed(2);
    const discountedPrice = calculateDiscountedPrice(price);

    const onAddToCart = useCallback(() => {
        if (!rootStore.authStore.currentUser) {
            rootStore.authStore.setIsModalLogin(true);
        } else {

        }
    }, []);
    return (
        <div
            className={classNames(styles.card, className)}
            onClick={handleCardClick}
            style={{cursor: "pointer"}} // Добавляем указатель при наведении
        >
            {/* Кнопка "Избранное" */}
            <button
                className={styles.favoriteButton}
                onClick={(e) => handleButtonClick(e, onToggleFavorite)}
            >
                {isFavorite ? <FaHeart className={styles.favoriteIconActive}/> :
                    <FaRegHeart className={styles.favoriteIcon}/>}
            </button>

            {/* Изображение товара */}
            <div className={styles.imageContainer}>
                <img src={`http://localhost:4000${image}`} alt={title} className={styles.image}/>
                {withDiscount && <div className={styles.discountBadge}>-{discountPercentage}%</div>}
            </div>

            {/* Информация о товаре */}
            <div className={styles.content}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>

                <div className={styles.priceContainer}>
                    {withDiscount ? (
                        <>
                            <span className={styles.originalPrice}>{formattedPrice} руб.</span>
                            <span className={styles.discountedPrice}>{discountedPrice} руб.</span>
                        </>
                    ) : (
                        <span className={styles.price}>{formattedPrice} руб.</span>
                    )}
                </div>
            </div>

            {/* Иконка корзины */}
            <button
                className={styles.cartButton}
                onClick={(e) => handleButtonClick(e, onAddToCart)}
            >
                <FaShoppingCart className={styles.cartIcon}/>
            </button>
        </div>
    );
});

export default ProductCard;