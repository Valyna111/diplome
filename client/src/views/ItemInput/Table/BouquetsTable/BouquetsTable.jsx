import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Space, Image } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import StoreContext from "@/store/StoreContext";

const BouquetsTable = observer(({
                                    setEditBouquetId,
                                    dataSource
                                }) => {
    const rootStore = useContext(StoreContext);

    // Колонки таблицы
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Категория',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Цена',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Изображение',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                <Image
                    src={`http://localhost:4000${image}`}
                    alt="Букет"
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover' }}
                />
            ),
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Количество',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Скидка',
            dataIndex: 'sale',
            key: 'sale',
            render: (sale) => (sale ? `${sale}%` : 'Нет скидки'),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => {
                            setEditBouquetId({ id: record.id, name: record.name });
                        }}
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                    />
                    <DeleteOutlined
                        onClick={() => {
                            // Открываем модальное окно для удаления букета
                            rootStore.auxiliaryStore.ModalItemCategory.onOpen({
                                type: 'букет',
                                id: record.id,
                                action: 'Удаление',
                                name: record.name,
                            });
                        }}
                        style={{ cursor: 'pointer', color: '#ff4d4f' }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            pagination={false}
        />
    );
});

export default BouquetsTable;