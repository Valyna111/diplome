import React, {useContext, useState} from "react";
import {observer} from "mobx-react-lite";
import StoreContext from "@/store/StoreContext";
import ProductCard from "@/components/ProductCard/ProductCard";
import {Button, Input, Radio, Select, Slider} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import styles from "./CatalogCategories.module.css";

const {Search} = Input;
const {Group, Button: RadioButton} = Radio;

const CatalogCategories = observer(() => {
    const {bouquetStore, auxiliaryStore} = useContext(StoreContext);

    const [filters, setFilters] = useState({
        category: null,
        priceRange: [0, 100],
        colorSearch: "",
        discountFilter: 'all' // 'all' - все, 'with' - со скидкой, 'without' - без скидки
    });

    const displayedBouquets = bouquetStore.bouquets.filter(bouquet => {
        const categoryMatch = !filters.category ||
            bouquet.categoryByCategoryId?.id === filters.category;
        const priceMatch = bouquet.price >= filters.priceRange[0] &&
            bouquet.price <= filters.priceRange[1];
        const colorMatch = !filters.colorSearch ||
            bouquet.name.toLowerCase().includes(filters.colorSearch.toLowerCase()) ||
            bouquet.description.toLowerCase().includes(filters.colorSearch.toLowerCase());

        // Фильтр по скидке
        let discountMatch = true;
        if (filters.discountFilter === 'with') {
            discountMatch = bouquet.sale > 0;
        } else if (filters.discountFilter === 'without') {
            discountMatch = bouquet.sale === 0 || !bouquet.sale;
        }

        return categoryMatch && priceMatch && colorMatch && discountMatch;
    });

    const resetFilters = () => {
        setFilters({
            category: null,
            priceRange: [0, 100],
            colorSearch: "",
            discountFilter: 'all'
        });
    };

    return (
        <div className={styles.catalogContainer}>
            <h2 className={styles.title}>Каталог товаров</h2>

            <div className={styles.filtersContainer}>
                <div className={styles.filterGroup}>
                    <Select
                        className={styles.filterInput}
                        placeholder="Все категории"
                        value={filters.category}
                        onChange={value => setFilters({...filters, category: value})}
                        options={auxiliaryStore.categories.map(c => ({
                            value: c.id,
                            label: c.name
                        }))}
                        allowClear
                    />
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.priceFilter}>
                        <span className={styles.filterLabel}>Цена:</span>
                        <Slider
                            range
                            min={0}
                            max={100}
                            value={filters.priceRange}
                            onChange={value => setFilters({...filters, priceRange: value})}
                            className={styles.priceSlider}
                        />
                        <span className={styles.priceValues}>
              {filters.priceRange[0]}-{filters.priceRange[1]} руб.
            </span>
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <Search
                        placeholder="Поиск по цвету"
                        value={filters.colorSearch}
                        onChange={e => setFilters({...filters, colorSearch: e.target.value})}
                        allowClear
                        enterButton
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.discountFilter}>

                        <Group
                            value={filters.discountFilter}
                            onChange={e => setFilters({...filters, discountFilter: e.target.value})}
                            className={styles.radioGroup}
                            optionType="button"
                            buttonStyle="solid"
                        >
                            <RadioButton value="all">Все</RadioButton>
                            <RadioButton value="with">Со скидкой</RadioButton>
                            <RadioButton value="without">Без скидки</RadioButton>
                        </Group>
                    </div>
                </div>

                <Button
                    icon={<CloseOutlined/>}
                    onClick={resetFilters}
                    className={styles.resetButton}
                >
                    Сбросить
                </Button>
            </div>

            <div className={styles.productsFlexContainer}>
                {displayedBouquets.length > 0 ? (
                    displayedBouquets.map((bouquet) => (
                        <div key={bouquet.id} className={styles.productCard}>
                            <ProductCard
                                id={bouquet.id}
                                image={bouquet.image}
                                title={bouquet.name}
                                description={bouquet.description}
                                price={bouquet.price}
                                discountPercentage={bouquet.sale}
                                availableAmount={bouquet.amount}
                            />
                        </div>
                    ))
                ) : (
                    <div className={styles.noResults}>Ничего не найдено</div>
                )}
            </div>
        </div>
    );
});

export default CatalogCategories;