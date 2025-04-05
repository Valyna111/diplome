import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import Input from "@/components/Form/Input/Input";
import Button from "@/components/Form/Button/Button";
import s from '../From.module.css';
import StoreContext from "@/store/StoreContext";
import Select from "@/components/Form/Select/Select";
import {IoClose} from "react-icons/io5";
import {IoMdAdd} from "react-icons/io";

const BouquetDetails = observer(({
                                     title = 'Создать букет',
                                     action = 'create',
                                     itemId = null,
                                     onClose = () => {
                                     },
                                 }) => {
    const rootStore = useContext(StoreContext);
    const [form, setForm] = useState({
        name: '',
        categoryId: {label: '', value: ''},
        price: '',
        description: '',
        amount: '',
        sale: '',
        image: '',
        secondImage: '',
    });

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        if (action === 'update' && itemId) {
            const item = rootStore.bouquetStore.bouquets.find((item) => item.id === itemId);
            if (item) {
                setForm({
                    name: item.name,
                    categoryId: {label: item?.categoryByCategoryId?.name, value: item.categoryByCategoryId?.id},
                    price: item.price?.toString() || '',
                    description: item?.description || '',
                    amount: item.amount?.toString() || '',
                    sale: item.sale?.toString() || '',
                    image: item.image,
                    secondImage: item.secondImage,
                });
                if (item.itemsInBouquetsByBouquetId) {
                    setSelectedItems(item.itemsInBouquetsByBouquetId.nodes.map((item) => ({
                        id: item?.id,
                        quantity: item?.amount,
                        name: item?.itemByItemId?.name,
                    })));
                }
            }
        }
    }, [action, itemId, rootStore.auxiliaryStore.items]);

    // Загрузка изображения на сервер
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('http://localhost:4000/upload-image', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data.imageUrl; // Возвращаем путь к файлу
    };

    // Обработчик изменения изображения
    const handleImageChange = async (e, setImage) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = await uploadImage(file);
            setImage(imageUrl);
        }
    };

    const handleAddItem = () => {
        setSelectedItems([...selectedItems, {id: null, quantity: 1}]);
    };

    const handleRemoveItem = (index) => {
        const newItems = selectedItems.filter((_, i) => i !== index);
        setSelectedItems(newItems);
    };

    const handleItemChange = (index, item) => {
        const newItems = [...selectedItems];
        newItems[index].id = item.value;
        newItems[index].name = item.label;
        setSelectedItems(newItems);
    };

    const handleQuantityChange = (index, quantity) => {
        const newItems = [...selectedItems];
        newItems[index].quantity = quantity;
        setSelectedItems(newItems);
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                ...form,
                image: form.image,
                secondImage: form.secondImage,
                categoryId: form.categoryId.value,
                price: parseFloat(form.price.replace(/\s/g, '')),
                amount: parseInt(form.amount.replace(/\s/g, '')),
                sale: parseInt(form.sale.replace(/\s/g, '')),
                items: selectedItems.map((item) => ({
                    itemId: item.id,
                    quantity: item.quantity,
                })),
            };

            if (action === 'create') {
                const bouquet = await rootStore.bouquetStore.createBouquet(data);
                await rootStore.bouquetStore.updateItemsInBouquet(
                    bouquet.id,
                    selectedItems,
                    true
                );
            } else if (action === 'update' && itemId) {
                await rootStore.bouquetStore.updateItemsInBouquet(
                    itemId,
                    selectedItems,
                    false
                );
                await rootStore.bouquetStore.updateBouquet(itemId, data);
            }
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении букета:', error);
        }
    };

    const getAvailableItems = () => {
        const selectedIds = selectedItems.map((item) => item.id).filter(Boolean);
        return rootStore.auxiliaryStore.items
            .filter((item) => !selectedIds.includes(item.id))
            .map((item) => ({
                label: item.name,
                value: item.id,
            }));
    };

    return (
        <div className={s.formContainer}>
            <div className={s.header}>
                <h2 className={s.formTitle}>{title}</h2>
                <IoClose style={{cursor: 'pointer', width: '25px', height: '25px'}} onClick={onClose}/>
            </div>
            <Input
                placeholder="Название букета"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
            />
            <Select
                value={form.categoryId}
                onChange={(selectedOption) => {
                    setForm((prevState) => ({
                        ...prevState,
                        categoryId: selectedOption,
                    }));
                }}
                options={rootStore.auxiliaryStore.categories.map((category) => ({
                    label: category?.name,
                    value: category?.id,
                }))}
                placeholder={'Категория'}
            />
            <Input
                placeholder="Цена"
                value={form.price}
                onChange={(e) => setForm({...form, price: e.target.value})}
            />
            <div className={s.fileInputContainer}>
                <label className={s.fileInputLabel}>
                    {!form.image && 'Выберите изображение'}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, (url) => setForm({...form, image: url}))}
                        className={s.fileInput}
                    />
                    {form.image &&
                        <img src={`http://localhost:4000${form.image}`} alt="Выбранное изображение" width={150}
                             height={150} className={s.previewImage}/>}
                </label>
                <label className={s.fileInputLabel}>
                    {!form.secondImage && 'Выберите второе изображение'}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, (url) => setForm({...form, secondImage: url}))}
                        className={s.fileInput}
                    />
                    {form.secondImage && (
                        <img src={`http://localhost:4000${form.secondImage}`} alt="Второе изображение" width={150}
                             height={150} className={s.previewImage}/>
                    )}
                </label>
            </div>
            <Input
                placeholder="Описание"
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
            />
            <Input
                placeholder="Количество"
                value={form.amount}
                onChange={(e) => setForm({...form, amount: e.target.value})}
            />
            <Input
                placeholder="Скидка"
                value={form.sale}
                onChange={(e) => setForm({...form, sale: e.target.value})}
            />

            <div className={s.itemSection}>
                <h3>Добавление компонентов</h3>
                {selectedItems.map((item, index) => (
                    <div key={index} className={s.itemRow}>
                        <Select
                            value={item?.id ? {
                                label: item?.name,
                                value: item.id
                            } : {label: '', value: ''}}
                            onChange={(selectedOption) => handleItemChange(index, selectedOption)}
                            options={getAvailableItems()}
                            placeholder="Выберите айтем"
                            rootClassName={s.item}
                        />
                        <Input
                            type="number"
                            placeholder="Количество"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                            min={1}
                            className={s.item}
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            <IoClose style={{cursor: 'pointer', width: '17px', height: '17px'}}
                                     onClick={() => handleRemoveItem(index)}/>
                        </div>
                    </div>
                ))}
                {rootStore.auxiliaryStore.items.length !== selectedItems.length &&
                    <Button type="second" onClick={handleAddItem} placeholder='Добавить айтем'
                            icon={<IoMdAdd
                                style={{cursor: 'pointer', width: '17px', height: '17px', color: 'black'}}/>}/>
                }
            </div>
            <Button type="primary" placeholder={action === 'create' ? 'Создать' : 'Обновить'} onClick={handleSubmit}/>
        </div>
    );
});

export default BouquetDetails;