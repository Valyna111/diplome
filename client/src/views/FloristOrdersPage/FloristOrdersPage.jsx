import React, {useContext, useEffect, useState} from 'react';
import {Badge, Button, Card, Divider, List, message, Spin, Typography} from 'antd';
import {AnimatePresence, motion} from 'framer-motion';
import styles from './FloristOrdersPage.module.css';
import StoreContext from "@/store/StoreContext";
import {observer} from "mobx-react-lite";

const {Text, Title} = Typography;

const FloristOrdersPage = observer(() => {
    const {orderStore, authStore} = useContext(StoreContext);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        orderStore.fetchAvailableOrdersFloris();
    }, [authStore.currentUser]);

    const handleStatusChange = async (orderId, statusId) => {
        try {
            await orderStore.updateOrderStatus(orderId, statusId);
            message.success('Статус заказа обновлен');
            await orderStore.fetchAvailableOrdersFloris();
            setSelectedOrder(orderStore.availableOrders.find(o => o.id === orderId) || null);
        } catch (error) {
            message.error('Ошибка при обновлении статуса');
        }
    };

    const filteredOrders = orderStore.availableOrders;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Новый':
                return 'blue';
            case 'В процессе':
                return 'orange';
            case 'Собран':
                return 'green';
            case 'Доставлен':
                return 'purple';
            case 'Отменён':
                return 'red';
            default:
                return 'default';
        }
    };

    return (
        <div className={styles.container}>
            {/* Left Column - Orders List */}
            <motion.div
                className={styles.leftColumn}
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.3}}
            >
                <Title level={3} className={styles.title}>Заказы для сборки</Title>
                <Divider/>

                {loading ? (
                    <Spin size="large" className={styles.spinner}/>
                ) : (
                    <AnimatePresence>
                        {filteredOrders.length === 0 ? (
                            <Card className={styles.emptyCard}>
                                <Text type="secondary">Нет доступных заказов для сборки</Text>
                            </Card>
                        ) : (
                            <List
                                dataSource={filteredOrders}
                                renderItem={(order) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, x: -20}}
                                        transition={{duration: 0.2}}
                                    >
                                        <Badge.Ribbon
                                            text={order.status.name}
                                            color={getStatusColor(order.status.name)}
                                        >
                                            <Card
                                                hoverable
                                                className={`${styles.orderCard} ${
                                                    selectedOrder?.id === order.id ? styles.selected : ''
                                                }`}
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <div className={styles.orderHeader}>
                                                    <Title level={4} className={styles.orderTitle}>
                                                        Заказ #{order.id}
                                                    </Title>
                                                    <Text type="secondary">
                                                        {`${new Date(Number(order.orderDate)).toLocaleDateString('ru-RU', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                        })} в ${order.orderTime.slice(0, -3)}`}
                                                    </Text>
                                                </div>
                                                <Text strong>{order.customer?.username || 'Клиент'}</Text>
                                                <Text className={styles.orderPrice}>
                                                    {order.price.toLocaleString()} ₽
                                                </Text>
                                            </Card>
                                        </Badge.Ribbon>
                                    </motion.div>
                                )}
                            />
                        )}
                    </AnimatePresence>
                )}
            </motion.div>

            {/* Right Column - Order Details */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        className={styles.rightColumn}
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: 20}}
                        transition={{duration: 0.3}}
                    >
                        <div className={styles.detailsHeader}>
                            <Title level={3}>Детали заказа #{selectedOrder.id}</Title>
                            <Button
                                type="text"
                                onClick={() => setSelectedOrder(null)}
                                className={styles.closeButton}
                            >
                                ×
                            </Button>
                        </div>

                        <Divider/>

                        <div className={styles.customerInfo}>
                            <Text strong>Клиент:</Text>
                            <Text>{selectedOrder.customer?.username || 'Не указан'}</Text>
                            <Text strong>Телефон:</Text>
                            <Text>{selectedOrder.customer?.phone || 'Не указан'}</Text>
                            <Text strong>Адрес:</Text>
                            <Text>{selectedOrder.address || selectedOrder.ocp?.address || 'Не указан'}</Text>
                        </div>

                        <Divider orientation="left">Состав заказа</Divider>

                        <List
                            dataSource={selectedOrder.items}
                            renderItem={(item) => (
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.2}}
                                >
                                    <Card className={styles.itemCard}>
                                        <div className={styles.itemContent}>
                                            <div>
                                                <Text strong>{item.bouquet.name}</Text>
                                                <Text className={styles.itemDescription}>
                                                    {item.bouquet.description}
                                                </Text>
                                            </div>
                                            <div className={styles.itemMeta}>
                                                <Text>{item.quantity} шт.</Text>
                                                <Text strong>{item.price.toLocaleString()} ₽</Text>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}
                        />

                        <div className={styles.orderTotal}>
                            <Text strong>Итого:</Text>
                            <Text strong>{selectedOrder.price.toLocaleString()} ₽</Text>
                        </div>

                        <Divider/>

                        <div className={styles.actions}>
                            <Button
                                type="primary"
                                size="large"
                                className={styles.actionButton}
                                onClick={() => handleStatusChange(selectedOrder.id, 2)} // Собран
                                disabled={selectedOrder.status.id === 2}
                                loading={orderStore.isLoading}
                            >
                                Заказ собран
                            </Button>
                            {selectedOrder.status.id === 2 && selectedOrder.orderType === 'pickup' && (
                                <Button
                                    type="primary"
                                    size="large"
                                    className={styles.actionButton}
                                    onClick={() => handleStatusChange(selectedOrder.id, 4)} // Доставлен
                                    loading={orderStore.isLoading}
                                >
                                    Заказ доставлен
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default FloristOrdersPage;