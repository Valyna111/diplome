import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import styles from "./ImageSlider.module.css";
import { useNavigate } from "react-router-dom";
import Slider1 from '@/assets/images/slider1.jpg' 
import Slider2 from '@/assets/images/slider2.jpg'
import Slider3 from '@/assets/images/slider3.jpg'

const images = [
  { src: Slider1, link: "/flower1" },
  { src: Slider2, link: "/flower2" },
  { src: Slider3, link: "/flower3" },
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

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
          const position =
            index === currentIndex
              ? styles.activeSlide
              : index === (currentIndex - 1 + images.length) % images.length
              ? styles.prevSlide
              : index === (currentIndex + 1) % images.length
              ? styles.nextSlide
              : styles.hiddenSlide;

          return (
            <img
              key={index}
              src={image.src}
              alt={`Flower ${index + 1}`}
              className={`${styles.sliderImage} ${position}`}
              onClick={() => navigate(image.link)}
            />
          );
        })}
      </div>

      <button className={styles.prevButton} onClick={prevSlide}>
        <FaArrowLeft />
      </button>
      <button className={styles.nextButton} onClick={nextSlide}>
        <FaArrowRight />
      </button>
    </div>
  );
};

export default ImageSlider;
