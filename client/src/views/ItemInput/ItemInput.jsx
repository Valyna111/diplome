import React, { useContext, useMemo, useState } from 'react';
import Button from '@/components/Form/Button/Button';
import Input from '@/components/Form/Input/Input';
import s from './ItemInput.module.css';
import { observer } from 'mobx-react-lite';
import StoreContext from "@/store/StoreContext";
import { Tabs } from 'antd';
import TypesAndCategoriesTable from "@/views/ItemInput/Table/TypesAndCategoriesTable/TypesAndCategoriesTable";
import ModalItemCategory from "@/views/ItemInput/ModalItemCategory/ModalItemCategory";
import ItemDetails from "@/views/ItemInput/Forms/Item/ItemDetails";
import ItemsTable from "@/views/ItemInput/Table/ItemsTable/ItemsTable";

const { TabPane } = Tabs;

const ItemInput = observer(() => {
  const rootStore = useContext(StoreContext);
  const auxiliaryStore = rootStore.auxiliaryStore;

  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showCreateBouquetForm, setShowCreateBouquetForm] = useState(false);
  const [image, setImage] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabKey, setActiveTabKey] = useState("types");

  const [form, setForm] = useState({
    type: '',
    id: undefined,
  });

  const handleCreate = (type) => {
    auxiliaryStore.ModalItemCategory.onOpen({
      type: type,
      action: 'Создание',
    });
  };

  // Фильтрация данных по поисковому запросу
  const filteredData = useMemo(() => {
    return auxiliaryStore.items.filter((item) => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [auxiliaryStore.items, searchQuery]);

  const dataSourceItems = useMemo(() => auxiliaryStore.items.map((item) => ({
    key: item.id,
    id: item.id,
    name: item.name,
    typeName: item?.typeByTypeId?.name || 'Не указан',
  })), [auxiliaryStore.items]);

  return (
    <div className={s.container}>
      <div className={`${s.leftSide} ${form.type !== '' ? s.slideIn : s.slideOut}`}>
        {/* Формы для добавления компонентов и создания букетов */}
        {form.type === 'component' ? (
          <ItemDetails
            itemId={form.id}
            title={form.title}
            action={form.action}
            onClose={() => setForm({ type: '', id: undefined })}
          />
        ) : form.type === 'bouquet' ? (
          <div className={s.formContainer}>
            <h2 className={s.formTitle}>Создать букет</h2>
            <form className={s.form}>
              <Input placeholder="Название букета" className={s.input} />
              <Input placeholder="Категория" className={s.input} />
              <Input placeholder="Цена" className={s.input} />
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
              <Input placeholder="Описание" className={s.input} />
              <Input placeholder="Скидка" className={s.input} />
              <div className={s.fileInputContainer}>
                <label className={s.fileInputLabel}>
                  Выберите второе изображение
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(e, setSecondImage)}
                    className={s.fileInput}
                  />
                </label>
                {secondImage && <img src={secondImage} alt="Второе изображение" className={s.previewImage} />}
              </div>
              <Button type="primary" placeholder="Создать" className={s.submitButton} onClick={() => setForm({ type: '', id: undefined })} />
            </form>
          </div>
        ) : null}
      </div>

      <div className={s.rightSide}>
        <Input
          placeholder="Поиск"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={s.searchInput}
        />
        <Tabs
          defaultActiveKey="types"
          size="large"
          animated
          activeKey={activeTabKey}
          onChange={(key) => setActiveTabKey(key)} // Обработчик изменения вкладки
        >
          <TabPane tab="Типы" key="types">
            <Button
              type="primary"
              onClick={() => handleCreate('типа')}
              style={{ marginBottom: 16 }}
              placeholder="Создать тип"
            />
            <div className={s.componentsList}>
              <TypesAndCategoriesTable type="типа" data={filteredData} />
            </div>
          </TabPane>
          <TabPane tab="Категории" key="categories">
            <Button
              type="primary"
              onClick={() => handleCreate('категории')}
              style={{ marginBottom: 16 }}
              placeholder="Создать категорию"
            />
            <div className={s.componentsList}>
              <TypesAndCategoriesTable type="категории" data={filteredData} />
            </div>
          </TabPane>
          <TabPane tab="Компоненты" key="components">
            <Button
              type="primary"
              onClick={() => setForm({ type: 'component', id: undefined })}
              style={{ marginBottom: 16 }}
              placeholder="Создать компонент"
            />
            <ItemsTable setEditItemId={(value) => setForm({ type: 'component', id: value.id, action: 'update', title: 'Обновление компонeнта ' + value.name })} dataSource={dataSourceItems} />
          </TabPane>
          <TabPane tab="Букеты" key="bouquets">
            <Button
              type="primary"
              placeholder="Создать букет"
              onClick={() => setForm({ type: 'bouquet', id: undefined })}
              className={s.button}
            />
            <div className={s.componentsList}>
              {/* Здесь можно добавить логику отображения списка или других данных для букета */}
              <div>Букеты пока не добавлены</div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <ModalItemCategory />
    </div>
  );
});

export default ItemInput;
