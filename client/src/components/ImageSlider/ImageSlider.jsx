import React, {useEffect, useState} from "react";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";
import {AnimatePresence, motion} from "framer-motion";
import styles from "./ImageSlider.module.css";
import Slider1 from '@/assets/images/slider1.jpg';
import Slider2 from '@/assets/images/slider2.jpg';
import Slider3 from '@/assets/images/slider3.jpg';

const images = [
    {src: Slider1, link: "/flower1"},
    {src: Slider2, link: "/flower2"},
    {src: Slider3, link: "/flower3"},
];

const ImageSlider = () => {
    const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovered) {
                setCurrentIndex(([prevIndex]) => [
                    (prevIndex + 1) % images.length,
                    1, // direction forward
                ]);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [isHovered]);

    const paginate = (newDirection) => {
        setCurrentIndex(([prevIndex]) => {
            const newIndex = (prevIndex + newDirection + images.length) % images.length;
            return [newIndex, newDirection];
        });
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0.5,
            scale: 0.8,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            zIndex: 1,
        },
        exit: (direction) => ({
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0.5,
            scale: 0.8,
            zIndex: 0,
        }),
    };

    // Calculate previous and next indices for the carousel effect
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;

    return (
        <div
            className={styles.sliderContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Previous Slide (smaller and to the left) */}
            <motion.div
                className={`${styles.sliderImage} ${styles.prevSlide}`}
                initial={{x: "-80%", scale: 0.8}}
                animate={{x: "-30%", scale: 0.9}}
                transition={{type: "spring", stiffness: 300, damping: 30}}
            >
                <img
                    src={images[prevIndex].src}
                    alt={`Previous slide`}
                    className={styles.image}
                />
            </motion.div>

            {/* Current Slide (main) */}
            <AnimatePresence custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: {type: "spring", stiffness: 300, damping: 30},
                        opacity: {duration: 0.2},
                        scale: {type: "spring", stiffness: 300, damping: 30},
                    }}
                    className={`${styles.sliderImage} ${styles.activeSlide}`}
                >
                    <img
                        src={images[currentIndex].src}
                        alt={`Slide ${currentIndex + 1}`}
                        className={styles.image}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Next Slide (smaller and to the right) */}
            <motion.div
                className={`${styles.sliderImage} ${styles.nextSlide}`}
                initial={{x: "80%", scale: 0.8}}
                animate={{x: "30%", scale: 0.9}}
                transition={{type: "spring", stiffness: 300, damping: 30}}
            >
                <img
                    src={images[nextIndex].src}
                    alt={`Next slide`}
                    className={styles.image}
                />
            </motion.div>

            {/* Navigation buttons */}
            <button className={styles.prevButton} onClick={() => paginate(-1)}>
                <FaAngleLeft/>
            </button>
            <button className={styles.nextButton} onClick={() => paginate(1)}>
                <FaAngleRight/>
            </button>
        </div>
    );
};

export default ImageSlider;