import React, {useContext, useMemo} from 'react';
import { observer } from 'mobx-react-lite';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Space } from 'antd';
import StoreContext from "@/store/StoreContext";
import {toJS} from "mobx";

const TypesAndCategoriesTable = observer(({ type }) => {
    const rootStore = useContext(StoreContext);
    const auxiliaryStore = rootStore.auxiliaryStore;

    // Выбор данных в зависимости от типа (типы или категории)
    const dataSource = useMemo(() => {
        return type === 'типа' ? auxiliaryStore.types : auxiliaryStore.categories;
    }, [type, auxiliaryStore.types, auxiliaryStore.categories]);

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
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() =>
                            auxiliaryStore.ModalItemCategory.onOpen({
                                type: type,
                                id: record.id,
                                action: 'Редактирование',
                                name: record.name,
                            })
                        }
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                    />
                    <DeleteOutlined
                        onClick={() =>
                            auxiliaryStore.ModalItemCategory.onOpen({
                                type: type,
                                id: record.id,
                                action: 'Удаление',
                                name: record.name,
                            })
                        }
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
            key={type}
        />
    );
});

export default TypesAndCategoriesTable;