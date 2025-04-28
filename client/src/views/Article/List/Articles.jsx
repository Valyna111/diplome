import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";
import styles from "./Articles.module.css";

const Articles = observer(() => {
    const navigate = useNavigate();
    const { auxiliaryStore } = useContext(StoreContext);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 6;

    useEffect(() => {
        auxiliaryStore.loadArticles();
    }, []);

    // Вычисляем видимые статьи на текущей странице
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = auxiliaryStore.articles.slice(indexOfFirstArticle, indexOfLastArticle);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (auxiliaryStore.isLoading) {
        return (
            <div className={styles.articlesContainer}>
                <div className={styles.loading}>Загрузка статей...</div>
            </div>
        );
    }

    if (auxiliaryStore.error) {
        return (
            <div className={styles.articlesContainer}>
                <div className={styles.error}>Ошибка при загрузке статей: {auxiliaryStore.error.message}</div>
            </div>
        );
    }

    return (
        <div className={styles.articlesContainer}>
            <h2 className={styles.title}>Полезные статьи</h2>

            <div className={styles.articlesGrid}>
                {currentArticles.map((article) => (
                    <div 
                        key={article.id} 
                        className={styles.articleCard} 
                        onClick={() => navigate(`/main/article/${article.id}`)}
                    >
                        <img 
                            src={
                                article.articleBlocksByArticleId.nodes[0]?.image
                                    ? `http://localhost:4000${article.articleBlocksByArticleId.nodes[0].image}`
                                    : "/placeholder.jpg"
                            } 
                            alt={article.header} 
                            className={styles.articleImage} 
                        />
                        <div className={styles.articleContent}>
                            <h3 className={styles.articleTitle}>{article.header}</h3>
                            <p className={styles.articleDescription}>
                                {article.articleBlocksByArticleId.nodes[0]?.text || "Нет описания"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Пагинация */}
            {auxiliaryStore.articles.length > articlesPerPage && (
                <div className={styles.pagination}>
                    {Array.from(
                        { length: Math.ceil(auxiliaryStore.articles.length / articlesPerPage) }, 
                        (_, index) => (
                            <button 
                                key={index + 1} 
                                className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ""}`}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
});

export default Articles;
