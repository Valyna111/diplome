import React, { useState } from "react";
import styles from "./EditCatalogPage.module.css";

// Пример данных для букетов и цветов
const initialBouquets = [
  { id: 1, name: "Букет роз", price: 2000, description: "Красные розы, 15 штук" },
  { id: 2, name: "Букет тюльпанов", price: 1500, description: "Желтые тюльпаны, 10 штук" },
];

const initialFlowers = [
  { id: 1, name: "Роза", price: 100, description: "Красная роза" },
  { id: 2, name: "Тюльпан", price: 80, description: "Желтый тюльпан" },
];

const EditCatalogPage = () => {
  const [bouquets, setBouquets] = useState(initialBouquets);
  const [flowers, setFlowers] = useState(initialFlowers);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  // Открыть форму для редактирования или добавления
  const openForm = (product = null) => {
    setSelectedProduct(product);
    setIsEditing(!!product);
    setIsAdding(!product);
    setFormData(
      product
        ? { name: product.name, price: product.price, description: product.description }
        : { name: "", price: "", description: "" }
    );
  };

  // Закрыть форму
  const closeForm = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsAdding(false);
    setFormData({ name: "", price: "", description: "" });
  };

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Сохранение товара (добавление или редактирование)
  const handleSave = () => {
    if (isAdding) {
      const newProduct = { id: Date.now(), ...formData };
      if (selectedProduct?.type === "bouquet") {
        setBouquets([...bouquets, newProduct]);
      } else {
        setFlowers([...flowers, newProduct]);
      }
    } else if (isEditing) {
      const updatedProduct = { ...selectedProduct, ...formData };
      if (selectedProduct.type === "bouquet") {
        setBouquets(bouquets.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      } else {
        setFlowers(flowers.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      }
    }
    closeForm();
  };

  // Удаление товара
  const handleDelete = (product) => {
    if (product.type === "bouquet") {
      setBouquets(bouquets.filter((p) => p.id !== product.id));
    } else {
      setFlowers(flowers.filter((p) => p.id !== product.id));
    }
  };

  return (
    <div className={styles.container}>
      <h2>Редактирование каталога</h2>

      {/* Список букетов */}
      <div className={styles.section}>
        <h3>Букеты</h3>
        <button className={styles.addButton} onClick={() => openForm()}>
          ➕ Добавить букет
        </button>
        <div className={styles.productList}>
          {bouquets.map((bouquet) => (
            <div key={bouquet.id} className={styles.productCard}>
              <h4>{bouquet.name}</h4>
              <p>{bouquet.description}</p>
              <p>Цена: {bouquet.price} руб.</p>
              <div className={styles.buttons}>
                <button className={styles.editButton} onClick={() => openForm({ ...bouquet, type: "bouquet" })}>
                  ✏️ Редактировать
                </button>
                <button className={styles.deleteButton} onClick={() => handleDelete({ ...bouquet, type: "bouquet" })}>
                  🗑 Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Список цветов */}
      <div className={styles.section}>
        <h3>Цветы</h3>
        <button className={styles.addButton} onClick={() => openForm()}>
          ➕ Добавить цветок
        </button>
        <div className={styles.productList}>
          {flowers.map((flower) => (
            <div key={flower.id} className={styles.productCard}>
              <h4>{flower.name}</h4>
              <p>{flower.description}</p>
              <p>Цена: {flower.price} руб.</p>
              <div className={styles.buttons}>
                <button className={styles.editButton} onClick={() => openForm({ ...flower, type: "flower" })}>
                  ✏️ Редактировать
                </button>
                <button className={styles.deleteButton} onClick={() => handleDelete({ ...flower, type: "flower" })}>
                  🗑 Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Форма для добавления/редактирования */}
      {(isEditing || isAdding) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{isEditing ? "Редактирование товара" : "Добавление товара"}</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Название"
              className={styles.input}
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Цена"
              className={styles.input}
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Описание"
              className={styles.textarea}
            />
            <div className={styles.modalButtons}>
              <button className={styles.saveButton} onClick={handleSave}>
                Сохранить
              </button>
              <button className={styles.cancelButton} onClick={closeForm}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCatalogPage;