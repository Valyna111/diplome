import React, { useState, useEffect } from "react";
import { FaAngleLeft,  FaAngleRight } from "react-icons/fa";
import styles from "./ImageSlider.module.css";
import Slider1 from '@/assets/images/slider1.jpg';
import Slider2 from '@/assets/images/slider2.jpg';
import Slider3 from '@/assets/images/slider3.jpg';

const images = [
  { src: Slider1, link: "/flower1" },
  { src: Slider2, link: "/flower2" },
  { src: Slider3, link: "/flower3" },
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div
      className={styles.sliderContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.sliderWrapper}>
        {images.map((image, index) => {
          let position;
          if (index === currentIndex) {
            position = styles.activeSlide;
          } else if (index === (currentIndex - 1 + images.length) % images.length) {
            position = styles.prevSlide;
          } else if (index === (currentIndex + 1) % images.length) {
            position = styles.nextSlide;
          } else {
            position = styles.hiddenSlide;
          }

          return (
            <img
              key={index}
              src={image.src}
              alt={`Slide ${index + 1}`}
              className={`${styles.sliderImage} ${position}`}
            />
          );
        })}
      </div>

      {/* Кнопки навигации */}
      <button className={styles.prevButton} onClick={prevSlide}>
        <FaAngleLeft/>
      </button>
      <button className={styles.nextButton} onClick={nextSlide}>
        < FaAngleRight />
      </button>
    </div>
  );
};

export default ImageSlider;