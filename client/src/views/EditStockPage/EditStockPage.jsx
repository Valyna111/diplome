import React, { useState } from "react";
import styles from "./EditStockPage.module.css";

// Пример данных товаров
const initialProducts = [
  { id: 1, name: "Букет роз", quantity: 10 },
  { id: 2, name: "Букет тюльпанов", quantity: 5 },
  { id: 3, name: "Букет лилий", quantity: 8 },
  { id: 4, name: "Букет ромашек", quantity: 3 },
];

const EditStockPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [spoiledQuantity, setSpoiledQuantity] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Открыть модальное окно для выбранного товара
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSpoiledQuantity(0);
    setShowModal(true);
  };

  // Удалить испорченные единицы товара
  const handleDeleteSpoiled = () => {
    if (spoiledQuantity > 0 && spoiledQuantity <= selectedProduct.quantity) {
      setProducts(
        products.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, quantity: product.quantity - spoiledQuantity }
            : product
        )
      );
      setShowModal(false);
    } else {
      alert("Введите корректное количество!");
    }
  };

  // Закрыть модальное окно
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <h2>Редактирование списка наличия товаров</h2>

      {/* Список товаров */}
      <div className={styles.productsList}>
        {products.map((product) => (
          <div
            key={product.id}
            className={styles.productCard}
            onClick={() => handleProductClick(product)}
          >
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <p>Количество: {product.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Удаление испорченных единиц</h3>
            <p>Товар: {selectedProduct.name}</p>
            <p>Доступное количество: {selectedProduct.quantity}</p>

            {/* Поле для ввода количества */}
            <input
              type="number"
              value={spoiledQuantity}
              onChange={(e) => setSpoiledQuantity(Number(e.target.value))}
              min="0"
              max={selectedProduct.quantity}
              className={styles.quantityInput}
              placeholder="Введите количество"
            />

            {/* Кнопки */}
            <div className={styles.modalButtons}>
              <button className={styles.deleteButton} onClick={handleDeleteSpoiled}>
                Удалить
              </button>
              <button className={styles.cancelButton} onClick={handleCloseModal}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditStockPage;