import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import StoreContext from '@/store/StoreContext';
import {
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
    Typography,
    Row,
    Col
} from 'antd';
import {
    CarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EnvironmentOutlined,
    UserOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import {motion} from 'framer-motion';
import styles from './ManagerOrdersPage.module.css';
import {MdOutlinePayment} from "react-icons/md";

const {Title, Text} = Typography;
const {TabPane} = Tabs;

const ManagerOrdersPage = observer(() => {
    const {orderStore, authStore} = useContext(StoreContext);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        orderStore.fetchAllOrders();
    }, [authStore.currentUser]);

    const handleCancelOrder = async (orderId) => {
        try {
            await orderStore.updateOrderStatus(orderId, 5); // 5 - статус "Отменен"
            message.success('Заказ успешно отменен');
            orderStore.fetchAllOrders();
        } catch (error) {
            message.error('Ошибка при отмене заказа');
        }
    };

    const getStatusTag = (status) => {
        const statusMap = {
            'Новый': {color: 'blue', text: 'Новый', icon: <ClockCircleOutlined/>},
            'Собран': {color: 'geekblue', text: 'Собран', icon: <CheckCircleOutlined/>},
            'В процессе': {color: 'orange', text: 'В процессе доставки', icon: <CarOutlined/>},
            'Доставлен': {color: 'green', text: 'Доставлен', icon: <CheckCircleOutlined/>},
            'Отменён': {color: 'red', text: 'Отменён', icon: <CloseCircleOutlined/>}
        };

        return (
            <Tag 
                color={statusMap[status]?.color || 'default'}
                className={styles.statusTag}
                icon={statusMap[status]?.icon}
            >
                {statusMap[status]?.text || status}
            </Tag>
        );
    };

    const filteredOrders = orderStore.allOrders.filter(order => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return !['Доставлен', 'Отменён'].includes(order.status.name);
        if (activeTab === 'completed') return order.status.name === 'Доставлен';
        if (activeTab === 'cancelled') return order.status.name === 'Отменён';
        return true;
    });

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className={styles.container}
        >
            <Title level={3} className={styles.title}>Управление заказами</Title>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className={styles.tabs}
                size="large"
            >
                <TabPane tab="Все заказы" key="all"/>
                <TabPane tab="Активные" key="active"/>
                <TabPane tab="Завершенные" key="completed"/>
                <TabPane tab="Отмененные" key="cancelled"/>
            </Tabs>

            {orderStore.isLoading ? (
                <Card className={styles.skeletonCard}>
                    <Skeleton active paragraph={{rows: 4}}/>
                </Card>
            ) : filteredOrders.length === 0 ? (
                <Empty
                    description="Нет заказов"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className={styles.emptyState}
                />
            ) : (
                <div className={styles.ordersContainer}>
                    <Row gutter={[16, 16]}>
                        {filteredOrders.map((order) => (
                            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8} key={order.id}>
                                <motion.div
                                    initial={{y: 20, opacity: 0}}
                                    animate={{y: 0, opacity: 1}}
                                    transition={{duration: 0.3}}
                                    style={{height: '100%'}}
                                >
                                    <Card className={styles.orderCard}>
                                        <div className={styles.orderHeader}>
                                            <Space direction="vertical" size={4}>
                                                <Text strong>Заказ #{order.id}</Text>
                                                <div className={styles.orderDate}>
                                                    <ClockCircleOutlined/>
                                                    {`${new Date(Number(order.orderDate)).toLocaleDateString('ru-RU', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    })} в ${order.orderTime.slice(0, -3)}`}
                                                </div>
                                            </Space>
                                            <Space>
                                                {getStatusTag(order.status.name)}
                                                <Text strong className={styles.orderPrice}>
                                                    {order.price.toFixed(2)} ₽
                                                </Text>
                                            </Space>
                                        </div>

                                        <div className={styles.orderContent}>
                                            <div className={styles.orderInfo}>
                                                <Space direction="vertical" size="small">
                                                    <div className={styles.customerInfo}>
                                                        <UserOutlined/>
                                                        <Text ellipsis>{order.customer?.username || 'Не указан'}</Text>
                                                        <Text type="secondary" ellipsis>{order.customer?.phone || ''}</Text>
                                                    </div>
                                                    <div className={styles.customerInfo}>
                                                        {order.orderType === 'delivery' ? (
                                                            <>
                                                                <CarOutlined/>
                                                                <Text ellipsis>Доставка по адресу: {order.address}</Text>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EnvironmentOutlined/>
                                                                <Text ellipsis>Самовывоз из: {order.ocp?.address}</Text>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className={styles.customerInfo}>
                                                        <MdOutlinePayment style={{marginTop: '7px'}}/>
                                                        <Text ellipsis>Тип оплаты: {order.paymentType === 'cash' ? 'при получении' : 'оплачен онлайн'}</Text>
                                                    </div>
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
                                                                title={<Text ellipsis>{item.bouquet.name}</Text>}
                                                                description={
                                                                    <Space>
                                                                        <Text>{item.bouquet.price} ₽ × {item.quantity}</Text>
                                                                    </Space>
                                                                }
                                                            />
                                                            <Text strong>{(item.price * item.quantity).toFixed(2)} ₽</Text>
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {order.status.name !== 'Отменён' && order.status.name !== 'Доставлен' && (
                                            <div className={styles.orderFooter}>
                                            
                                                <Popconfirm
                                                    title="Вы уверены, что хотите отменить заказ?"
                                                    onConfirm={() => handleCancelOrder(order.id)}
                                                    okText="Да"
                                                    cancelText="Нет"
                                                >
                                                    <Button 
                                                        danger 
                                                        icon={<CloseCircleOutlined/>}
                                                        className={styles.actionButton}
                                                    >
                                                        Отменить заказ
                                                    </Button>
                                                </Popconfirm>
                                            </div>
                                        )}
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </motion.div>
    );
});

export default ManagerOrdersPage; 