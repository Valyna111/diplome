import React from "react";
import Navbar from "../components/NavBar";
import ImageSlider from "../components/ImageSlider";
import SearchBar from "../components/SearchBar";
import FilterSort from "../components/FilterSort";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import styles from "./Main.module.css";
import ArticlesComp from "../components/ArticlesComp";

const Main = () => {
  return (
    <div className={styles.mainContainer}>
      <Navbar />
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

      <Footer />
    </div>
  );
};

export default Main;
