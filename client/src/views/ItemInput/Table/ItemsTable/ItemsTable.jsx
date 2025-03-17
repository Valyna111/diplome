import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import StoreContext from "@/store/StoreContext";

const ItemsTable = observer(({ setEditItemId, dataSource }) => {
    const rootStore = useContext(StoreContext);
    const auxiliaryStore = rootStore.auxiliaryStore;

    // Колонки таблицы
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80, // Уменьшаем ширину столбца ID
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Тип',
            dataIndex: 'typeName',
            key: 'typeName',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => setEditItemId({ id: record.id, name: record.name })}
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                    />
                    <DeleteOutlined
                        onClick={() => {
                            auxiliaryStore.ModalItemCategory.onOpen({
                                type: 'компонент',
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
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                scroll={{ y: 400 }}
            />
        </div>
    );
});

export default ItemsTable;
