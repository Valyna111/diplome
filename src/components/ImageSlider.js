import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import styles from "./ImageSlider.module.css";
import { useNavigate } from "react-router-dom";

const images = [
  { src: "images/slider1.jpg", link: "/flower1" },
  { src: "/images/slider2.jpg", link: "/flower2" },
  { src: "/images/slider3.jpg", link: "/flower3" },
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
      <img
        src={images[currentIndex].src}
        alt="Flower"
        className={styles.sliderImage}
        onClick={() => navigate(images[currentIndex].link)}
      />
      {isHovered && (
        <>
          <button className={styles.prevButton} onClick={prevSlide}>
            <FaArrowLeft />
          </button>
          <button className={styles.nextButton} onClick={nextSlide}>
            <FaArrowRight />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
