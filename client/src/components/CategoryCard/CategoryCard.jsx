import {observer} from "mobx-react-lite";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./CategoryCard.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';

const CategoryCard = observer(({title, withDiscount, data = []}) => {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 3,
        arrows: true,
        nextArrow: <SampleNextArrow/>,
        prevArrow: <SamplePrevArrow/>,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <div className={styles.categoryContainer}>
            <h2 className={styles.title}>{title}</h2>

            <div className={styles.sliderWrapper}>
                <Slider {...sliderSettings} className={styles.slider}>
                    {data.map((b, index) => (
                        <ProductCard
                            id={b.id}
                            image={b.image}
                            title={b.name}
                            description={b.description}
                            price={b.price}
                            key={b.id}
                            className={styles.slider_item}
                            withDiscount={withDiscount}
                            discountPercentage={b.sale}
                        />
                    ))}
                </Slider>
            </div>
        </div>
    )
});

export default CategoryCard;

function SampleNextArrow(props) {
    const {className, style, onClick} = props;
    return (
        <div className={className} onClick={onClick}>
            <FaChevronRight style={{color: '#000', fontSize: '24px'}}/>
        </div>
    );
}

function SamplePrevArrow(props) {
    const {className, style, onClick} = props;
    return (
        <div className={className} onClick={onClick}>
            <FaChevronLeft style={{color: '#000', fontSize: '24px'}}/>
        </div>
    );
}