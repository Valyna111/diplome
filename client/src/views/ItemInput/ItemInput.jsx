import React, {useContext, useMemo, useState} from 'react';
import Button from '@/components/Form/Button/Button';
import Input from '@/components/Form/Input/Input';
import s from './ItemInput.module.css';
import {observer} from 'mobx-react-lite';
import StoreContext from "@/store/StoreContext";
import {Tabs} from 'antd';
import TypesAndCategoriesTable from "@/views/ItemInput/Table/TypesAndCategoriesTable/TypesAndCategoriesTable";
import ModalItemCategory from "@/views/ItemInput/ModalItemCategory/ModalItemCategory";
import ItemDetails from "@/views/ItemInput/Forms/Item/ItemDetails";
import ItemsTable from "@/views/ItemInput/Table/ItemsTable/ItemsTable";
import BouquetDetails from "@/views/ItemInput/Forms/Bouquet/BouqetDetails";
import BouquetsTable from "@/views/ItemInput/Table/BouquetsTable/BouquetsTable";

const {TabPane} = Tabs;

const ItemInput = observer(() => {
    const rootStore = useContext(StoreContext);
    const auxiliaryStore = rootStore.auxiliaryStore;

    const [searchQuery, setSearchQuery] = useState('');

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

    const dataSourceBouquets = useMemo(() => rootStore.bouquetStore.bouquets.map((item) => ({
        key: item?.id,
        id: item?.id,
        name: item?.name,
        category: item?.categoryByCategoryId?.name,
        image: item?.image,
        description: item?.description,
        sale: item?.sale,
        price: item?.price,
    })), [rootStore.bouquetStore.bouquets]);

    return (
        <div className={s.container}>
            <div className={`${s.leftSide} ${form.type !== '' ? s.slideIn : s.slideOut}`}>
                {/* Формы для добавления компонентов и создания букетов */}
                {form.type === '' ?
                    <>
                    </>
                    : form.type === 'component' ? (
                        <ItemDetails itemId={form.id} title={form.title} action={form.action}
                                     onClose={() => setForm({type: '', id: undefined})}/>
                    ) : (
                        <BouquetDetails itemId={form.id} title={form.title} action={form.action}
                                        onClose={() => setForm({type: '', id: undefined})}/>
                    )}
            </div>

            <div className={s.rightSide}>
                <Input
                    placeholder="Поиск"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={s.searchInput}
                />
                <Tabs defaultActiveKey="types" size='large' animated>
                    <TabPane tab="Типы" key="types">
                        <Button
                            type="primary"
                            onClick={() => handleCreate('типа')}
                            style={{marginBottom: 16}}
                            placeholder="Создать тип"
                        />
                        <div className={s.componentsList}>
                            <TypesAndCategoriesTable type="типа"/>
                        </div>
                    </TabPane>
                    <TabPane tab="Категории" key="categories">
                        <Button
                            type="primary"
                            onClick={() => handleCreate('категории')}
                            style={{marginBottom: 16}}
                            placeholder="Создать категорию"
                        />
                        <div className={s.componentsList}>
                            <TypesAndCategoriesTable type="категории"/>
                        </div>
                    </TabPane>
                    <TabPane tab="Компоненты" key="components">
                        <Button
                            type="primary"
                            onClick={() => setForm({type: 'component', id: undefined})}
                            style={{marginBottom: 16}}
                            placeholder="Создать компонент"
                        />
                        <ItemsTable setEditItemId={(value) => setForm({
                            type: 'component',
                            id: value.id,
                            action: 'update',
                            title: 'Обновление компонeнта ' + value.name
                        })} dataSource={dataSourceItems}/>
                    </TabPane>
                    <TabPane tab="Букеты" key="bouquets">
                        <Button
                            type="primary"
                            placeholder="Создать букет"
                            onClick={() => setForm({type: 'boquet', id: undefined})}
                            style={{marginBottom: 16}}
                        />
                        <BouquetsTable dataSource={dataSourceBouquets} setEditBouquetId={(v) => setForm({
                            type: 'boquet',
                            id: v.id,
                            action: 'update',
                            title: 'Обновление букеты ' + v.name
                        })}/>
                    </TabPane>
                </Tabs>
            </div>
            <ModalItemCategory/>
        </div>
    );
});

export default ItemInput;