import React, { useState } from "react";
import styles from "./CreditCard.module.css"; // Подключаем стили

const CreditCard = () => {
  const [cards, setCards] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    cvv: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateCardNumber = (cardNumber) => {
    return /^\d{16}$/.test(cardNumber);
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const handleAddCard = () => {
    const { firstName, lastName, cardNumber, cvv } = formData;

    if (!firstName || !lastName || !validateCardNumber(cardNumber) || !validateCVV(cvv)) {
      alert("Пожалуйста, заполните все поля корректно.");
      return;
    }

    const newCard = {
      id: Date.now(),
      firstName,
      lastName,
      cardNumber,
      cvv,
    };

    setCards((prev) => [...prev, newCard]);
    setFormData({
      firstName: "",
      lastName: "",
      cardNumber: "",
      cvv: "",
    });
    setShowAddForm(false);
  };

  const handleDeleteCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const maskCardNumber = (cardNumber) => {
    return `${cardNumber.slice(0, 4)} **** **** ${cardNumber.slice(-4)}`;
  };

  return (
    <div className={styles.container}>
      <h1>Мои карты</h1>

      {cards.length > 0 ? (
        <div className={styles.cardList}>
          {cards.map((card) => (
            <div key={card.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span>{card.firstName} {card.lastName}</span>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteCard(card.id)}
                >
                  Удалить
                </button>
              </div>
              <div className={styles.cardNumber}>
                {maskCardNumber(card.cardNumber)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>У вас пока нет добавленных карт.</p>
      )}

      <button
        className={styles.addButton}
        onClick={() => setShowAddForm(true)}
      >
        Добавить карту
      </button>

      {showAddForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <h2>Добавить карту</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formGroup}>
                <label>Имя (латиницей)</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Имя"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Фамилия (латиницей)</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Фамилия"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Номер карты</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength={16}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowAddForm(false)}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  onClick={handleAddCard}
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditCard;