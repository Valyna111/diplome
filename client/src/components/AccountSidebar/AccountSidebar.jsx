import React from "react";
import { Link } from "react-router-dom";
import styles from "./AccountSidebar.module.css";

const AccountSidebar = ({ isAuthenticated, isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose}></div>}
      <div className={`${styles.accountSidebar} ${isOpen ? styles.open : ""}`}>
        <button className={styles.closeSidebar} onClick={onClose}>✖</button>
        {isAuthenticated ? (
          <>
            <Link to="/profile" className={styles.accountLink}>Личная информация</Link>
            <Link to="/favorites" className={styles.accountLink}>Избранное</Link>
            <Link to="/loyalty-program" className={styles.accountLink}>Программа лояльности</Link>
            <Link to="/payment-card" className={styles.accountLink}>Карта для оплаты</Link>
            <Link to="/order-history" className={styles.accountLink}>История покупок</Link>
            <Link to="/reviews" className={styles.accountLink}>Отзывы</Link>
            <button className={styles.logoutButton} onClick={() => alert("Выход")}>Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.accountLink}>Войти</Link>
            <Link to="/register" className={styles.accountLink}>Регистрация</Link>
          </>
        )}
      </div>
    </>
  );
};

export default AccountSidebar;
