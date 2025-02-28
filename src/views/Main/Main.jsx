import React from "react";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import SearchBar from "@/components/SearchBar/SearchBar";
import FilterSort from "@/components/FilterSort/FilterSort";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./Main.module.css";
import ArticlesComp from "@/components/ArticlesComp/ArticlesComp";

const Main = () => {
  return (
    <div className={styles.mainContainer}>
      <ImageSlider />
      <ArticlesComp/>
      {/* Объединяем поиск и фильтры в один контейнер */}
      <div className={styles.searchFilterContainer}>
        <SearchBar />
        <FilterSort />
      </div>

      <div className={styles.productsGrid}>
        {[...Array(3)].map((_, index) => (
          <ProductCard
            key={index}
            image={`/images/flower${index + 1}.jpg`}
            title={`Цветок ${index + 1}`}
            description="Красивый свежий цветок"
            price={`${500 + index * 100} руб.`}
          />
        ))}
      </div>
    </div>
  );
};

export default Main;
