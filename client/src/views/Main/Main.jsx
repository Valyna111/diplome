import React, {useContext} from "react";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import styles from "./Main.module.css";
import ArticlesComp from "@/components/ArticlesComp/ArticlesComp";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";
import CategoryCard from "@/components/CategoryCard/CategoryCard";

import RoseImage from '@/assets/icons/roses.svg';
import BoxesImage from '@/assets/icons/boxes.svg';
import BouqetImage from '@/assets/icons/bouquets.svg';
import ReasonImage from '@/assets/icons/reason.svg';
import GiftImage from '@/assets/icons/gifts.svg';

const Main = observer(() => {
    const rootStore = useContext(StoreContext);
    return (
        <div className={styles.mainContainer}>
            <ImageSlider/>
            <div className={styles.grid_container}>
                <div className={styles.grid_item}>
                    <span>
                        Букеты
                    </span>
                    <img src={BouqetImage} alt={'Категория'}/>
                </div>
                <div className={styles.grid_item}>
                    <span>
                        Подарки
                    </span>
                    <img src={GiftImage} alt={'Категория'}/>
                </div>
                <div className={styles.grid_item}>
                    <span>
                        Розы
                    </span>
                    <img src={RoseImage} alt={'Категория'}/>
                </div>
                <div className={styles.grid_item}>
                    <span>
                        Найти причину
                    </span>
                    <img src={ReasonImage} alt={'Категория'}/>
                </div>
                <div className={styles.grid_item}>
                    <span>
                        Коробки
                    </span>
                    <img src={BoxesImage} alt={'Категория'}/>
                </div>
            </div>
            <ArticlesComp/>
            <CategoryCard title='Популярное' data={rootStore.bouquetStore.bouquets}/>
            <CategoryCard title='Скидки' withDiscount data={rootStore.bouquetStore.bouquets}/>
        </div>
    );
});

export default Main;
