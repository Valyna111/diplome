import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from "react";
import StoreContext from "@/store/StoreContext";
import s from './Bouquet.module.css';
import {useParams} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import {FaChevronDown, FaChevronUp, FaMinus, FaPlus, FaShoppingCart} from "react-icons/fa";
import ArticlesComp from "@/components/ArticlesComp/ArticlesComp";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import {toast} from "react-toastify";
import { useQuery, gql } from '@apollo/client';
import { Card, Image, Button, InputNumber, Rate, Divider, Empty, List, Tooltip } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, StarFilled } from '@ant-design/icons';
import { Comment } from '@ant-design/compatible';

const GET_BOUQUET = gql`
    query GetBouquet($id: Int!) {
        bouquetById(id: $id) {
            id
            name
            price
            description
            image
            sale
            feedbacksByBouquetId {
                nodes {
                    userByUserId {
                        surname
                        username
                        email
                        roleByRoleId {
                            name
                        }
                    }
                    score
                    text
                    refId
                    createdAt
                }
            }
        }
    }
`;

const Bouquet = observer(() => {
    const rootStore = useContext(StoreContext);
    const {id} = useParams();
    const [bouquet, setBouquet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [zoomImage, setZoomImage] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showComponents, setShowComponents] = useState(false);
    const [showAddons, setShowAddons] = useState(false);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);
    const { data, loading: queryLoading, error: queryError } = useQuery(GET_BOUQUET, {
        variables: { id: parseInt(id) }
    });

    // Получаем максимально доступное количество из BouquetStore
    const availableAmount = rootStore.bouquetStore.getAvailableQuantity(parseInt(id));
    console.log(availableAmount);
    // Дополнения к букету (можно получать из API)
    const availableAddons = [
        {id: 1, name: "Воздушные шары (+500 руб.)", price: 500},
        {id: 2, name: "Открытка (+100 руб.)", price: 100},
        {id: 3, name: "Шоколад (+300 руб.)", price: 300},
        {id: 4, name: "Мягкая игрушка (+800 руб.)", price: 800}
    ];

    useEffect(() => {
        if (!id) {
            setError("Номер товара не указан");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        rootStore.bouquetStore.getBouquet(parseInt(id))
            .then((result) => {
                setBouquet(result);
                setCurrentImage(result.image);

                // Проверяем, есть ли товар уже в корзине
                const cartItem = rootStore.authStore.cart.find(item => item.bouquet.id === parseInt(id));
                setCartQuantity(cartItem?.quantity || 0);
                setQuantity(cartItem ? Math.max(1, cartItem.quantity) : 1);
            })
            .catch((err) => {
                console.error("Ошибка загрузки:", err);
                setError("Не удалось загрузить данные товара");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, rootStore.bouquetStore, rootStore.authStore.cart]);

    const handleImageChange = (newImage) => {
        setCurrentImage(newImage);
    };

    const toggleZoom = () => {
        setZoomImage(!zoomImage);
    };

    const increaseQuantity = () => {
        if (!bouquet) return;

        const totalInCart = cartQuantity + quantity;
        if (totalInCart >= availableAmount) {
            toast.error(`Доступно только ${availableAmount - cartQuantity} шт. для добавления`);
            return;
        }

        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    const toggleAddon = (addon) => {
        setSelectedAddons(prev =>
            prev.some(item => item.id === addon.id)
                ? prev.filter(item => item.id !== addon.id)
                : [...prev, addon]
        );
    };

    const addToCart = async () => {
        if (!bouquet) return;

        const totalQuantity = cartQuantity + quantity;
        if (totalQuantity > availableAmount) {
            toast.error(`Максимально доступное количество: ${availableAmount} шт. (уже в корзине: ${cartQuantity} шт.)`);
            return;
        }

        setIsAddingToCart(true);
        try {
            await rootStore.authStore.syncCart([{
                bouquetId: bouquet.id,
                quantity: totalQuantity,
                operation: 'update'
            }]);

            toast.success(
                cartQuantity > 0
                    ? `Количество обновлено: ${totalQuantity} шт. в корзине`
                    : `${bouquet.name} добавлен в корзину!`
            );

            // Обновляем количество в корзине после успешного добавления
            setCartQuantity(totalQuantity);
            setQuantity(1);
        } catch (error) {
            console.error("Ошибка при добавлении в корзину:", error);
            toast.error("Не удалось добавить товар в корзину");
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (queryLoading) return <div className={s.loading}>Загрузка...</div>;
    if (queryError) return <div className={s.error}>{queryError.message}</div>;

    const { bouquetById: queryBouquet } = data;
    const feedback = queryBouquet.feedbacksByBouquetId?.nodes || [];
    const rating = feedback.length > 0 
        ? feedback.reduce((sum, item) => sum + item.score, 0) / feedback.length 
        : 0;
    const feedbackCount = feedback.length;

    if (loading) {
        return (
            <div className={s.fullscreenLoader}>
                <div className={s.loaderContent}>
                    <div className={s.spinner}></div>
                    <p>Загрузка данных...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={s.fullscreenError}>
                <div className={s.errorContent}>
                    <h2>Ошибка</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Попробовать снова</button>
                </div>
            </div>
        );
    }

    if (!bouquet) {
        return (
            <div className={s.fullscreenError}>
                <div className={s.errorContent}>
                    <h2>Товар не найден</h2>
                    <p>Товар с номером {id} не существует</p>
                </div>
            </div>
        );
    }

    const totalPrice = bouquet.price + selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    const availableToAdd = availableAmount - cartQuantity;
    const maxQuantity = Math.min(availableToAdd, availableAmount);

    return (
        <div className={s.page}>
            <div className={s.productContainer}>
                <div className={s.imageGallery}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImage}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.3}}
                            className={s.mainImageContainer}
                            onClick={toggleZoom}
                        >
                            <img
                                src={`http://localhost:4000${currentImage}`}
                                alt="Основное изображение"
                                className={s.mainImage}
                            />
                        </motion.div>
                    </AnimatePresence>

                    <div className={s.thumbnailContainer}>
                        {[bouquet.image, bouquet.secondImage].filter(Boolean).map((img, index) => (
                            <motion.img
                                key={index}
                                src={`http://localhost:4000${img}`}
                                alt={`Изображение ${index + 1}`}
                                className={`${s.thumbnail} ${currentImage === img ? s.activeThumbnail : ''}`}
                                onClick={() => handleImageChange(img)}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                transition={{type: "spring", stiffness: 400, damping: 17}}
                            />
                        ))}
                    </div>
                </div>

                <div className={s.productInfo}>
                    <h1 className={s.productTitle}>{bouquet.name}</h1>
                    <div className={s.productDescription}>
                        <p>{bouquet.description}</p>
                    </div>

                    <div className={s.availability}>
                        {availableAmount > 0 ? (
                            <>
                                <span className={s.inStock}>В наличии: {availableAmount} шт.</span><br></br>
                                {cartQuantity > 0 && (
                                    <span className={s.inCart}>Уже в корзине: {cartQuantity} шт.</span>
                                )}
                            </>
                        ) : (
                            <span className={s.outOfStock}>Нет в наличии</span>
                        )}
                    </div>

                    <div className={s.dropdownSection}>
                        <button
                            className={s.dropdownHeader}
                            onClick={() => setShowComponents(!showComponents)}
                        >
                            <span>Состав букета</span>
                            {showComponents ? <FaChevronUp/> : <FaChevronDown/>}
                        </button>
                        <AnimatePresence>
                            {showComponents && (
                                <motion.div
                                    initial={{height: 0, opacity: 0}}
                                    animate={{height: 'auto', opacity: 1}}
                                    exit={{height: 0, opacity: 0}}
                                    transition={{duration: 0.3}}
                                    className={s.dropdownContent}
                                >
                                    <ul className={s.componentsList}>
                                        {bouquet.itemsInBouquetsByBouquetId?.nodes?.map((item, index) => (
                                            <li key={index}>
                                                {item.itemByItemId.name} - {item.amount} шт.
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className={s.dropdownSection}>
                        <button
                            className={s.dropdownHeader}
                            onClick={() => setShowAddons(!showAddons)}
                        >
                            <span>Дополнить букет</span>
                            {showAddons ? <FaChevronUp/> : <FaChevronDown/>}
                        </button>
                        <AnimatePresence>
                            {showAddons && (
                                <motion.div
                                    initial={{height: 0, opacity: 0}}
                                    animate={{height: 'auto', opacity: 1}}
                                    exit={{height: 0, opacity: 0}}
                                    transition={{duration: 0.3}}
                                    className={s.dropdownContent}
                                >
                                    <ul className={s.addonsList}>
                                        {availableAddons.map(addon => (
                                            <li key={addon.id}>
                                                <label className={s.addonItem}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedAddons.some(item => item.id === addon.id)}
                                                        onChange={() => toggleAddon(addon)}
                                                    />
                                                    <span>{addon.name}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className={s.priceContainer}>
                        <span className={s.price}>{totalPrice} руб.</span>
                        {selectedAddons.length > 0 && (
                            <div className={s.priceBreakdown}>
                                <span className={s.basePrice}>({bouquet.price} руб. за букет)</span>
                                <span className={s.addonsPrice}>
                                    + {selectedAddons.reduce((sum, addon) => sum + addon.price, 0)} руб. за дополнения
                                </span>
                            </div>
                        )}
                    </div>

                    <div className={s.actionsContainer}>
                        <div className={s.quantitySelector}>
                            <button
                                onClick={decreaseQuantity}
                                className={s.quantityButton}
                                disabled={quantity <= 1}
                            >
                                <FaMinus/>
                            </button>
                            <span className={s.quantityValue}>{quantity}</span>
                            <button
                                onClick={increaseQuantity}
                                className={s.quantityButton}
                                disabled={quantity >= maxQuantity}
                            >
                                <FaPlus/>
                            </button>
                        </div>

                        <button
                            className={s.addToCartButton}
                            onClick={addToCart}
                            disabled={isAddingToCart || availableAmount <= 0 || availableToAdd <= 0}
                        >
                            <FaShoppingCart className={s.cartIcon}/>
                            {isAddingToCart
                                ? 'Добавляем...'
                                : cartQuantity > 0
                                    ? 'Добавить ещё'
                                    : 'Добавить в корзину'}
                        </button>
                    </div>
                </div>
            </div>
            <ArticlesComp/>
            <CategoryCard title='Отличное дополнение:' data={rootStore.bouquetStore.bouquets}/>
            <AnimatePresence>
                {zoomImage && (
                    <motion.div
                        className={s.zoomOverlay}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        onClick={toggleZoom}
                    >
                        <motion.img
                            src={`http://localhost:4000${currentImage}`}
                            alt="Увеличенное изображение"
                            className={s.zoomedImage}
                            initial={{scale: 0.9}}
                            animate={{scale: 1}}
                            exit={{scale: 0.9}}
                            transition={{type: "spring", stiffness: 300}}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className={s.feedbackSection}>
                <h2>Отзывы {feedbackCount > 0 && <span className={s.ratingInfo}>
                    <Rate 
                        disabled 
                        value={rating} 
                        character={<StarFilled style={{ color: '#e91e63' }} />}
                    />
                    <span className={s.ratingValue}>({rating.toFixed(1)})</span>
                </span>}</h2>
                {feedbackCount > 0 ? (
                    <List
                        className={s.feedbackList}
                        itemLayout="horizontal"
                        dataSource={feedback}
                        renderItem={item => (
                            <List.Item>
                                <Comment
                                    author={
                                        <span className={s.author}>
                                            {item.userByUserId.surname} {item.userByUserId.username}
                                            {item.userByUserId.roleByRoleId?.name === 'admin' && 
                                                <span className={s.adminBadge}>Администратор</span>
                                            }
                                        </span>
                                    }
                                    avatar={
                                        <div className={s.avatarPlaceholder}>
                                            {item.userByUserId.username[0].toUpperCase()}
                                        </div>
                                    }
                                    content={
                                        <div>
                                            <Rate 
                                                disabled 
                                                value={item.score} 
                                                character={<StarFilled style={{ color: '#e91e63' }} />}
                                            />
                                            <p className={s.feedbackText}>{item.text}</p>
                                        </div>
                                    }
                                    datetime={
                                        <Tooltip title={new Date(item.createdAt).toLocaleString()}>
                                            <span>{formatDate(item.createdAt)}</span>
                                        </Tooltip>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Пока нет отзывов"
                    />
                )}
            </div>
        </div>
    );
});

// Вспомогательная функция для форматирования даты
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Меньше 24 часов
    if (diff < 24 * 60 * 60 * 1000) {
        if (diff < 60 * 60 * 1000) {
            const minutes = Math.floor(diff / (60 * 1000));
            return `${minutes} ${getDeclension(minutes, ['минуту', 'минуты', 'минут'])} назад`;
        }
        const hours = Math.floor(diff / (60 * 60 * 1000));
        return `${hours} ${getDeclension(hours, ['час', 'часа', 'часов'])} назад`;
    }
    
    // Меньше недели
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        return `${days} ${getDeclension(days, ['день', 'дня', 'дней'])} назад`;
    }
    
    // Более недели
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// Вспомогательная функция для склонения слов
const getDeclension = (number, words) => {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

export default Bouquet;