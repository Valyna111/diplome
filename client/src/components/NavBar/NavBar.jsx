import React, {useContext, useEffect, useState} from "react";
import {FaBars, FaShoppingCart, FaTimes, FaUser} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";
import AccountSidebar from "@/components/AccountSidebar/AccountSidebar";
import styles from "./NavBar.module.css";

const Navbar = observer(() => {
    const rootStore = useContext(StoreContext);
    const {authStore} = rootStore;
    const [menuOpen, setMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const navigate = useNavigate();

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
                <div className={styles.logo}>FlowerShop</div>

                {/* Базовое меню (ТОЛЬКО для customer и гостей) */}
                {(!authStore?.currentUser || authStore.currentUser?.role_name === "customer") && (
                    <p className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
                        <Link to="/" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Главная
                        </Link>
                        <Link to="/catalog" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Каталог
                        </Link>
                        <Link to="/article" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Полезные статьи
                        </Link>
                    </p>
                )}

                {/* Меню по ролям */}
                {authStore?.currentUser && authStore.currentUser?.role_name === "manager" && (
                    <p className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
                        <Link to="/orders" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Заказы
                        </Link>
                        <Link to="/clientlist" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Клиенты
                        </Link>
                        <Link to="/sales" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Продажи
                        </Link>
                        <Link to="/promotion-constructor" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Редактор акций
                        </Link>
                        <Link to="/article-constructor" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Редактор статей
                        </Link>
                    </p>
                )}

                {authStore?.currentUser && authStore.currentUser?.role_name === "dboperator" && (
                    <p className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
                        <Link to="/item-input" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Конструктор букетов
                        </Link>
                        <Link to="/ocp-input" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Заполнение пунктов сбора заказов
                        </Link>
                        <Link to="/user-block" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Блокировка пользователей
                        </Link>
                    </p>
                )}

                {authStore?.currentUser && authStore.currentUser?.role_name === "deliveryman" && (
                    <p className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
                        <Link to="/delivery" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Доставки
                        </Link>
                        <Link to="/driver/deliveries" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Мои доставки
                        </Link>
                    </p>
                )}

                {authStore?.currentUser && authStore.currentUser?.role_name === "florist" && (
                    <p className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
                        <Link to="/florist-orders" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Сборка заказов
                        </Link>
                        <Link to="/florist-edit-stock" className={styles.link} onClick={() => setMenuOpen(false)}>
                            Редактирование склада
                        </Link>
                    </p>
                )}

                {/* Иконки */}
                <div className={styles.icons}>
                    {/* Корзина ТОЛЬКО для customer */}
                    {authStore?.currentUser && authStore.currentUser?.role_name === "customer" && (
                        <FaShoppingCart className={styles.icon} onClick={() => navigate("/cart")}/>
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