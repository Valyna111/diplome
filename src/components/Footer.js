import React from "react";
import styles from "./Footer.module.css";
import { FaInstagram, FaFacebook, FaTelegram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Лого и описание */}
        <div className={styles.branding}>
          <h2 className={styles.logo}>FlowerShop</h2>
          <p>Лучшие свежие цветы с доставкой по Минску.</p>
        </div>
        
        {/* Контактная информация */}
        <div className={styles.contactInfo}>
          <p>📍 г. Минск, ул. Цветочная, 10</p>
          <p>📞 +375 (29) 123-45-67</p>
          <p>📧 info@flowershop.by</p>
          <p>🕒 Пн-Вс 9:00 - 21:00</p>
        </div>

        {/* Социальные сети */}
        <div className={styles.socials}>
          <a href="#" className={styles.icon}><FaInstagram /></a>
          <a href="#" className={styles.icon}><FaFacebook /></a>
          <a href="#" className={styles.icon}><FaTelegram /></a>
          <a href="#" className={styles.icon}><FaWhatsapp /></a>
        </div>
      </div>

      {/* Подписка на рассылку */}
      <div className={styles.newsletter}>
        <input type="email" placeholder="Введите ваш email" className={styles.input} />
        <button className={styles.subscribeButton}>Подписаться</button>
      </div>

      {/* Авторские права */}
      <p className={styles.copyright}>© 2024 FlowerShop. Все права защищены.</p>
    </footer>
  );
};

export default Footer;
