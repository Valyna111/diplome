import React, {useContext, useEffect, useState} from "react";
import {FaBars, FaShoppingCart, FaTimes, FaUser} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";
import AccountSidebar from "@/components/AccountSidebar/AccountSidebar";
import styles from "./NavBar.module.css";
import SearchBar from "@/components/NavBar/SearchBar/SearchBar";

const Navbar = observer(() => {
    const rootStore = useContext(StoreContext);
    const {authStore} = rootStore;
    const [menuOpen, setMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [isCartAnimating, setIsCartAnimating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (authStore?.cart) {
            const count = authStore.cart.reduce((sum, item) => sum + item.quantity, 0);
            if (count !== cartItemsCount) {
                setIsCartAnimating(true);
                setCartItemsCount(count);
                setTimeout(() => setIsCartAnimating(false), 500);
            }
        }
    }, [authStore?.cart]);

    useEffect(() => {
        if (menuOpen || accountMenuOpen) {
            document.body.classList.add("menu-open");
        } else {
            document.body.classList.remove("menu-open");
        }
    }, [menuOpen, accountMenuOpen]);

    const handleUserIconClick = () => {
        if (!authStore?.currentUser) {
            authStore.setIsModalLogin(true);
        } else {
            setAccountMenuOpen(!accountMenuOpen);
        }
    };

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.logo}>FS</div>

                {/* Базовое меню (ТОЛЬКО для customer и гостей) */}
                {(!authStore?.currentUser || authStore.currentUser?.role_name === "customer") && (
                    <p className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
                        <Link to="/" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Главная
                        </Link>
                        <Link to="/main/catalog" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Каталог
                        </Link>
                        <Link to="/main/article" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Полезные статьи
                        </Link>
                    </p>
                )}

                {/* Меню по ролям */}
                {authStore?.currentUser && authStore.currentUser?.role_name === "manager" && (
                    <p className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
                        <Link to="/dashboard/orders" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Заказы
                        </Link>
                        <Link to="/dashboard/clientlist" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Клиенты
                        </Link>
                        <Link to="/dashboard/sales" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Продажи
                        </Link>
                        <Link to="/dashboard/promotion-constructor" className={styles.link}
                              onClick={() => setMenuOpen(false)}>
                            Редактор акций
                        </Link>
                        <Link to="/dashboard/article-constructor" className={styles.link}
                              onClick={() => setMenuOpen(false)}>
                            Редактор статей
                        </Link>
                    </p>
                )}

                {authStore?.currentUser && authStore.currentUser?.role_name === "dboperator" && (
                    <p className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
                        <Link to="/dboperations/item-input" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Конструктор букетов
                        </Link>
                        <Link to="/dboperations/ocp-input" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Заполнение пунктов сбора заказов
                        </Link>
                        <Link to="/dboperations/user-block" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Блокировка пользователей
                        </Link>
                    </p>
                )}

                {authStore?.currentUser && authStore.currentUser?.role_name === "deliveryman" && (
                    <p className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
                        <Link to="/delivery/delivery" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Доставки
                        </Link>
                        <Link to="/delivery/driver/deliveries" className={styles.link}
                              onClick={() => setMenuOpen(false)}>
                            Мои доставки
                        </Link>
                    </p>
                )}

                {authStore?.currentUser && authStore.currentUser?.role_name === "florist" && (
                    <p className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
                        <Link to="/stock/florist-orders" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Сборка заказов
                        </Link>
                        <Link to="/stock/florist-edit-stock" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Редактирование склада
                        </Link>
                    </p>
                )}

                {/* Иконки */}
                <div className={styles.icons}>
                    <SearchBar/>
                    {/* Корзина ТОЛЬКО для customer */}
                    {authStore?.currentUser && authStore.currentUser?.role_name === "customer" && (
                        <div className={styles.cartWrapper}>
                            <FaShoppingCart
                                className={styles.icon}
                                onClick={() => navigate("/user/cart")}
                            />
                            {cartItemsCount > 0 && (
                                <motion.div
                                    className={styles.cartBadge}
                                    key={cartItemsCount}
                                    initial={{scale: 0}}
                                    animate={{
                                        scale: isCartAnimating ? [1, 1.3, 1] : 1,
                                        rotate: isCartAnimating ? [0, 10, -10, 0] : 0
                                    }}
                                    transition={{duration: 0.5}}
                                >
                                    {cartItemsCount}
                                </motion.div>
                            )}
                        </div>
                    )}
                    <FaUser
                        className={styles.icon}
                        onClick={handleUserIconClick}
                    />
                </div>

                {/* Бургер-кнопка */}
                <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes/> : <FaBars/>}
                </button>
            </nav>

            {/* Sidebar для аккаунта */}
            <AccountSidebar
                isOpen={accountMenuOpen}
                onClose={() => setAccountMenuOpen(false)}
                isAuthenticated={authStore?.currentUser}
                userRole={authStore.currentUser?.role_name}
                onLogout={() => {
                    authStore.logout();
                }}
            />
        </>
    );
});

export default Navbar;