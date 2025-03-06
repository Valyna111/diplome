import React, { useState } from "react";
import styles from "./PromotionConstructor.module.css";
import Button from "@/components/Form/Button/Button";
import Input from "@/components/Form/Input/Input";

const initialPromotions = [
  {
    id: 1,
    image: "/images/promotion1.jpg",
    text: "Скидка 20% на все букеты!",
  },
  {
    id: 2,
    image: "/images/promotion2.jpg",
    text: "Бесплатная доставка при заказе от 3000 рублей.",
  },
];

const PromotionConstructor = () => {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  // Добавление новой акции
  const handleAddPromotion = () => {
    setSelectedPromotion({
      id: Date.now(),
      image: "",
      text: "",
    });
  };

  // Удаление акции
  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter((promotion) => promotion.id !== id));
    setSelectedPromotion(null);
  };

  // Сохранение или публикация акции
  const handleSavePromotion = () => {
    if (selectedPromotion.id) {
      const exists = promotions.find((promotion) => promotion.id === selectedPromotion.id);
      if (exists) {
        setPromotions(
          promotions.map((promotion) =>
            promotion.id === selectedPromotion.id ? selectedPromotion : promotion
          )
        );
      } else {
        setPromotions([...promotions, selectedPromotion]);
      }
      setSelectedPromotion(null);
    }
  };

  // Загрузка изображения
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedPromotion({ ...selectedPromotion, image: imageUrl });
    }
  };

  return (
    <div className={styles.container}>
      {/* 🔹 Левая колонка (список акций) */}
      <div className={styles.leftColumn}>
        <Button className={styles.addButton} onClick={handleAddPromotion} placeholder="➕ Добавить акцию" />

        <div className={styles.promotionsList}>
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className={styles.promotionCard}
              onClick={() => setSelectedPromotion(promotion)}
            >
              <img
                src={promotion.image || "/placeholder.jpg"}
                alt={promotion.text}
                className={styles.promotionImage}
              />
              <p>{promotion.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Правая колонка (форма редактирования) */}
      {selectedPromotion && (
        <div className={styles.rightColumn}>
          <h2>{selectedPromotion.id ? "Редактировать акцию" : "Добавить акцию"}</h2>

          {/* Загрузка изображения */}
          <div className={styles.imageUploadContainer}>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <Button
              className={styles.uploadButton}
              onClick={() => document.querySelector("input[type='file']").click()}
              placeholder="Загрузить изображение"
            />
            {selectedPromotion.image && (
              <img
                src={selectedPromotion.image}
                alt="Preview"
                className={styles.previewImage}
              />
            )}
          </div>

          {/* Поле для текста акции */}
          <div className={styles.inputGroup}>
            <Input
              id="promotion-text"
              value={selectedPromotion.text}
              onChange={(e) =>
                setSelectedPromotion({ ...selectedPromotion, text: e.target.value })
              }
              placeholder="Текст акции"
            />
          </div>

          {/* Кнопки управления */}
          <div className={styles.buttonGroup}>
            <Button
              className={styles.publishButton}
              onClick={handleSavePromotion}
              placeholder="✅ Опубликовать"
            />
            <Button
              className={styles.deleteButton}
              onClick={() => handleDeletePromotion(selectedPromotion.id)}
              placeholder="🗑 Удалить"
              type="second"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionConstructor;