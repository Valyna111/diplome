import React, {useContext} from "react";
import {Link} from "react-router-dom";
import styles from "./ArticlesComp.module.css";

import Slider1 from '@/assets/images/slider1.jpg';
import Slider2 from '@/assets/images/slider2.jpg';
import Slider3 from '@/assets/images/slider3.jpg';
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";

const articles = [
    {
        id: 1,
        image: Slider1,
        title: "Как ухаживать за цветами",
        description: "Советы по уходу за срезанными цветами, чтобы они дольше радовали глаз.",
    },
    {
        id: 2,
        image: Slider2,
        title: "Как выбрать букет",
        description: "Какие цветы лучше подарить на разные случаи жизни.",
    },
    {
        id: 3,
        image: Slider3,
        title: "Значение цветов",
        description: "Что символизируют разные цветы и их оттенки.",
    }
];

const ArticlesComp = observer(() => {
    const {auxiliaryStore} = useContext(StoreContext);

    return (
        <div className={styles.articlesContainer}>
            {auxiliaryStore.articles.slice(0, 3).map((article) => (
                <div key={article.id} className={styles.articleCard}>
                    {/* 🔗 Делаем картинку и текст ссылками на страницу статьи */}
                    <Link to={`/main/article/${article.id}`} className={styles.articleLink}>
                        <img src={`http://localhost:4000${article?.image1}`} alt={article.title}
                             className={styles.articleImage}/>
                        <div className={styles.articleContent}>
                            <h3 className={styles.articleTitle}>{article?.header}</h3>
                            <p className={styles.articleDescription}>{article?.description1}</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
});

export default ArticlesComp;
