import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from "react";
import StoreContext from "@/store/StoreContext";
import s from './Bouquet.module.css';
import {useParams} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import {FaChevronDown, FaChevronUp, FaMinus, FaPlus, FaShoppingCart} from "react-icons/fa";
import ArticlesComp from "@/components/ArticlesComp/ArticlesComp";
import CategoryCard from "@/components/CategoryCard/CategoryCard";

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
            })
            .catch((err) => {
                console.error("Ошибка загрузки:", err);
                setError("Не удалось загрузить данные товара");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, rootStore.bouquetStore]);

    const handleImageChange = (newImage) => {
        setCurrentImage(newImage);
    };

    const toggleZoom = () => {
        setZoomImage(!zoomImage);
    };

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const toggleAddon = (addon) => {
        setSelectedAddons(prev =>
            prev.some(item => item.id === addon.id)
                ? prev.filter(item => item.id !== addon.id)
                : [...prev, addon]
        );
    };

    const addToCart = () => {
        if (!bouquet) return;

        const totalPrice = bouquet.amount * quantity +
            selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

        const cartItem = {
            id: bouquet.id,
            name: bouquet.name,
            image: bouquet.image,
            price: bouquet.price,
            quantity,
            addons: selectedAddons,
            totalPrice
        };

        rootStore.cartStore.addToCart(cartItem);
        // Можно добавить уведомление об успешном добавлении
    };

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

                    {/* Выпадающий список компонентов букета */}
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

                    {/* Выпадающий список дополнений */}
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
                        <span className={s.price}>{bouquet.amount} руб.</span>
                        {selectedAddons.length > 0 && (
                            <div className={s.addonsPrice}>
                                + {selectedAddons.reduce((sum, addon) => sum + addon.price, 0)} руб. за дополнения
                            </div>
                        )}
                    </div>

                    <div className={s.actionsContainer}>
                        <div className={s.quantitySelector}>
                            <button onClick={decreaseQuantity} className={s.quantityButton}>
                                <FaMinus/>
                            </button>
                            <span className={s.quantityValue}>{quantity}</span>
                            <button onClick={increaseQuantity} className={s.quantityButton}>
                                <FaPlus/>
                            </button>
                        </div>

                        <button
                            className={s.addToCartButton}
                            onClick={addToCart}
                        >
                            <FaShoppingCart className={s.cartIcon}/>
                            Добавить в корзину
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
        </div>
    );
});

export default Bouquet;