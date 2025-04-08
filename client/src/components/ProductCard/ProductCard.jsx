import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaHeart, FaMinus, FaPlus, FaRegHeart, FaShoppingCart, FaTrash} from "react-icons/fa";
import {AnimatePresence, motion} from "framer-motion";
import styles from "./ProductCard.module.css";
import classNames from "classnames";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";

const ProductCard = observer(({
                                  id,
                                  image,
                                  title,
                                  description,
                                  price,
                                  className,
                                  discountPercentage,
                                  compactView = false,
                                  showRemoveButton = false,
                                  onRemove,
                                  showQuantityControls = true
                              }) => {
    const rootStore = useContext(StoreContext);
    const navigate = useNavigate();
    const [isAnimating, setIsAnimating] = useState(false);
    const [isCartAnimating, setIsCartAnimating] = useState(false);

    const handleCardClick = () => {
        navigate(`/main/catalog/${id}`);
    };

    const handleButtonClick = async (e, callback) => {
        e.stopPropagation();
        if (callback) await callback();
    };

    const calculateDiscountedPrice = (price) => {
        const priceNumber = typeof price === "string" ? parseFloat(price.replace(/\D/g, '')) : price;
        return (priceNumber * (1 - (0.01 * discountPercentage))).toFixed(2);
    };

    const formattedPrice = typeof price === "number" ? price.toFixed(2) : parseFloat(price).toFixed(2);
    const discountedPrice = calculateDiscountedPrice(price);

    const isFavorite = rootStore.authStore.isInWishlist(id);
    const cartItem = rootStore.authStore.cart.find(item => item.bouquet.id === id);
    const itemCount = cartItem?.quantity || 0;

    const handleCartAction = async (newQuantity) => {
        setIsCartAnimating(true);
        try {
            await rootStore.authStore.syncCart([{
                bouquetId: id,
                quantity: newQuantity,
                operation: newQuantity === 0 ? 'delete' : 'update'
            }]);
        } finally {
            setTimeout(() => setIsCartAnimating(false), 300);
        }
    };

    const handleFavoriteToggle = async () => {
        setIsAnimating(true);
        try {
            await rootStore.authStore.toggleWishlistItem(id);
        } finally {
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (onRemove) onRemove(id);
    };

    return (
        <motion.div
            className={classNames(styles.card, className, {
                [styles.compact]: compactView
            })}
            onClick={handleCardClick}
            whileHover={!compactView ? {y: -4, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'} : {}}
            transition={{duration: 0.2}}
        >
            {!compactView && (
                <button
                    className={styles.favoriteButton}
                    onClick={(e) => handleButtonClick(e, handleFavoriteToggle)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isFavorite ? "filled" : "outlined"}
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{
                                scale: isAnimating ? [1, 1.2, 1] : 1,
                                opacity: 1
                            }}
                            exit={{scale: 0.8, opacity: 0}}
                            transition={{duration: 0.3}}
                        >
                            {isFavorite ? (
                                <FaHeart className={styles.favoriteIconActive}/>
                            ) : (
                                <FaRegHeart className={styles.favoriteIcon}/>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </button>
            )}

            <div className={classNames(styles.imageContainer, {
                [styles.compactImage]: compactView
            })}>
                <img src={`http://localhost:4000${image}`} alt={title} className={styles.image}/>
                {discountPercentage !== 0 && <div className={styles.discountBadge}>-{discountPercentage}%</div>}
            </div>

            <div className={styles.content}>
                <h2 className={classNames(styles.title, {
                    [styles.compactTitle]: compactView
                })}>{title}</h2>

                {!compactView && (
                    <p className={styles.description}>{description}</p>
                )}

                <div className={styles.footer}>
                    <div className={styles.priceContainer}>
                        {discountPercentage !== 0 ? (
                            <>
                                {!compactView && (
                                    <span className={styles.originalPrice}>{formattedPrice} руб.</span>
                                )}
                                <span className={styles.discountedPrice}>{discountedPrice} руб.</span>
                            </>
                        ) : (
                            <span className={styles.price}>{formattedPrice} руб.</span>
                        )}
                    </div>

                    {showRemoveButton ? (
                        <button
                            className={styles.removeButton}
                            onClick={handleRemove}
                        >
                            <FaTrash/>
                        </button>
                    ) : showQuantityControls ? (
                        <div className={styles.cartContainer}>
                            {itemCount > 0 ? (
                                <motion.div
                                    className={styles.quantityControls}
                                    initial={{opacity: 0}}
                                    animate={{
                                        opacity: 1,
                                        scale: isCartAnimating ? [1, 1.1, 1] : 1
                                    }}
                                    transition={{duration: 0.2}}
                                >
                                    <button
                                        className={styles.quantityButton}
                                        onClick={(e) => handleButtonClick(e, () => handleCartAction(itemCount - 1))}
                                    >
                                        <FaMinus/>
                                    </button>
                                    <span className={styles.quantity}>{itemCount}</span>
                                    <button
                                        className={styles.quantityButton}
                                        onClick={(e) => handleButtonClick(e, () => handleCartAction(itemCount + 1))}
                                    >
                                        <FaPlus/>
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    className={styles.cartButton}
                                    onClick={(e) => handleButtonClick(e, () => handleCartAction(1))}
                                    whileTap={{scale: 0.9}}
                                >
                                    <FaShoppingCart className={styles.cartIcon}/>
                                </motion.button>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </motion.div>
    );
});

export default ProductCard;