import React from "react";
import styles from "./ArticlePage.module.css";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
const Article1 = () => {
  return (
    <>
      <Navbar />
    <div className={styles.articlePage}>
      
      {/* Заголовок статьи */}
      <h1 className={styles.articleTitle}>Как продлить жизнь букета</h1>

      {/* 🔹 Первый блок с текстом и изображением */}
      <div className={styles.section}>
        <img src="/images/slider1.jpg" alt="Букет" />
        <div className={styles.textContainer}>
          <h2>Обрезка стеблей</h2>
          <p>Перед тем как поставить букет в вазу, подрежьте стебли под углом 45 градусов...</p>
        </div>
      </div>

      {/* 🔹 Второй блок (зеркальный) */}
      <div className={`${styles.section} ${styles.reverse}`}>
        <img src="/images/slider2.jpg" alt="Чистая вода" />
        <div className={styles.textContainer}>
          <h2>Чистая вода</h2>
          <p>Меняйте воду каждые два дня и промывайте вазу, чтобы предотвратить размножение бактерий.</p>
        </div>
      </div>

      {/* 🔹 Третий блок (обычный) */}
      <div className={styles.section}>
        <img src="/images/slider3.jpg" alt="Оптимальная температура" />
        <div className={styles.textContainer}>
          <h2>Оптимальная температура</h2>
          <p>Избегайте прямых солнечных лучей и сквозняков, чтобы цветы не увядали раньше времени.</p>
        </div>
      </div>
      
    </div>
    <Footer />
    </>
  );
};

export default Article1;
