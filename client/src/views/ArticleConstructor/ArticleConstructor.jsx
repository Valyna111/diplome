import React, {useContext, useState} from "react";
import styles from "./ArticleConstructor.module.css";
import Button from "@/components/Form/Button/Button";
import Input from "@/components/Form/Input/Input";
import StoreContext from "@/store/StoreContext";
import {observer} from "mobx-react-lite";
import {IoMdTrash} from "react-icons/io";
import {IoAdd} from "react-icons/io5";
import {MdOutlineEdit} from "react-icons/md";

const ArticleConstructor = observer(() => {
    const {auxiliaryStore} = useContext(StoreContext);
    const [selectedArticle, setSelectedArticle] = useState(null);

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
            return data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    // Обработчик изменения изображения
    const handleImageChange = async (e, imageField) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                setSelectedArticle({
                    ...selectedArticle,
                    [imageField]: imageUrl
                });
            }
        }
    };

    // Добавление новой статьи
    const handleAddArticle = () => {
        setSelectedArticle({
            id: null,
            header: "",
            image1: "",
            image2: "",
            image3: "",
            description1: "",
            description2: "",
            description3: ""
        });
    };

    // Удаление статьи
    const handleDeleteArticle = async (id) => {
        try {
            await auxiliaryStore.deleteArticle(id);
            setSelectedArticle(null);
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    };

    // Сохранение или публикация статьи
    const handlePublishArticle = async () => {
        if (!selectedArticle) return;

        try {
            const input = {
                id: selectedArticle.id,
                header: selectedArticle.header,
                image1: selectedArticle.image1,
                image2: selectedArticle.image2,
                image3: selectedArticle.image3,
                description1: selectedArticle.description1,
                description2: selectedArticle.description2,
                description3: selectedArticle.description3
            };

            if (selectedArticle.id) {
                await auxiliaryStore.updateArticle(input);
            } else {
                await auxiliaryStore.createArticle(input);
            }
            setSelectedArticle(null);
        } catch (error) {
            console.error("Error saving article:", error);
        }
    };

    return (
        <div className={styles.container}>
            {/* 🔹 Левая колонка (список статей) */}
            <div className={styles.leftColumn}>
                <Button
                    className={styles.addButton}
                    onClick={handleAddArticle}
                    placeholder="Добавить статью"
                    icon={<IoAdd/>}
                />

                {auxiliaryStore.isLoading ? (
                    <div>Загрузка...</div>
                ) : (
                    <div className={styles.articlesList}>
                        {auxiliaryStore.articles.map(article => (
                            <div
                                key={article.id}
                                className={styles.articleCard}
                                onClick={() => setSelectedArticle(article)}
                            >
                                <img
                                    src={article.image1
                                        ? `http://localhost:4000${article.image1}`
                                        : "/placeholder.jpg"}
                                    alt={article.header}
                                    className={styles.articleImage}
                                />
                                <h3>{article.header}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 🔹 Правая колонка (форма редактирования) */}
            {selectedArticle && (
                <div className={styles.rightColumn}>
                    <h2>{selectedArticle.id ? "Редактировать статью" : "Добавить статью"}</h2>

                    {/* Заголовок статьи */}
                    <div className={styles.inputGroup}>
                        <Input
                            value={selectedArticle.header}
                            onChange={e => setSelectedArticle({
                                ...selectedArticle,
                                header: e.target.value
                            })}
                            placeholder="Заголовок статьи"
                        />
                    </div>

                    {/* Загрузка изображений */}
                    <div className={styles.imageUploadContainer}>
                        {[1, 2, 3].map((num) => (
                            <div key={`image${num}`} className={styles.imageUploadSection}>
                                <h4>Изображение {num}</h4>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, `image${num}`)}
                                    style={{display: 'none'}}
                                    id={`article-image-upload-${num}`}
                                />
                                <Button
                                    className={styles.uploadButton}
                                    onClick={() => document.getElementById(`article-image-upload-${num}`).click()}
                                    placeholder={`Загрузить изображение ${num}`}
                                />
                                {selectedArticle[`image${num}`] && (
                                    <img
                                        src={
                                            selectedArticle[`image${num}`].startsWith('http')
                                                ? selectedArticle[`image${num}`]
                                                : `http://localhost:4000${selectedArticle[`image${num}`]}`
                                        }
                                        alt={`Preview ${num}`}
                                        className={styles.previewImage}
                                    />
                                )}
                                <Input
                                    value={selectedArticle[`description${num}`] || ''}
                                    onChange={e => setSelectedArticle({
                                        ...selectedArticle,
                                        [`description${num}`]: e.target.value
                                    })}
                                    placeholder={`Описание для изображения ${num}`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className={styles.buttonGroup}>
                        <Button
                            className={styles.publishButton}
                            onClick={handlePublishArticle}
                            placeholder={selectedArticle.id ? "Обновить" : "Опубликовать"}
                            icon={selectedArticle.id ? <MdOutlineEdit/> : <IoAdd/>}
                        />
                        {selectedArticle.id && (
                            <Button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteArticle(selectedArticle.id)}
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

export default ArticleConstructor;