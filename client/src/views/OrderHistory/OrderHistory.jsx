import React, {useContext, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import StoreContext from '@/store/StoreContext';
import {useNavigate} from 'react-router-dom';
import {Badge, Button, Card, Empty, List, Skeleton, Space, Tag, Typography} from 'antd';
import {
    CarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    EnvironmentOutlined,
    SyncOutlined
} from '@ant-design/icons';
import {motion} from 'framer-motion';
import styles from './OrderHistory.module.css';
import {toJS} from "mobx";

const {Title, Text} = Typography;

const statusIcons = {
    pending: <ClockCircleOutlined style={{color: '#faad14'}}/>,
    processing: <SyncOutlined spin style={{color: '#1890ff'}}/>,
    completed: <CheckCircleOutlined style={{color: '#52c41a'}}/>,
    cancelled: <CloseCircleOutlined style={{color: '#f5222d'}}/>
};

const statusColors = {
    pending: 'warning',
    processing: 'processing',
    completed: 'success',
    cancelled: 'error'
};

const OrderHistory = observer(() => {
    const {orderStore, authStore} = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        orderStore.fetchUserOrders();
    }, [authStore.currentUser]);

    const getDeliveryMethod = (order) => {
        return order.orderType === 'delivery' ? (
            <Space>
                <CarOutlined/>
                <Text>Доставка по адресу: {order.address}</Text>
            </Space>
        ) : (
            <Space>
                <EnvironmentOutlined/>
                <Text>Самовывоз из: {order.ocp?.address}</Text>
            </Space>
        );
    };

    console.log(toJS(orderStore.userOrders));

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className={styles.container}
        >
            <Title level={3} className={styles.title}>
                Мои заказы
            </Title>

            {orderStore.isLoading ? (
                <Card>
                    <Skeleton active paragraph={{rows: 4}}/>
                </Card>
            ) : orderStore.userOrders.length === 0 ? (
                <Empty
                    description="У вас пока нет заказов"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button type="primary" onClick={() => navigate('/catalog')}>
                        Перейти в каталог
                    </Button>
                </Empty>
            ) : (
                <List
                    itemLayout="vertical"
                    dataSource={orderStore.userOrders}
                    renderItem={(order) => (
                        <motion.div
                            key={order.id}
                            initial={{y: 20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3}}
                        >
                            <Card className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <Space size="large">
                                        <Text strong>Заказ #{order.id}</Text>
                                        <Tag icon={statusIcons[order.status.name.toLowerCase()]}
                                             color={statusColors[order.status.name.toLowerCase()]}>
                                            {order.status.name}
                                        </Tag>
                                        <Text type="secondary">
                                            {`${new Date(Number(order.orderDate)).toLocaleDateString('ru-RU', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })} в ${order.orderTime.slice(0, -3)}`}
                                        </Text>
                                    </Space>
                                    <Text strong className={styles.orderPrice}>
                                        {order.price.toFixed(2)} ₽
                                    </Text>
                                </div>

                                <div className={styles.orderContent}>
                                    <div className={styles.orderInfo}>
                                        {getDeliveryMethod(order)} <br/>
                                        <Space>
                                            <Text strong>Способ оплаты:</Text>
                                            <Text>{order.paymentType === 'cash' ? 'Наличные' : 'Карта'}</Text>
                                        </Space>
                                    </div>

                                    <div className={styles.orderItems}>
                                        <Title level={5} className={styles.itemsTitle}>
                                            Состав заказа:
                                        </Title>
                                        <List
                                            dataSource={order.items}
                                            renderItem={(item) => (
                                                <List.Item key={item.id}>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Badge count={item.quantity}>
                                                                <img
                                                                    src={`http://localhost:4000${item.bouquet.image}`}
                                                                    alt={item.bouquet.name}
                                                                    className={styles.itemImage}
                                                                />
                                                            </Badge>
                                                        }
                                                        title={item.bouquet.name}
                                                        description={
                                                            <Space>
                                                                <Text>{item.bouquet.price} ₽ × {item.quantity}</Text>
                                                                {/*{item.addons?.length > 0 && (*/}
                                                                {/*    <Text type="secondary">*/}
                                                                {/*        Допы: {item.addons?.join(', ')}*/}
                                                                {/*    </Text>*/}
                                                                {/*)}*/}
                                                            </Space>
                                                        }
                                                    />
                                                    <Text strong>{(item.price * item.quantity).toFixed(2)} ₽</Text>
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                </div>

                            </Card>
                        </motion.div>
                    )}
                />
            )}
        </motion.div>
    );
});

export default OrderHistory;