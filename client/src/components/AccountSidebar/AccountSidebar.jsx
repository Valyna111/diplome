import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AccountSidebar.module.css";
import { observer } from "mobx-react-lite";

const AccountSidebar = observer(({ isAuthenticated, userRole, isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Вызываем функцию выхода
    navigate("/"); // Перенаправляем на главную страницу
    onClose(); // Закрываем сайдбар
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose}></div>}
      <div className={`${styles.accountSidebar} ${isOpen ? styles.open : ""}`}>
        <button className={styles.closeSidebar} onClick={onClose}>✖</button>

        {/* Если пользователь залогинен и является Customer */}
        {isAuthenticated && userRole === "customer" && (
          <>
            <Link to="/profile" className={styles.accountLink} onClick={onClose}>
              Личная информация
            </Link>
            <Link to="/favorites" className={styles.accountLink} onClick={onClose}>
              Избранное
            </Link>
            <Link to="/loyalty-program" className={styles.accountLink} onClick={onClose}>
              Программа лояльности
            </Link>
            <Link to="/payment-card" className={styles.accountLink} onClick={onClose}>
              Карта для оплаты
            </Link>
            <Link to="/order-history" className={styles.accountLink} onClick={onClose}>
              История покупок
            </Link>
          </>
        )}

        {/* Если пользователь залогинен, но не Customer */}
        {isAuthenticated && userRole !== "customer" && (
          <p className={styles.accountLink}>Добро пожаловать, {userRole}!</p>
        )}

        {/* Кнопка "Выйти" для всех авторизованных пользователей */}
        {isAuthenticated && (
          <button className={styles.logoutButton} onClick={handleLogout}>
            Выйти
          </button>
        )}

        {/* Если пользователь не авторизован */}
        {!isAuthenticated && (
          <>
            <button className={styles.authButton} onClick={() => navigate("/login")}>
              Войти
            </button>
            <button className={styles.authButton} onClick={() => navigate("/register")}>
              Зарегистрироваться
            </button>
          </>
        )}
      </div>
    </>
  );
});

export default AccountSidebar;