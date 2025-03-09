import { observer } from "mobx-react-lite";
import Input from "@/components/Form/Input/Input";
import Button from "@/components/Form/Button/Button";
import React, { useContext, useState } from "react";
import s from './ItemDetails.module.css';
import StoreContext from "@/store/StoreContext";
import Select from "@/components/Form/Select/Select";

const ItemDetails = observer(({
                                  title = 'Добавить компонент',
                                  action = 'create', // Действие: create или update
                                  itemId, // ID элемента, если action === 'update'
                                  onClose, // Функция закрытия модального окна или формы
                              }) => {
    const rootStore = useContext(StoreContext);
    const [form, setForm] = useState({
        name: '', // Название компонента
        type: { label: '', value: '' }, // Объект для типа
        cost: '', // Состояние для стоимости
        errors: {
            name: '',
            type: '',
            cost: '',
        },
    });

    // Загрузка данных элемента, если action === 'update'
    React.useEffect(() => {
        if (action === 'update' && itemId) {
            const item = rootStore.auxiliaryStore.items.find((item) => item.id === itemId);
            if (item) {
                setForm({
                    name: item.name,
                    type: { label: item.typeByTypeId.name, value: item.typeByTypeId.id },
                    cost: item.cost.toString(),
                    errors: {
                        name: '',
                        type: '',
                        cost: '',
                    },
                });
            }
        }
    }, [action, itemId, rootStore.auxiliaryStore.items]);

    // Обработчик изменения названия
    const handleNameChange = (value) => {
        setForm((prevState) => ({
            ...prevState,
            name: value,
        }));
    };

    // Обработчик изменения типа
    const handleTypeChange = (selectedOption) => {
        setForm((prevState) => ({
            ...prevState,
            type: selectedOption,
        }));
    };

    // Обработчик изменения стоимости
    const handleCostChange = (value) => {
        setForm((prevState) => ({
            ...prevState,
            cost: value,
        }));
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация формы
        if (!form.name || !form.type.value || !form.cost) {
            alert('Заполните все поля');
            return;
        }

        try {
            if (action === 'create') {
                // Создание нового элемента
                await rootStore.auxiliaryStore.createItem(
                    form.name,
                    form.type.value,
                    parseFloat(form.cost.replace(/\s/g, '')) // Убираем пробелы и преобразуем в число
                );
            } else if (action === 'update' && itemId) {
                // Обновление существующего элемента
                await rootStore.auxiliaryStore.updateItem(
                    itemId,
                    form.name,
                    form.type.value,
                    parseFloat(form.cost.replace(/\s/g, '')) // Убираем пробелы и преобразуем в число
                );
            }
            setForm({
                    name: '',// Название компонента
                    type: { label: '', value: '' }, // Объект для типа
                    cost: '', // Состояние для стоимости
                errors: {
                    name: '',
                    type: '',
                    cost: '',
                }
            });
            // Закрытие формы или модального окна
            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error('Ошибка при сохранении элемента:', error);
            alert('Произошла ошибка при сохранении элемента');
        }
    };

    return (
        <div className={s.formContainer}>
            <h2 className={s.formTitle}>{title}</h2>
            <form className={s.form} onSubmit={handleSubmit}>
                <Input
                    placeholder="Название компонента"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                />
                <Select
                    value={form.type}
                    onChange={handleTypeChange}
                    options={rootStore.auxiliaryStore.types.map((type) => ({
                        label: type?.name,
                        value: type?.id,
                    }))}
                    placeholder={'Тип компонента'}
                />
                <Input
                    placeholder="Стоимость"
                    value={form.cost}
                    onChange={(e) => handleCostChange(e.target.value)}
                    mask={Number} // Маска для чисел
                    scale={0} // Количество знаков после запятой (0 для целых чисел)
                    thousandsSeparator=" " // Разделитель тысяч (пробел)
                    radix="." // Десятичный разделитель (точка)
                />
                <Button type="primary" placeholder={action === 'create' ? 'Добавить' : 'Обновить'} />
            </form>
        </div>
    );
});

export default ItemDetails;