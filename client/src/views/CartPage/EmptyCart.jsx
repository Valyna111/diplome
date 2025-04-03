import React, {useContext} from "react";
import {motion} from "framer-motion";
import {FaShoppingCart} from "react-icons/fa";
import styles from "./CartPage.module.css";
import StoreContext from "@/store/StoreContext";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";

const EmptyCart = observer(({title, description, showLoginButton = false, showContinueButton = false}) => {
    const {authStore} = useContext(StoreContext);
    return (
        <motion.div
            className={styles.emptyCart}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <motion.div
                className={styles.emptyIcon}
                animate={{rotate: -10, scale: 1.1}}
                transition={{repeat: Infinity, repeatType: "mirror", duration: 2}}
            >
                <FaShoppingCart size={64}/>
            </motion.div>
            <h2>{title}</h2>
            <p>{description}</p>

            <motion.div className={styles.emptyButtons}>
                {showLoginButton && (
                    <button onClick={() => authStore.setIsModalLogin(true)}>
                        <motion.button
                            className={styles.loginButton}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Войти
                        </motion.button>
                    </button>
                )}

                {showContinueButton && (
                    <Link to="/main/catalog">
                        <motion.button
                            className={styles.continueButton}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Продолжить покупки
                        </motion.button>
                    </Link>
                )}
            </motion.div>
        </motion.div>
    );
});

export default EmptyCart;