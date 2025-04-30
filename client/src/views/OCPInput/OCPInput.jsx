import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Input, message, Modal, Select, Table, Spin} from 'antd';
import {PlusOutlined, ShoppingCartOutlined, UserAddOutlined} from '@ant-design/icons';
import {motion} from 'framer-motion';
import StoreContext from '@/store/StoreContext';
import s from './OCPInput.module.css';

const OCPInput = observer(() => {
    const {ocpStore, authStore, auxiliaryStore} = useContext(StoreContext);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
    const [selectedOCP, setSelectedOCP] = useState(null);
    const [address, setAddress] = useState('');
    const [selectedDeliveryman, setSelectedDeliveryman] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemAmount, setItemAmount] = useState(1);
    const [isGeocoding, setIsGeocoding] = useState(false);

    useEffect(() => {
        ocpStore.fetchAllOCPs();
        auxiliaryStore.loadItems();
        authStore.getAllUsers();
    }, []);

    const handleCreateOCP = async () => {
        if (!address.trim()) {
            message.error('Пожалуйста, введите адрес');
            return;
        }

        setIsGeocoding(true);
        try {
            await ocpStore.createOCP(address);
            message.success('Пункт выдачи успешно создан');
            setIsCreateModalVisible(false);
            setAddress('');
        } catch (error) {
            if (error.message.includes('координаты')) {
                message.error('Не удалось определить координаты для указанного адреса. Пожалуйста, проверьте правильность адреса.');
            } else {
                message.error('Ошибка при создании пункта выдачи');
            }
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleAssignDeliveryman = async () => {
        try {
            await ocpStore.assignDeliveryman(selectedOCP.id, selectedDeliveryman);
            message.success('Доставщик успешно назначен');
            setIsAssignModalVisible(false);
            setSelectedDeliveryman(null);
        } catch (error) {
            message.error('Ошибка при назначении доставщика');
        }
    };

    const handleAddItem = async () => {
        try {
            await ocpStore.addItemToOCP(selectedOCP.id, selectedItem, parseInt(itemAmount));
            message.success('Товар успешно добавлен');
            setIsAddItemModalVisible(false);
            setSelectedItem(null);
            setItemAmount(1);
        } catch (error) {
            message.error('Ошибка при добавлении товара');
        }
    };

    // Filter users with deliveryman role
    const deliverymanOptions = authStore.users
        .filter(user => user.roleByRoleId.id === 6)
        .map(user => ({
            value: user.id,
            label: `${user.username} (${user.email})`
        }));

    const itemOptions = auxiliaryStore.items.map(item => ({
        value: item.id,
        label: `${item.name} (${item.cost} руб.)`
    }));

    const columns = [
        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
            render: (text) => <span className={s.addressCell}>{text}</span>
        },
        {
            title: 'Товары',
            key: 'items',
            render: (_, record) => (
                <div className={s.itemsColumn}>
                    {record.ocpItems?.map(item => (
                        <motion.div
                            key={item.id}
                            className={s.itemTag}
                            whileHover={{scale: 1.05}}
                        >
                            {item.item?.name} × {item.amount}
                        </motion.div>
                    ))}
                </div>
            )
        },
        {
            title: 'Доставщики',
            key: 'deliverymen',
            render: (_, record) => (
                <div className={s.deliverymenColumn}>
                    {record.deliverymen?.map(dm => (
                        <div key={dm.id} className={s.deliverymanTag}>
                            {dm.user?.username}
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <div className={s.actionsColumn}>
                    <Button
                        type="primary"
                        icon={<UserAddOutlined/>}
                        onClick={() => {
                            setSelectedOCP(record);
                            setIsAssignModalVisible(true);
                        }}
                        className={s.actionButton}
                    >
                        Назначить
                    </Button>
                    <Button
                        type="primary"
                        icon={<ShoppingCartOutlined/>}
                        onClick={() => {
                            setSelectedOCP(record);
                            setIsAddItemModalVisible(true);
                        }}
                        className={s.actionButton}
                    >
                        Добавить товар
                    </Button>
                </div>
            )
        }
    ];

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
            className={s.container}
        >
            <div className={s.header}>
                <h1 className={s.title}>Управление пунктами выдачи (OCP)</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    onClick={() => setIsCreateModalVisible(true)}
                    className={s.addButton}
                >
                    Создать пункт выдачи
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={ocpStore.ocpList}
                rowKey="id"
                loading={ocpStore.isLoading}
                className={s.table}
                pagination={{pageSize: 5}}
            />

            {/* Модалка создания OCP */}
            <Modal
                title="Создать новый пункт выдачи"
                visible={isCreateModalVisible}
                onOk={handleCreateOCP}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    setAddress('');
                }}
                okText="Создать"
                cancelText="Отмена"
                confirmLoading={isGeocoding}
            >
                <Spin spinning={isGeocoding}>
                    <Input
                        placeholder="Введите адрес"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={s.input}
                    />
                </Spin>
            </Modal>

            {/* Модалка назначения доставщика */}
            <Modal
                title={`Назначить доставщика для ${selectedOCP?.address}`}
                visible={isAssignModalVisible}
                onOk={handleAssignDeliveryman}
                onCancel={() => {
                    setIsAssignModalVisible(false);
                    setSelectedDeliveryman(null);
                }}
                okText="Назначить"
                cancelText="Отмена"
            >
                <Select
                    placeholder="Выберите доставщика"
                    className={s.modalSelect}
                    onChange={(value) => setSelectedDeliveryman(value)}
                    options={deliverymanOptions}
                    showSearch
                    optionFilterProp="label"
                    style={{width: '100%'}}
                />
            </Modal>

            {/* Модалка добавления товара */}
            <Modal
                title={`Добавить товар в ${selectedOCP?.address}`}
                visible={isAddItemModalVisible}
                onOk={handleAddItem}
                onCancel={() => {
                    setIsAddItemModalVisible(false);
                    setSelectedItem(null);
                    setItemAmount(1);
                }}
                okText="Добавить"
                cancelText="Отмена"
            >
                <Select
                    placeholder="Выберите товар"
                    className={s.modalSelect}
                    onChange={(value) => setSelectedItem(value)}
                    options={itemOptions}
                    showSearch
                    optionFilterProp="label"
                    style={{width: '100%', marginBottom: 16}}
                />
                <Input
                    type="number"
                    placeholder="Количество"
                    value={itemAmount}
                    onChange={(e) => setItemAmount(e.target.value)}
                    className={s.modalInput}
                    min={1}
                />
            </Modal>
        </motion.div>
    );
});

export default OCPInput;