import React from "react";
import Slider from "react-slick";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./ImageSlider.module.css";
import Slider1 from '@/assets/images/slider1.jpg';
import Slider2 from '@/assets/images/slider2.jpg';
import Slider3 from '@/assets/images/slider3.jpg';

const images = [
    {src: Slider1, link: "/flower1"},
    {src: Slider2, link: "/flower2"},
    {src: Slider3, link: "/flower3"},
];

const NextArrow = ({onClick}) => (
    <div className={`${styles.arrow} ${styles.nextArrow}`} onClick={onClick}>
        <FaChevronRight/>
    </div>
);

const PrevArrow = ({onClick}) => (
    <div className={`${styles.arrow} ${styles.prevArrow}`} onClick={onClick}>
        <FaChevronLeft/>
    </div>
);

const ImageSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        centerMode: true,  // Включаем режим центрального слайда
        centerPadding: "10%",  // Отступы по бокам (видимость соседних слайдов)
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        nextArrow: <NextArrow/>,
        prevArrow: <PrevArrow/>,
        dotsClass: `slick-dots ${styles.dots}`,
        customPaging: () => <div className={styles.dot}/>,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    centerPadding: "7.5%",
                }
            },
            {
                breakpoint: 768,
                settings: {
                    centerPadding: "5%",
                }
            },
            {
                breakpoint: 480,
                settings: {
                    centerMode: false,  // На мобильных отключаем preview
                    centerPadding: "0",
                }
            }
        ]
    };

    return (
        <div className={styles.sliderContainer}>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className={styles.slide}>
                        <a href={image.link} className={styles.imageLink}>
                            <img
                                src={image.src}
                                alt={`Slide ${index + 1}`}
                                className={styles.image}
                            />
                        </a>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;