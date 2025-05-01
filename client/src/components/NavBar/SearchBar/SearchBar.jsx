import React, {useEffect, useRef, useState} from "react";
import {FaSearch, FaTimes} from "react-icons/fa";
import {observer} from "mobx-react-lite";
import styles from "./SearchBar.module.css";
import {AnimatePresence, motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import StoreContext from "@/store/StoreContext";
import {useContext} from "react";

const SearchBar = observer(() => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const rootStore = useContext(StoreContext);
    const {bouquetStore} = rootStore;

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

    // Поиск по локальному массиву
    useEffect(() => {
        if (searchQuery.length >= 2) {
            const results = bouquetStore.searchBouquets(searchQuery);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, bouquetStore.bouquets]);

    const handleResultClick = (bouquet) => {
        navigate(`/main/catalog/${bouquet.id}`);
        collapseSearch();
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
                        className={styles.searchIconWrapper}
                    >
                        <FaSearch
                            className={styles.searchIcon}
                            onClick={() => setIsExpanded(true)}
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
                        exit={{width: 0, opacity: 0}}
                        transition={{duration: 0.3}}
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
                                placeholder="Поиск букетов..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                    {searchResults.map((bouquet) => (
                                        <motion.div
                                            key={bouquet.id}
                                            className={styles.resultItem}
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            onClick={() => handleResultClick(bouquet)}
                                        >
                                            {bouquet.image && (
                                                <img
                                                    src={`http://localhost:4000${bouquet.image}`}
                                                    alt={bouquet.name}
                                                    className={styles.resultImage}
                                                />
                                            )}
                                            <span>{bouquet.name}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default SearchBar;