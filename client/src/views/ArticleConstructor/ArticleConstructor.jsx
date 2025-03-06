import { useState } from "react";
import styles from "./ArticleConstructor.module.css";
import Button from "@/components/Form/Button/Button";
import Input from "@/components/Form/Input/Input";

const initialArticles = [
  {
    id: 1,
    images: ["", "", ""],
    title: "Как продлить жизнь букета",
    sections: [
      { title: "Обрезка стеблей", text: "Перед тем как поставить букет в вазу, подрежьте стебли под углом 45 градусов." },
      { title: "Чистая вода", text: "Меняйте воду каждые два дня и промывайте вазу, чтобы предотвратить размножение бактерий." },
      { title: "Оптимальная температура", text: "Избегайте прямых солнечных лучей и сквозняков, чтобы цветы не увядали раньше времени." }
    ]
  }
];

const ArticleConstructor = () => {
  const [articles, setArticles] = useState(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleAddArticle = () => {
    setSelectedArticle({
      id: Date.now(),
      images: ["", "", ""],
      title: "",
      sections: [
        { title: "", text: "" },
        { title: "", text: "" },
        { title: "", text: "" }
      ]
    });
  };

  const handleDeleteArticle = (id) => {
    setArticles(articles.filter(article => article.id !== id));
    setSelectedArticle(null);
  };

  const handlePublishArticle = () => {
    if (selectedArticle.id) {
      const exists = articles.find(article => article.id === selectedArticle.id);
      if (exists) {
        setArticles(articles.map(article => article.id === selectedArticle.id ? selectedArticle : article));
      } else {
        setArticles([...articles, selectedArticle]);
      }
      setSelectedArticle(null);
    }
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updatedImages = [...selectedArticle.images];
      updatedImages[index] = imageUrl;
      setSelectedArticle({ ...selectedArticle, images: updatedImages });
    }
  };

  return (
    <div className={styles.container}>
      {/* 🔹 Левая колонка (список статей) */}
      <div className={styles.leftColumn}>
        <Button className={styles.addButton} onClick={handleAddArticle} placeholder="➕ Добавить статью" />

        <div className={styles.articlesList}>
          {articles.map(article => (
            <div key={article.id} className={styles.articleCard} onClick={() => setSelectedArticle(article)}>
              <img src={article.images[0] || "/placeholder.jpg"} alt={article.title} className={styles.articleImage} />
              <h3>{article.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Правая колонка (форма редактирования) */}
      {selectedArticle && (
        <div className={styles.rightColumn}>
          <h2>{selectedArticle.id ? "Редактировать статью" : "Добавить статью"}</h2>

          {/* Загрузка изображений */}
          <div className={styles.imageUploadContainer}>
            {selectedArticle.images.map((img, index) => (
              <div key={index} className={styles.imageUpload}>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} />
                <Button className={styles.uploadButton} onClick={() => document.getElementsByTagName("input")[index].click()} placeholder="Загрузить" />
                {img && <img src={img} alt={`Preview ${index + 1}`} className={styles.previewImage} />}
              </div>
            ))}
          </div>

          {/* Текстовые поля */}
          <div className={styles.inputGroup}>
            <Input
              id="article-title"
              value={selectedArticle.title}
              onChange={e => setSelectedArticle({ ...selectedArticle, title: e.target.value })}
              placeholder="Заголовок статьи"
            />

            {selectedArticle.sections.map((section, index) => (
              <div key={index} className={styles.sectionBlock}>
                <Input
                  id={`article-section${index}-text`}
                  value={section.text}
                  onChange={e => {
                    const updatedSections = [...selectedArticle.sections];
                    updatedSections[index].text = e.target.value;
                    setSelectedArticle({ ...selectedArticle, sections: updatedSections });
                  }}
                  placeholder={`Описание ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <div className={styles.buttonGroup}>
            <Button className={styles.publishButton} onClick={handlePublishArticle} placeholder="✅ Опубликовать" />
            <Button className={styles.deleteButton} onClick={() => handleDeleteArticle(selectedArticle.id)} placeholder="🗑 Удалить" type="second" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleConstructor;
