import React, { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";
import styles from "./ArticlePage.module.css";
import { ArrowLeft } from "lucide-react";

const ArticlePage = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auxiliaryStore } = useContext(StoreContext);

    useEffect(() => {
        if (id) {
            auxiliaryStore.loadArticleById(parseInt(id));
        }
    }, [id]);

    const handleBackClick = () => {
        navigate(-1);
    };

    if (auxiliaryStore.isLoading) {
        return (
            <div className={styles.articlePage}>
                <div className={styles.loading}>Загрузка статьи...</div>
            </div>
        );
    }

    if (auxiliaryStore.error) {
        return (
            <div className={styles.articlePage}>
                <div className={styles.error}>
                    Ошибка при загрузке статьи: {auxiliaryStore.error.message}
                </div>
            </div>
        );
    }

    const article = auxiliaryStore.currentArticle;

    if (!article) {
        return (
            <div className={styles.articlePage}>
                <div className={styles.error}>Статья не найдена</div>
            </div>
        );
    }

    return (
        <div className={styles.articlePage}>
            <button className={styles.backButton} onClick={handleBackClick}>
                <ArrowLeft size={20} />
                Назад к статьям
            </button>

            <h1 className={styles.title}>{article.header}</h1>

            <div className={styles.articleBlocks}>
                {article.articleBlocksByArticleId.nodes.map((block, index) => (
                    <div key={block.id} className={styles.block}>
                        {block.image && (
                            <img
                                src={`http://localhost:4000${block.image}`}
                                alt={`Изображение ${index + 1}`}
                                className={styles.blockImage}
                            />
                        )}
                        {block.text && (
                            <p className={styles.blockText}>{block.text}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

export default ArticlePage;
