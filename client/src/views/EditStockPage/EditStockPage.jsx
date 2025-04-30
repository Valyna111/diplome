import React, { useContext, useEffect, useState } from 'react';
import { Table, Input, Button, message, Spin, Select, Modal, Form, InputNumber, Popconfirm } from 'antd';
import { observer } from 'mobx-react-lite';
import StoreContext from '@/store/StoreContext';
import styles from './EditStockPage.module.css';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditStockPage = observer(() => {
    const { stockStore, ocpStore } = useContext(StoreContext);
    const [editingId, setEditingId] = useState(null);
    const [editingAmount, setEditingAmount] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        ocpStore.fetchAllOCPs();
        return () => stockStore.setSelectedOcpId(null);
    }, []);

    const handleOcpChange = (ocpId) => {
        setEditingId(null);
        stockStore.setSelectedOcpId(ocpId);
    };

    const handleEdit = (id, amount) => {
        setEditingId(id);
        setEditingAmount(amount.toString());
    };

    const handleSave = async (id) => {
        if (!editingAmount || isNaN(editingAmount) || editingAmount < 0) {
            message.error('Пожалуйста, введите корректное количество');
            return;
        }

        try {
            const result = await stockStore.updateStockItem(id, parseInt(editingAmount));
            if (result.success) {
                message.success('Количество успешно обновлено');
                setEditingId(null);
                setEditingAmount('');
            } else {
                message.error(result.message || 'Ошибка при обновлении количества');
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await stockStore.deleteStockItem(id);
            if (result.success) {
                message.success('Товар успешно удален');
            } else {
                message.error(result.message || 'Ошибка при удалении товара');
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const result = await stockStore.createStockItem(values);
            if (result.success) {
                message.success('Товар успешно добавлен');
                setIsModalVisible(false);
                form.resetFields();
            } else {
                message.error(result.message || 'Ошибка при добавлении товара');
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    const columns = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Стоимость',
            dataIndex: 'cost',
            key: 'cost',
            render: (cost) => `${cost.toLocaleString()} ₽`,
        },
        {
            title: 'Количество',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount, record) => (
                editingId === record.id ? (
                    <Input
                        type="number"
                        value={editingAmount}
                        onChange={(e) => setEditingAmount(e.target.value)}
                        min={0}
                        style={{ width: 100 }}
                    />
                ) : (
                    amount
                )
            ),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <div className={styles.actionButtons}>
                    {editingId === record.id ? (
                        <Button
                            type="primary"
                            onClick={() => handleSave(record.id)}
                            loading={stockStore.isLoading}
                        >
                            Сохранить
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={() => handleEdit(record.id, record.amount)}
                                disabled={stockStore.isLoading}
                            >
                                Изменить
                            </Button>
                            <Popconfirm
                                title="Вы уверены, что хотите удалить этот товар?"
                                onConfirm={() => handleDelete(record.id)}
                                okText="Да"
                                cancelText="Нет"
                            >
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    disabled={stockStore.isLoading}
                                />
                            </Popconfirm>
                        </>
                    )}
                </div>
            ),
        },
    ];

    if (ocpStore.isLoading) {
        return (
            <div className={styles.spinnerContainer}>
                <Spin size="large" />
            </div>
        );
    }

    const filteredItems = stockStore.selectedOcpId 
        ? stockStore.stockItems.filter(item => item.ocpId === stockStore.selectedOcpId)
        : [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Управление складом</h1>
                {stockStore.selectedOcpId && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showModal}
                    >
                        Добавить товар
                    </Button>
                )}
            </div>
            
            <div className={styles.ocpSelector}>
                <Select
                    placeholder="Выберите пункт сбора"
                    onChange={handleOcpChange}
                    style={{ width: 300, marginBottom: 20 }}
                    loading={ocpStore.isLoading}
                    value={stockStore.selectedOcpId}
                >
                    {ocpStore.ocpList.map(ocp => (
                        <Option key={ocp.id} value={ocp.id}>
                            {ocp.address}
                        </Option>
                    ))}
                </Select>
            </div>

            {stockStore.selectedOcpId ? (
                <Table
                    dataSource={filteredItems}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    loading={stockStore.isLoading}
                />
            ) : (
                <div className={styles.noOcpSelected}>
                    Выберите пункт сбора для просмотра товаров
                </div>
            )}

            <Modal
                title="Добавить новый товар"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={stockStore.isLoading}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Название"
                        rules={[{ required: true, message: 'Введите название товара' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="typeId"
                        label="Тип"
                        rules={[{ required: true, message: 'Выберите тип товара' }]}
                    >
                        <Select>
                            {stockStore.itemTypes.map(type => (
                                <Option key={type.id} value={type.id}>
                                    {type.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="cost"
                        label="Стоимость"
                        rules={[{ required: true, message: 'Введите стоимость товара' }]}
                    >
                        <InputNumber
                            min={0}
                            step={0.01}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        label="Количество"
                        rules={[{ required: true, message: 'Введите количество товара' }]}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
});

export default EditStockPage;