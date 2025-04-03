import React, {useContext} from "react";
import {motion} from "framer-motion";
import styles from "./EmptyWishlist.module.css";
import StoreContext from "@/store/StoreContext";

const EmptyWishlist = ({title, description, showLoginButton = false}) => {
    const {authStore} = useContext(StoreContext);

    return (
        <motion.div
            className={styles.container}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <div className={styles.icon}>❤️</div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>

            {showLoginButton && (
                <button
                    className={styles.loginButton}
                    onClick={() => authStore.setIsModalLogin(true)}
                >
                    Войти
                </button>
            )}
        </motion.div>
    );
};

export default EmptyWishlist;