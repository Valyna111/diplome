import React, {useContext, useEffect} from "react";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./Favorite.module.css";
import {AnimatePresence, motion} from "framer-motion";
import EmptyWishlist from "./EmptyWishlist";

const FavoritesPage = observer(() => {
    const {authStore} = useContext(StoreContext);
    const [currentPage, setCurrentPage] = React.useState(1);
    const productsPerPage = 2; // Увеличили количество товаров на странице

    useEffect(() => {
        if (authStore.currentUser) {
            authStore.getAllReleativeData(authStore.currentUser.id);
        }
    }, [authStore.currentUser]);

    const favorites = authStore.wishlist || [];
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = favorites.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(favorites.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05, // Уменьшили задержку для более плавной анимации
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: {y: 20, opacity: 0},
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3 // Уменьшили длительность анимации
            }
        }
    };

    if (!authStore.currentUser) {
        return (
            <div className={styles.emptyContainer}>
                <EmptyWishlist
                    title="Войдите в аккаунт"
                    description="Чтобы просмотреть избранные товары, пожалуйста, авторизуйтесь"
                    showLoginButton={true}
                />
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <EmptyWishlist
                    title="Список избранного пуст"
                    description="Добавляйте товары в избранное, чтобы не потерять их"
                />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.header}
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3}}
            >
                <span className={styles.title}>Избранное</span>
                <span className={styles.count}>{favorites.length} товаров</span>
            </motion.div>

            <motion.div
                className={styles.productsGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {currentProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            className={styles.productItem}
                            variants={itemVariants}
                            layout
                            exit={{opacity: 0, scale: 0.9}}
                        >
                            <ProductCard
                                id={product.id}
                                image={product.image}
                                title={product.name}
                                price={product.price}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
                <motion.div
                    className={styles.paginationBottom}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.2}}
                >
                    {Array.from({length: totalPages}, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ''}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </motion.div>
            )}
        </div>
    );
});

export default FavoritesPage;