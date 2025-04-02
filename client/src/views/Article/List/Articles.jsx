import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/article.module.css";

const articles = [
  {
    id: 1,
    image: "/images/slider1.jpg",
    title: "Как продлить жизнь букета",
    description: "Простые советы, как сохранить свежесть цветов дольше.",
    link: "/main/article/1"
  },
  {
    id: 2,
    image: "/images/slider2.jpg",
    title: "Как ухаживать за цветами в горшке",
    description: "Какие растения требуют особого ухода и как за ними следить.",
    link: "/article/2"
  },
  {
    id: 3,
    image: "/images/slider3.jpg",
    title: "Как правильно обрезать цветы",
    description: "Какие стебли стоит подрезать и как это делать правильно.",
    link: "/article/3"
  },
  {
    id: 4,
    image: "/images/slider1.jpg",
    title: "Почему важно менять воду в вазе",
    description: "Чем может навредить застоявшаяся вода и как часто её менять.",
    link: "/article/4"
  },
  {
    id: 5,
    image: "/images/slider2.jpg",
    title: "Лучшие удобрения для комнатных растений",
    description: "Какие удобрения нужны цветам для роста и цветения.",
    link: "/article/5"
  },
  {
    id: 6,
    image: "/images/slider3.jpg",
    title: "Какие цветы нельзя ставить рядом",
    description: "Некоторые цветы плохо уживаются друг с другом – узнайте какие.",
    link: "/article/6"
  },
  {
    id: 7,
    image: "/images/slider3.jpg",
    title: "Какие цветы нельзя ставить рядом",
    description: "Некоторые цветы плохо уживаются друг с другом – узнайте какие.",
    link: "main/article/6"
  },
  {
    id: 8,
    image: "/images/slider3.jpg",
    title: "Какие цветы нельзя ставить рядом",
    description: "Некоторые цветы плохо уживаются друг с другом – узнайте какие.",
    link: "main/article/6"
  },
];

const Articles = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Вычисляем видимые статьи на текущей странице
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className={styles.articlesContainer}>
        <h2 className={styles.title}>Полезные статьи</h2>

        <div className={styles.articlesGrid}>
          {currentArticles.map((article) => (
            <div 
              key={article.id} 
              className={styles.articleCard} 
              onClick={() => navigate(article.link)}
            >
              <img src={article.image} alt={article.title} className={styles.articleImage} />
              <div className={styles.articleContent}>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <p className={styles.articleDescription}>{article.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация */}
        <div className={styles.pagination}>
          {Array.from({ length: Math.ceil(articles.length / articlesPerPage) }, (_, index) => (
            <button 
              key={index + 1} 
              className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ""}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Articles;
