import React, { useState } from "react";
import styles from "./FilterSort.module.css";

const FilterSort = ({ onFilter, onSort }) => {
  const [selectedColor, setSelectedColor] = useState("");
  const [sortOption, setSortOption] = useState("");

  const handleFilterChange = (e) => {
    setSelectedColor(e.target.value);
    onFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    onSort(e.target.value);
  };

  return (
    <div className={styles.filterSortContainer}>
      {/* Фильтр по цвету */}
      <select value={selectedColor} onChange={handleFilterChange} className={styles.select}>
        <option value="">Все цвета</option>
        <option value="red">Красный</option>
        <option value="pink">Розовый</option>
        <option value="white">Белый</option>
        <option value="yellow">Желтый</option>
        <option value="orange">Оранжевый</option>
        <option value="purlpe">Фиолетовый</option>
        <option value="blue">Синий</option>
        <option value="green">Зелёный</option>
        <option value="black">Чёрный</option>
      </select>

      {/* Сортировка по цене */}
      <select value={sortOption} onChange={handleSortChange} className={styles.select}>
        <option value="">Без сортировки</option>
        <option value="asc">Цена: по возрастанию</option>
        <option value="desc">Цена: по убыванию</option>
      </select>
    </div>
  );
};

export default FilterSort;
