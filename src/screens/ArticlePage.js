import React from "react";
import { useParams } from "react-router-dom";
import styles from "./ArticlePage.module.css";

const articles = [
  { id: 1, image: "/images/slider1.jpg", title: "Как ухаживать за цветами", content: "Полный текст статьи про уход за цветами..." },
  { id: 2, image: "/images/article2.jpg", title: "Как выбрать букет", content: "Полный текст статьи про выбор букета..." },
  { id: 3, image: "/images/article3.jpg", title: "Значение цветов", content: "Полный текст статьи про значения цветов..." },
  { id: 4, image: "/images/article4.jpg", title: "Цветы и их аромат", content: "Полный текст статьи про ароматы цветов..." }
];

const ArticlePage = () => {
  const { id } = useParams();
  const article = articles.find(a => a.id === Number(id));

  if (!article) {
    return <h2>Статья не найдена</h2>;
  }

  return (
    <div className={styles.articlePage}>
      <h1 className={styles.title}>{article.title}</h1>
      <img src={article.image} alt={article.title} className={styles.image} />
      <p className={styles.content}>{article.content}</p>
    </div>
  );
};

export default ArticlePage;
