import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import StoreContext from '@/store/StoreContext';
import {useNavigate} from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Empty,
  List,
  message,
  Popconfirm,
  Skeleton,
  Space,
  Tabs,
  Tag,
  Typography
} from 'antd';
import {CarOutlined, CheckOutlined, EnvironmentOutlined, UserOutlined} from '@ant-design/icons';
import {motion} from 'framer-motion';
import styles from './DeliveryDriver.module.css';
import {MdOutlinePayment} from "react-icons/md";

const {Title, Text} = Typography;
const {TabPane} = Tabs;

const DeliveryDriver = observer(() => {
    const {orderStore, authStore} = useContext(StoreContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');

    useEffect(() => {
        orderStore.fetchDeliverymanOrders();
        orderStore.fetchAvailableOrders();
    }, [authStore.currentUser]);

    const handleTakeOrder = async (orderId) => {
        try {
            await orderStore.takeOrder(orderId);
            message.success('Заказ успешно принят!');
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            await orderStore.updateOrderStatus(orderId, 4);
            message.success('Заказ завершен!');
        } catch (error) {
            message.error(error.message);
        }
    };

    const activeOrders = orderStore.deliverymanOrders.filter(
        order => !['Доставлен', 'Отменён'].includes(order.status.name)
    );

    const completedOrders = orderStore.deliverymanOrders.filter(
        order => order.status.name === 'Доставлен'
    );

    const getStatusTag = (status) => {
        const statusMap = {
            'Новый': {color: 'blue', text: 'Новый'},
            'Собран': {color: 'geekblue', text: 'Собран'},
            'В процессе': {color: 'orange', text: 'В процессе доставки'},
            'Доставлен': {color: 'green', text: 'Доставлен'},
            'Отменён': {color: 'red', text: 'Отменён'}
        };

        return (
            <Tag color={statusMap[status]?.color || 'default'}>
                {statusMap[status]?.text || status}
            </Tag>
        );
    };

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className={styles.container}
        >
            <Title level={3} className={styles.title}>
                {authStore.currentUser?.role_name === 'deliveryman' ? 'Мои заказы' : 'Заказы на доставку'}
            </Title>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className={styles.tabs}
            >
                {authStore.currentUser?.role_name === 'deliveryman' && (
                    <TabPane tab="Доступные заказы" key="available">
                        {orderStore.isLoading ? (
                            <Card>
                                <Skeleton active paragraph={{rows: 4}}/>
                            </Card>
                        ) : orderStore.availableOrders.length === 0 ? (
                            <Empty
                                description="Нет доступных заказов"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ) : (
                            <List
                                itemLayout="vertical"
                                dataSource={orderStore.availableOrders}
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
                                                    {getStatusTag(order.status.name)}
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
                                                    <Space direction="vertical" size="small">
                                                        <Space>
                                                            {order.orderType === 'delivery' ? (
                                                                <>
                                                                    <CarOutlined/>
                                                                    <Text>Доставка по адресу: {order.address}</Text>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <EnvironmentOutlined/>
                                                                    <Text>Самовывоз из: {order.ocp?.address}</Text>
                                                                </>
                                                            )}
                                                        </Space>
                                                        <Space>
                                                            <Text strong>Клиент:</Text>
                                                            <Avatar
                                                                size="small"
                                                                icon={<UserOutlined/>}
                                                                src={order.customer?.avatar}
                                                            />
                                                            <Text>{order.customer?.username}</Text>
                                                        </Space>
                                                    </Space>
                                                </div>

                                                <div className={styles.orderItems}>
                                                    <Title level={5} className={styles.itemsTitle}>
                                                        Состав заказа:
                                                    </Title>
                                                    <List
                                                        dataSource={order.items.slice(0, 2)}
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
                                                                    description={`${item.bouquet.price} ₽ × ${item.quantity}`}
                                                                />
                                                            </List.Item>
                                                        )}
                                                    />
                                                    {order.items.length > 2 && (
                                                        <Text type="secondary">
                                                            +{order.items.length - 2} еще
                                                        </Text>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.orderFooter}>
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleTakeOrder(order.id)}
                                                    loading={orderStore.isLoading}
                                                >
                                                    Принять заказ
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                )}
                            />
                        )}
                    </TabPane>
                )}

                <TabPane tab="Активные заказы" key="active">
                    {orderStore.isLoading ? (
                        <Card>
                            <Skeleton active paragraph={{rows: 4}}/>
                        </Card>
                    ) : activeOrders.length === 0 ? (
                        <Empty
                            description="Нет активных заказов"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <List
                            itemLayout="vertical"
                            dataSource={activeOrders}
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
                                                {getStatusTag(order.status.name)}
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
                                                <Space direction="vertical" size="small">
                                                    <Space>
                                                        <Text strong>Клиент:</Text>
                                                        <Avatar
                                                            size="small"
                                                            icon={<UserOutlined/>}
                                                            src={order.customer?.avatar}
                                                        />
                                                        <Text>{order.customer?.username} {order.customer?.phone}</Text>
                                                    </Space>
                                                    <Space>
                                                        <CarOutlined/>
                                                        <Text>Доставка по адресу: {order.address}</Text>
                                                    </Space>
                                                    <Space>
                                                        <MdOutlinePayment style={{marginTop: '7px'}}/>
                                                        <Text>Тип
                                                            оплаты: {order.paymentType === 'cash' ? 'при получении' : 'оплачен онлайн'}</Text>
                                                    </Space>
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
                                                                        <Text>{item.bouquet.price} ₽
                                                                            × {item.quantity}</Text>
                                                                        {/*{item.addons?.length > 0 && (*/}
                                                                        {/*    <Text type="secondary">*/}
                                                                        {/*        Допы: {item.addons.join(', ')}*/}
                                                                        {/*    </Text>*/}
                                                                        {/*)}*/}
                                                                    </Space>
                                                                }
                                                            />
                                                            <Text
                                                                strong>{(item.price * item.quantity).toFixed(2)} ₽</Text>
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.orderFooter}>
                                            <Space>
                                                {order.status.name.toLowerCase() !== 'новый' && (
                                                    <Popconfirm
                                                        title="Подтвердите завершение заказа"
                                                        onConfirm={() => handleCompleteOrder(order.id)}
                                                        okText="Да"
                                                        cancelText="Нет"
                                                    >
                                                        <Button type="primary" ghost icon={<CheckOutlined/>}>
                                                            Завершить
                                                        </Button>
                                                    </Popconfirm>
                                                )}
                                            </Space>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}
                        />
                    )}
                </TabPane>

                <TabPane tab="Завершенные" key="completed">
                    {orderStore.isLoading ? (
                        <Card>
                            <Skeleton active paragraph={{rows: 4}}/>
                        </Card>
                    ) : completedOrders.length === 0 ? (
                        <Empty
                            description="Нет завершенных заказов"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <List
                            itemLayout="vertical"
                            dataSource={completedOrders}
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
                                                {getStatusTag(order.status.name)}
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
                                                <Space direction="vertical" size="small">
                                                    <Space>
                                                        {order.orderType === 'delivery' ? (
                                                            <>
                                                                <CarOutlined/>
                                                                <Text>Доставка по адресу: {order.address}</Text>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EnvironmentOutlined/>
                                                                <Text>Самовывоз из: {order.ocp?.address}</Text>
                                                            </>
                                                        )}
                                                    </Space>
                                                    <Space>
                                                        <Text strong>Клиент:</Text>
                                                        <Avatar
                                                            size="small"
                                                            icon={<UserOutlined/>}
                                                            src={order.customer?.avatar}
                                                        />
                                                        <Text>{order.customer?.username}</Text>
                                                    </Space>
                                                </Space>
                                            </div>

                                            <div className={styles.orderItems}>
                                                <Title level={5} className={styles.itemsTitle}>
                                                    Состав заказа:
                                                </Title>
                                                <List
                                                    dataSource={order.items.slice(0, 3)}
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
                                                                description={`${item.bouquet.price} ₽ × ${item.quantity}`}
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                                {order.items.length > 3 && (
                                                    <Text type="secondary">
                                                        +{order.items.length - 3} еще
                                                    </Text>
                                                )}
                                            </div>
                                        </div>

                                        {/*<div className={styles.orderFooter}>*/}
                                        {/*    <Button*/}
                                        {/*        type="link"*/}
                                        {/*        onClick={() => navigate(`/delivery/orders/${order.id}`)}*/}
                                        {/*    >*/}
                                        {/*        Подробнее*/}
                                        {/*    </Button>*/}
                                        {/*</div>*/}
                                    </Card>
                                </motion.div>
                            )}
                        />
                    )}
                </TabPane>
            </Tabs>
        </motion.div>
    );
});

export default DeliveryDriver;