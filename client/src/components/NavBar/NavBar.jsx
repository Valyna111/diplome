import React, { useState, useEffect, useContext } from "react";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import AccountSidebar from "@/components/AccountSidebar/AccountSidebar";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";

const Navbar = observer(() => {
  const rootStore = useContext(StoreContext);

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

  return (
    <>
      {/* Затемнение при открытии меню */}
      {/* {menuOpen && (
        <div className={`${styles.overlay} active`} onClick={() => setMenuOpen(false)}></div>
      )} */}

      <nav className={styles.navbar}>
        {/* Логотип */}
        <div className={styles.logo}>FlowerShop</div>

        {/* Меню */}
        <p className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
          <Link to="/" className={styles.link} onClick={() => setMenuOpen(false)}>Главная</Link>
          <Link to="/catalog" className={styles.link} onClick={() => setMenuOpen(false)}>Каталог</Link>
          <Link to="/article" className={styles.link} onClick={() => setMenuOpen(false)}>Полезные статьи</Link>
          <Link to="/polici" className={styles.link} onClick={() => setMenuOpen(false)}>Политика</Link>
        </p>

        {/* Иконки корзины и аккаунта */}
        <div className={styles.icons}>
          <FaShoppingCart className={styles.icon} onClick={() => navigate("/cart")}/>
          <FaUser 
            className={styles.icon} 
            onClick={() => rootStore.authStore?.currentUser ? setAccountMenuOpen(!accountMenuOpen) : rootStore.authStore.setIsModalLogin(true)}
          />
        </div>

        {/* Бургер-кнопка */}
        <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Sidebar для аккаунта */}
      <AccountSidebar
        isOpen={accountMenuOpen} 
        onClose={() => setAccountMenuOpen(false)} 
      />
    </>
  );
});

export default Navbar;
