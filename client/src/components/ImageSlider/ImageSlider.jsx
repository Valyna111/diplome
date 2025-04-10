import React, {useContext} from "react";
import Slider from "react-slick";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./ImageSlider.module.css";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";

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

const ImageSlider = observer(() => {
    const {auxiliaryStore} = useContext(StoreContext);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        centerMode: true,
        centerPadding: "10%",
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
                    centerMode: false,
                    centerPadding: "0",
                }
            }
        ]
    };

    return (
        <div className={styles.sliderContainer}>
            <Slider {...settings}>
                {auxiliaryStore.events.map((event, index) => (
                    <div key={index} className={styles.slide}>
                        <a className={styles.imageLink}>
                            <img
                                src={event.image ? `http://localhost:4000${event.image}` : "/placeholder.jpg"}
                                alt={`Event ${index + 1}`}
                                className={styles.image}
                            />
                            {event.description && (
                                <div className={styles.eventDescription}>
                                    <p>{event.description}</p>
                                </div>
                            )}
                        </a>
                    </div>
                ))}
            </Slider>
        </div>
    );
});

export default ImageSlider;