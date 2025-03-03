import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./AccountSidebar.module.css";
import StoreContext from "@/store/StoreContext";
import { observer } from "mobx-react-lite";

const AccountSidebar = observer(({ isAuthenticated, isOpen, onClose }) => {
  const rootStore = useContext(StoreContext);
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose}></div>}
      <div className={`${styles.accountSidebar} ${isOpen ? styles.open : ""}`}>
        <button className={styles.closeSidebar} onClick={onClose}>✖</button>
          <Link to="/profile" className={styles.accountLink}>Личная информация</Link>
          <Link to="/favorites" className={styles.accountLink}>Избранное</Link>
          <Link to="/loyalty-program" className={styles.accountLink}>Программа лояльности</Link>
          <Link to="/payment-card" className={styles.accountLink}>Карта для оплаты</Link>
          <Link to="/order-history" className={styles.accountLink}>История покупок</Link>
          <button className={styles.logoutButton} onClick={async () => { await rootStore.authStore.logout(); onClose(); }}>Выйти</button>
      </div>
    </>
  );
});

export default AccountSidebar;
