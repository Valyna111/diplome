import React, { useState } from "react";

import Button from "@/components/Form/Button/Button"; // Подключаем кастомную кнопку
import Input from "@/components/Form/Input/Input"; // Подключаем кастомный инпут
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
      <div className={styles.leftSection}>
        <h1 className={styles.title}>Мои карты</h1>

        {cards.length > 0 ? (
          <div className={styles.cardList}>
            {cards.map((card) => (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span>{card.firstName} {card.lastName}</span>
                  <Button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteCard(card.id)}
                    type="second"
                    placeholder="Удалить"
                  />
                </div>
                <div className={styles.cardNumber}>
                  {maskCardNumber(card.cardNumber)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyMessage}>У вас пока нет добавленных карт.</p>
        )}

        <Button
          className={styles.addButton}
          onClick={() => setShowAddForm(true)}
          type="primary"
          placeholder="Добавить карту"
        />

        {showAddForm && (
          <div className={styles.formOverlay}>
            <div className={styles.formContainer}>
              <h2>Добавить карту</h2>
              <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
                <Input
                  className={styles.input}
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Имя"
                  name="firstName"
                  required
                />
                <Input
                  className={styles.input}
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Фамилия"
                  name="lastName"
                  required
                />
                <Input
                  className={styles.input}
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="0000 0000 0000 0000"
                  mask="0000 0000 0000 0000"
                  name="cardNumber"
                  required
                />
                <Input
                  className={styles.input}
                  id="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  mask="0000"
                  name="cvv"
                  required
                />

                <div className={styles.formActions}>
                  <Button
                    type="second"
                    onClick={() => setShowAddForm(false)}
                    placeholder="Отмена"
                  />
                  <Button
                    type="primary"
                    onClick={handleAddCard}
                    placeholder="Добавить"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className={styles.rightSection}>
        <h2>Как безопасно использовать карты онлайн?</h2>
        <p>
          Чтобы избежать мошенничества, следуйте этим простым рекомендациям:
        </p>
        <ul>
          <li>Используйте только проверенные онлайн-магазины.</li>
          <li>Не передавайте свои данные третьим лицам.</li>
          <li>Активируйте двухфакторную аутентификацию на ваших аккаунтах.</li>
          <li>Проверяйте URL на предмет безопасности (начинается с "https://").</li>
          <li>Будьте осторожны при вводе данных в открытых или общественных сетях.</li>
        </ul>
        <p>
          При возникновении подозрений на мошенничество, немедленно свяжитесь с вашим банком.
        </p>
      </div>
    </div>
  );
};

export default CreditCard;
