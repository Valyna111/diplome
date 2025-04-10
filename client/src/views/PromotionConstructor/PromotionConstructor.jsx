import React, {useContext, useState} from "react";
import styles from "./PromotionConstructor.module.css";
import Button from "@/components/Form/Button/Button";
import Input from "@/components/Form/Input/Input";
import StoreContext from "@/store/StoreContext";
import {observer} from "mobx-react-lite";
import {IoMdTrash} from "react-icons/io";
import {IoAdd} from "react-icons/io5";
import {MdOutlineEdit} from "react-icons/md";

const PromotionConstructor = observer(() => {
    const {auxiliaryStore} = useContext(StoreContext);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Загрузка изображения на сервер
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:4000/upload-image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            return data.imageUrl; // Возвращаем путь к файлу
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    // Обработчик изменения изображения
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                setSelectedEvent({...selectedEvent, image: imageUrl});
            }
        }
    };

    // Добавление нового события
    const handleAddEvent = () => {
        setSelectedEvent({
            id: null,
            image: "",
            description: "",
        });
    };

    // Удаление события
    const handleDeleteEvent = async (id) => {
        try {
            await auxiliaryStore.deleteEvent(id);
            setSelectedEvent(null);
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    // Сохранение или публикация события
    const handleSaveEvent = async () => {
        if (!selectedEvent) return;

        try {
            const input = {
                id: selectedEvent.id,
                image: selectedEvent.image,
                description: selectedEvent.description,
            };

            if (selectedEvent.id) {
                await auxiliaryStore.updateEvent(input);
            } else {
                await auxiliaryStore.createEvent(input);
            }
            setSelectedEvent(null);
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

    return (
        <div className={styles.container}>
            {/* 🔹 Левая колонка (список событий) */}
            <div className={styles.leftColumn}>
                <Button
                    className={styles.addButton}
                    onClick={handleAddEvent}
                    placeholder="Добавить событие"
                />

                {auxiliaryStore.isLoading ? (
                    <div>Загрузка...</div>
                ) : (
                    <div className={styles.promotionsList}>
                        {auxiliaryStore.events.map((event) => (
                            <div
                                key={event.id}
                                className={styles.promotionCard}
                                onClick={() => setSelectedEvent(event)}
                            >
                                <img
                                    src={event.image ? `http://localhost:4000${event.image}` : "/placeholder.jpg"}
                                    alt={event.description}
                                    className={styles.promotionImage}
                                />
                                <p>{event.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 🔹 Правая колонка (форма редактирования) */}
            {selectedEvent && (
                <div className={styles.rightColumn}>
                    <h2>{selectedEvent.id ? "Редактировать событие" : "Добавить событие"}</h2>

                    {/* Загрузка изображения */}
                    <div className={styles.imageUploadContainer}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{display: 'none'}}
                            id="event-image-upload"
                        />
                        <Button
                            className={styles.uploadButton}
                            onClick={() => document.getElementById('event-image-upload').click()}
                            placeholder="Загрузить изображение"
                        />
                        {selectedEvent.image && (
                            <img
                                src={selectedEvent.image.startsWith('http')
                                    ? selectedEvent.image
                                    : `http://localhost:4000${selectedEvent.image}`}
                                alt="Preview"
                                className={styles.previewImage}
                            />
                        )}
                    </div>

                    {/* Поле для текста события */}
                    <div className={styles.inputGroup}>
                        <Input
                            id="event-description"
                            value={selectedEvent.description}
                            onChange={(e) =>
                                setSelectedEvent({...selectedEvent, description: e.target.value})
                            }
                            placeholder="Текст события"
                        />
                    </div>

                    {/* Кнопки управления */}
                    <div className={styles.buttonGroup}>
                        <Button
                            className={styles.publishButton}
                            onClick={handleSaveEvent}
                            placeholder={selectedEvent.id ? "Обновить" : "Опубликовать"}
                            icon={selectedEvent.id ? <MdOutlineEdit/> : <IoAdd/>}
                        />
                        {selectedEvent.id && (
                            <Button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteEvent(selectedEvent.id)}
                                placeholder="Удалить"
                                type="second"
                                icon={<IoMdTrash/>}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

export default PromotionConstructor;