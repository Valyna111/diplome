import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./ArticlesComp.module.css";

import { observer } from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";

const ArticlesComp = observer(() => {
    const { auxiliaryStore } = useContext(StoreContext);

    useEffect(() => {
        auxiliaryStore.loadArticles();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div 
            className={styles.articlesContainer}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {auxiliaryStore.articles.slice(0, 3).map((article) => (
                <motion.div 
                    key={article.id} 
                    className={styles.articleCard}
                    variants={cardVariants}
                    whileHover={{ scale: 1.03 }}
                >
                    <Link to={`/main/article/${article.id}`} className={styles.articleLink}>
                        {article.articleBlocksByArticleId.nodes[0]?.image && (
                            <motion.img 
                                src={`http://localhost:4000${article.articleBlocksByArticleId.nodes[0].image}`} 
                                alt={article.header}
                                className={styles.articleImage}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                        <div className={styles.articleContent}>
                            <h3 className={styles.articleTitle}>{article.header}</h3>
                            {article.articleBlocksByArticleId.nodes[0]?.text && (
                                <p className={styles.articleDescription}>
                                    {article.articleBlocksByArticleId.nodes[0].text}
                                </p>
                            )}
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
});

export default ArticlesComp;
