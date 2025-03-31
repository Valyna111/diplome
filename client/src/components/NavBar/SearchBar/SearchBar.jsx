import React, {useEffect, useRef, useState} from "react";
import {FaSearch, FaTimes} from "react-icons/fa";
import {observer} from "mobx-react-lite";
import styles from "./SearchBar.module.css";
import {AnimatePresence, motion} from "framer-motion";
import Slider1 from '@/assets/images/aliceblue_tulps.jpg';

const SearchBar = observer(() => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Закрытие поиска при клике вне области
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                collapseSearch();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Автофокус при открытии
    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    // Заглушка для поиска с имитацией загрузки
    const handleSearch = (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);

        // Имитация API-запроса
        setTimeout(() => {
            setSearchResults([
                {id: 1, name: "Букет 'Романтика'", type: "bouquet", image: "/images/bouquet1.jpg"},
                {id: 2, name: "Букет 'Нежность'", type: "bouquet", image: "/images/bouquet2.jpg"},
                {id: 3, name: "Статья 'Как ухаживать за розами'", type: "article"}
            ]);
            setIsLoading(false);
        }, 500);
    };

    const collapseSearch = () => {
        setIsExpanded(false);
        setSearchQuery("");
        setSearchResults([]);
    };

    return (
        <div className={styles.searchContainer} ref={searchRef}>
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.div
                        initial={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                    >
                        <FaSearch
                            className={styles.searchIcon}
                            onClick={() => setIsExpanded(true)}
                            whileHover={{scale: 1.1}}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        className={styles.searchExpanded}
                        initial={{width: 0, opacity: 0}}
                        animate={{
                            width: isExpanded ? 300 : 0,
                            opacity: isExpanded ? 1 : 0
                        }}
                        transition={{duration: 0.3}}
                        style={{originX: 1}}
                    >
                        <motion.div
                            className={styles.searchInputContainer}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.1}}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Поиск букетов, статей..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    handleSearch(e.target.value);
                                }}
                                className={styles.searchInput}
                            />
                            <motion.div
                                className={styles.closeIconWrapper}
                                whileHover={{scale: 1.1}}
                            >
                                <FaTimes
                                    className={styles.closeIcon}
                                    onClick={collapseSearch}
                                />
                            </motion.div>
                        </motion.div>

                        <AnimatePresence>
                            {searchResults.length > 0 && (
                                <motion.div
                                    className={styles.searchResults}
                                    initial={{opacity: 0, height: 0}}
                                    animate={{opacity: 1, height: "auto"}}
                                    exit={{opacity: 0, height: 0}}
                                    transition={{duration: 0.3}}
                                >
                                    {searchResults.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            className={styles.resultItem}
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                        >
                                            {item.image && (
                                                <img
                                                    src={Slider1}
                                                    alt={item.name}
                                                    className={styles.resultImage}
                                                />
                                            )}
                                            <span>{item.name}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div
                                className={styles.loadingBar}
                                initial={{width: 0}}
                                animate={{width: "100%"}}
                                transition={{duration: 0.5}}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default SearchBar;