import React, { useState } from 'react';
import Button from '@/components/Form/Button/Button';
import Input from '@/components/Form/Input/Input';
import s from './ItemInput.module.css';

const ItemInput = () => {
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showCreateBouquetForm, setShowCreateBouquetForm] = useState(false);

  const [image, setImage] = useState(null);
  const [secondImage, setSecondImage] = useState(null);

  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');

  // Состояние для списка компонентов
  const [components, setComponents] = useState([
    { id: 1, name: 'Роза', type: 'цветок', price: 100, quantity: '', selected: false },
    { id: 2, name: 'Тюльпан', type: 'цветок', price: 80, quantity: '', selected: false },
    { id: 3, name: 'Ваза стеклянная', type: 'ваза', price: 500, quantity: '', selected: false },
    { id: 4, name: 'Горшок керамический', type: 'горшок', price: 300, quantity: '', selected: false },
    // Добавим больше элементов для проверки прокрутки
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 5,
      name: `Компонент ${i + 5}`,
      type: 'цветок',
      price: 100 + i * 10,
      quantity: '',
      selected: false,
    })),
  ]);

  // Обработчик изменения количества (валидация чисел)
  const handleQuantityChange = (id, value) => {
    // Разрешаем вводить только цифры
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    setComponents((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: sanitizedValue } : item
      )
    );
  };

  // Обработчик изменения чекбокса
  const handleCheckboxChange = (id) => {
    setComponents((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Фильтрация компонентов по поисковому запросу
  const filteredComponents = components.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAddItemForm = () => {
    setShowAddItemForm(!showAddItemForm);
    setShowCreateBouquetForm(false); // Закрываем другую форму, если открыта
  };

  const toggleCreateBouquetForm = () => {
    setShowCreateBouquetForm(!showCreateBouquetForm);
    setShowAddItemForm(false); // Закрываем другую форму, если открыта
  };

  const handleImageChange = (e, setImageFunction) => {
    const file = e.target.files[0];
    if (file) {
      setImageFunction(URL.createObjectURL(file));
    }
  };

  return (
    <div className={s.container}>
      {/* Левая часть: Формы */}
      <div className={s.leftSide}>
        <div className={s.buttonsContainer}>
          <Button
            type="primary"
            placeholder="Добавить компоненты"
            onClick={toggleAddItemForm}
            className={s.button}
          />
          <Button
            type="primary"
            placeholder="Создать букет"
            onClick={toggleCreateBouquetForm}
            className={s.button}
          />
        </div>

        {/* Форма добавления цветка */}
        {showAddItemForm && (
          <div className={s.formContainer}>
            <h2 className={s.formTitle}>Добавить конпонент</h2>
            <form className={s.form}>
              <Input
                placeholder="Название компонента"
                className={s.input}
              />
              <Input
                placeholder="ID типа"
                className={s.input}
              />
              <Input
                placeholder="Стоимость"
                className={s.input}
              />
              <Button
                type="primary"
                placeholder="Добавить"
                className={s.submitButton}
              />
            </form>
          </div>
        )}

        {/* Форма создания букета */}
        {showCreateBouquetForm && (
          <div className={s.formContainer}>
            <h2 className={s.formTitle}>Создать букет</h2>
            <form className={s.form}>
              <Input
                placeholder="Название букета"
                className={s.input}
              />
              <Input
                placeholder="Категория"
                className={s.input}
              />
              <Input
                placeholder="Цена"
                className={s.input}
              />
              <div className={s.fileInputContainer}>
                <label className={s.fileInputLabel}>
                  Выберите изображение
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(e, setImage)}
                    className={s.fileInput}
                  />
                </label>
                {image && <img src={image} alt="Выбранное изображение" className={s.previewImage} />}
              </div>
              <Input
                placeholder="Описание"
                className={s.input}
              />
              <Input
                placeholder="Скидка"
                className={s.input}
              />
              <div className={s.fileInputContainer}>
                <label className={s.fileInputLabel}>
                  Выберите второе изображение
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(e, setSecondImage)}
                    className={s.fileInput}
                  />
                </label>
                {secondImage && (
                  <img src={secondImage} alt="Второе изображение" className={s.previewImage} />
                )}
              </div>
              <Button
                type="primary"
                placeholder="Создать"
                className={s.submitButton}
              />
            </form>
          </div>
        )}
      </div>

      {/* Правая часть: Список компонентов */}
      <div className={s.rightSide}>
        <h2 className={s.componentsTitle}>Компоненты</h2>
        {/* Поиск по буквам */}
        <Input
          placeholder="Поиск компонентов"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={s.searchInput}
        />
        {/* Список компонентов */}
        <div className={s.componentsList}>
          {filteredComponents.map((item) => (
            <div key={item.id} className={s.componentItem}>
              <div className={s.componentInfo}>
                <span className={s.componentName}>{item.name}</span>
                <span className={s.componentPrice}>{item.price} руб.</span>
              </div>
              <div className={s.componentControls}>
                <Input
                  type="text"
                  placeholder="Количество"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className={s.quantityInput}
                />
                <label className={s.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => handleCheckboxChange(item.id)}
                    className={s.checkbox}
                  />
                  <span className={s.checkboxCustom}></span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemInput;