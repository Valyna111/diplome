import React, {useContext, useEffect} from "react";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./CartPage.module.css";
import {AnimatePresence, motion} from "framer-motion";
import {FaShoppingBag, FaTrash} from "react-icons/fa";
import EmptyCart from "./EmptyCart";
import {useNavigate} from "react-router-dom";
import {IoIosArrowBack} from "react-icons/io";
import {toast} from "react-toastify";

const CartPage = observer(() => {
    const {authStore, bouquetStore} = useContext(StoreContext);
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = React.useState(false);

    useEffect(() => {
        if (authStore.currentUser) {
            authStore.getAllReleativeData(authStore.currentUser.id);
        }
    }, [authStore.currentUser]);

    const cartItems = authStore.cart || [];

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: {y: 20, opacity: 0},
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            x: -50,
            opacity: 0,
            transition: {
                duration: 0.2
            }
        }
    };

    const handleRemoveItem = async (bouquetId) => {
        try {
            setIsProcessing(true);
            await authStore.syncCart([
                {
                    bouquetId,
                    operation: "delete"
                }
            ]);
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Не удалось удалить товар из корзины");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleQuantityChange = async (bouquetId, currentQuantity, change) => {
        const item = cartItems.find(i => i.bouquet.id === bouquetId);
        if (!item) return;

        const newQuantity = currentQuantity + change;
        const availableAmount = bouquetStore.getAvailableQuantity(bouquetId);

        // Проверка минимального количества
        if (newQuantity < 1) return;

        // Проверка доступного количества
        if (newQuantity > availableAmount) {
            toast.error(`Доступно только ${availableAmount} шт. этого товара`);
            return;
        }

        try {
            setIsProcessing(true);
            await authStore.syncCart([
                {
                    bouquetId,
                    quantity: newQuantity,
                    operation: "update"
                }
            ]);
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error("Не удалось изменить количество");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClearCart = async () => {
        try {
            setIsProcessing(true);
            const updates = cartItems.map(item => ({
                bouquetId: item.bouquet.id,
                operation: "delete"
            }));
            await authStore.syncCart(updates);
            toast.success("Корзина очищена");
        } catch (error) {
            console.error("Error clearing cart:", error);
            toast.error("Не удалось очистить корзину");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCheckout = () => {
        // Проверка наличия товаров перед оформлением
        const unavailableItems = cartItems.filter(item => {
            const availableAmount = bouquetStore.getAvailableQuantity(item.bouquet.id);
            return item.quantity > availableAmount;
        });

        if (unavailableItems.length > 0) {
            toast.error("Некоторые товары недоступны в таком количестве");
            return;
        }

        navigate("/user/checkout");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.bouquet.price * item.quantity,
        0
    );

    if (!authStore.currentUser) {
        return (
            <div className={styles.emptyContainer}>
                <EmptyCart
                    title="Войдите в аккаунт"
                    description="Чтобы просмотреть корзину, пожалуйста, авторизуйтесь"
                    showLoginButton={true}
                />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <EmptyCart
                    title="Ваша корзина пуста"
                    description="Добавляйте товары в корзину, чтобы сделать заказ"
                    showContinueButton={true}
                />
            </div>
        );
    }

    const sortedCartItems = [...cartItems].sort((a, b) => b.createdAt - a.createdAt);

    return (
        <motion.div
            className={styles.container}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
        >
            <button
                className={styles.backButton}
                onClick={handleGoBack}
            >
                <IoIosArrowBack/>
            </button>
            <motion.div
                className={styles.header}
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3}}
            >
                <h1 className={styles.title}>Корзина</h1>
                <motion.button
                    className={styles.clearButton}
                    onClick={handleClearCart}
                    disabled={isProcessing}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    Очистить
                </motion.button>
            </motion.div>

            <motion.div
                className={styles.cartItems}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {sortedCartItems.map((item) => (
                        <motion.div
                            key={item.id}
                            className={styles.cartItem}
                            variants={itemVariants}
                            layout
                            exit="exit"
                        >
                            <ProductCard
                                id={item.bouquet.id}
                                image={item.bouquet.image}
                                title={item.bouquet.name}
                                description={item.bouquet.description}
                                price={item.bouquet.price}
                                compactView={true}
                                showRemoveButton={false}
                                showQuantityControls={false}
                                discountPercentage={item.bouquet.sale}
                            />
                            <motion.div className={styles.controls}>
                                <motion.button
                                    className={styles.removeButton}
                                    onClick={() => handleRemoveItem(item.bouquet.id)}
                                    disabled={isProcessing}
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                >
                                    <FaTrash/>
                                </motion.button>
                                <motion.div className={styles.counter}>
                                    <motion.button
                                        onClick={() => handleQuantityChange(item.bouquet.id, item.quantity, -1)}
                                        disabled={isProcessing || item.quantity <= 1}
                                        whileHover={{scale: 1.1}}
                                        whileTap={{scale: 0.9}}
                                    >
                                        -
                                    </motion.button>
                                    <motion.span
                                        animate={{scale: [1, 1.1, 1]}}
                                        transition={{duration: 0.2}}
                                        key={item.quantity}
                                    >
                                        {item.quantity}
                                    </motion.span>
                                    <motion.button
                                        onClick={() => handleQuantityChange(item.bouquet.id, item.quantity, 1)}
                                        disabled={isProcessing || item.quantity >= bouquetStore.getAvailableQuantity(item.bouquet.id)}
                                        whileHover={{scale: 1.1}}
                                        whileTap={{scale: 0.9}}
                                    >
                                        +
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            <motion.div
                className={styles.footer}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2}}
            >
                <div className={styles.summary}>
                    <div className={styles.totalItems}>
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)} товаров
                    </div>
                    <div className={styles.totalPrice}>
                        Итого: <span>{totalPrice.toFixed(2)} ₽</span>
                    </div>
                </div>
                <motion.button
                    className={styles.checkoutButton}
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                >
                    <FaShoppingBag/> Оформить заказ
                </motion.button>
            </motion.div>
        </motion.div>
    );
});

export default CartPage;