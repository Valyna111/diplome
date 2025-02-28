import React from "react";
import styles from "../styles/ArticlePage.module.css";
import Slider1 from '@/assets/images/slider1.jpg';
import Slider2 from '@/assets/images/slider2.jpg';
import Slider3 from '@/assets/images/slider3.jpg';
const Article = () => {
  return (
    <>
    <div className={styles.articlePage}>
      
      {/* Заголовок статьи */}
      <h1 className={styles.articleTitle}>Как продлить жизнь букета</h1>

      {/* 🔹 Первый блок с текстом и изображением */}
      <div className={styles.section}>
        <img src={Slider1} alt="Букет" />
        <div className={styles.textContainer}>
          <h2>Обрезка стеблей</h2>
          <p>Перед тем как поставить букет в вазу, подрежьте стебли под углом 45 градусов...</p>
        </div>
      </div>

      {/* 🔹 Второй блок (зеркальный) */}
      <div className={`${styles.section} ${styles.reverse}`}>
        <img src={Slider2} alt="Чистая вода" />
        <div className={styles.textContainer}>
          <h2>Чистая вода</h2>
          <p>Меняйте воду каждые два дня и промывайте вазу, чтобы предотвратить размножение бактерий.</p>
        </div>
      </div>

      {/* 🔹 Третий блок (обычный) */}
      <div className={styles.section}>
        <img src={Slider3} alt="Оптимальная температура" />
        <div className={styles.textContainer}>
          <h2>Оптимальная температура</h2>
          <p>Избегайте прямых солнечных лучей и сквозняков, чтобы цветы не увядали раньше времени.</p>
        </div>
      </div>
      
    </div>
    </>
  );
};

export default Article;
