import React, {useContext, useState} from "react";
import styles from "./ArticleConstructor.module.css";
import Button from "@/components/Form/Button/Button";
import Input from "@/components/Form/Input/Input";
import StoreContext from "@/store/StoreContext";
import {observer} from "mobx-react-lite";
import {IoMdTrash} from "react-icons/io";
import {IoAdd} from "react-icons/io5";
import {MdOutlineEdit} from "react-icons/md";
import {BiImageAdd} from "react-icons/bi";
import {FiSave} from "react-icons/fi";

const ArticleConstructor = observer(() => {
    const {auxiliaryStore} = useContext(StoreContext);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Загрузка изображения на сервер
    const uploadImage = async (file) => {
        setIsUploading(true);
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
        } finally {
            setIsUploading(false);
        }
    };

    // Обработчик изменения изображения
    const handleImageChange = async (e, blockIndex) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                const newBlocks = [...selectedArticle.articleBlocksByArticleId.nodes];
                newBlocks[blockIndex] = {
                    ...newBlocks[blockIndex],
                    image: imageUrl
                };
                setSelectedArticle({
                    ...selectedArticle,
                    articleBlocksByArticleId: {
                        nodes: newBlocks
                    }
                });
            }
        }
    };

    // Добавление новой статьи
    const handleAddArticle = () => {
        setSelectedArticle({
            id: null,
            header: "",
            articleBlocksByArticleId: {
                nodes: [{ image: "", text: "", orderNum: 1 }]
            }
        });
    };

    // Добавление нового блока
    const handleAddBlock = () => {
        setSelectedArticle({
            ...selectedArticle,
            articleBlocksByArticleId: {
                nodes: [
                    ...selectedArticle.articleBlocksByArticleId.nodes,
                    { 
                        image: "", 
                        text: "", 
                        orderNum: selectedArticle.articleBlocksByArticleId.nodes.length + 1 
                    }
                ]
            }
        });
    };

    // Удаление блока
    const handleRemoveBlock = (index) => {
        if (selectedArticle.articleBlocksByArticleId.nodes.length > 1) {
            const newBlocks = selectedArticle.articleBlocksByArticleId.nodes
                .filter((_, i) => i !== index)
                .map((block, i) => ({
                    ...block,
                    orderNum: i + 1
                }));
            setSelectedArticle({
                ...selectedArticle,
                articleBlocksByArticleId: {
                    nodes: newBlocks
                }
            });
        }
    };

    // Удаление статьи
    const handleDeleteArticle = async (id) => {
        if (window.confirm("Вы уверены, что хотите удалить эту статью?")) {
            try {
                await auxiliaryStore.deleteArticle(id);
                setSelectedArticle(null);
            } catch (error) {
                console.error("Error deleting article:", error);
            }
        }
    };

    // Сохранение или публикация статьи
    const handlePublishArticle = async () => {
        if (!selectedArticle) return;

        try {
            const input = {
                id: selectedArticle.id,
                header: selectedArticle.header,
                blocks: selectedArticle.articleBlocksByArticleId.nodes
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
                    icon={<IoAdd size={20}/>}
                />

                {auxiliaryStore.isLoading ? (
                    <div className={styles.loading}>Загрузка...</div>
                ) : (
                    <div className={styles.articlesList}>
                        {auxiliaryStore.articles.map(article => (
                            <div
                                key={article.id}
                                className={styles.articleCard}
                                onClick={() => setSelectedArticle(article)}
                            >
                                <img
                                    src={article.articleBlocksByArticleId.nodes[0]?.image
                                        ? `http://localhost:4000${article.articleBlocksByArticleId.nodes[0].image}`
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

                    {/* Блоки статьи */}
                    <div className={styles.blocksContainer}>
                        {selectedArticle.articleBlocksByArticleId.nodes.map((block, index) => (
                            <div key={index} className={styles.block}>
                                <div className={styles.blockHeader}>
                                    <h4>Блок {block.orderNum}</h4>
                                    {selectedArticle.articleBlocksByArticleId.nodes.length > 1 && (
                                        <Button
                                            className={styles.removeBlockButton}
                                            onClick={() => handleRemoveBlock(index)}
                                            placeholder="Удалить блок"
                                            type="second"
                                            icon={<IoMdTrash size={18}/>}
                                        />
                                    )}
                                </div>
                                
                                <div className={styles.imageUploadSection}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, index)}
                                        style={{display: 'none'}}
                                        id={`article-image-upload-${index}`}
                                    />
                                    <Button
                                        className={styles.uploadButton}
                                        onClick={() => document.getElementById(`article-image-upload-${index}`).click()}
                                        placeholder={isUploading ? "Загрузка..." : "Загрузить изображение"}
                                        icon={<BiImageAdd size={18}/>}
                                        disabled={isUploading}
                                    />
                                    {block.image && (
                                        <img
                                            src={
                                                block.image.startsWith('http')
                                                    ? block.image
                                                    : `http://localhost:4000${block.image}`
                                            }
                                            alt={`Preview ${index + 1}`}
                                            className={styles.previewImage}
                                        />
                                    )}
                                </div>

                                <Input
                                    value={block.text || ''}
                                    onChange={e => {
                                        const newBlocks = [...selectedArticle.articleBlocksByArticleId.nodes];
                                        newBlocks[index] = {
                                            ...newBlocks[index],
                                            text: e.target.value
                                        };
                                        setSelectedArticle({
                                            ...selectedArticle,
                                            articleBlocksByArticleId: {
                                                nodes: newBlocks
                                            }
                                        });
                                    }}
                                    placeholder="Текст блока"
                                    multiline
                                    rows={4}
                                />
                            </div>
                        ))}

                        <Button
                            className={styles.addBlockButton}
                            onClick={handleAddBlock}
                            placeholder="Добавить блок"
                            icon={<IoAdd size={20}/>}
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <Button
                            className={styles.publishButton}
                            onClick={handlePublishArticle}
                            placeholder={selectedArticle.id ? "Сохранить изменения" : "Опубликовать статью"}
                            icon={<FiSave size={18}/>}
                        />
                        {selectedArticle.id && (
                            <Button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteArticle(selectedArticle.id)}
                                placeholder="Удалить статью"
                                type="second"
                                icon={<IoMdTrash size={18}/>}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

export default ArticleConstructor;