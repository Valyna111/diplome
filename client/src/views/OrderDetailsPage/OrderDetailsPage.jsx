import React, {useContext, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import StoreContext from '@/store/StoreContext';
import {useNavigate, useParams} from 'react-router-dom';
import {Avatar, Badge, Button, Card, List, Steps, Typography} from 'antd';
import {
    ArrowLeftOutlined,
    CarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import styles from './OrderDetails.module.css';

const {Title, Text} = Typography;
const {Step} = Steps;

const statusSteps = [
    {title: 'Новый', status: 'wait'},
    {title: 'В обработке', status: 'wait'},
    {title: 'В пути', status: 'wait'},
    {title: 'Доставлен', status: 'wait'},
];

const OrderDetailsPage = observer(() => {
    const {orderStore} = useContext(StoreContext);
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        if (id) {
            orderStore.fetchOrderDetails(parseInt(id));
        }
    }, [id]);

    const getCurrentStep = (statusName) => {
        const statusIndex = statusSteps.findIndex(step => step.title === statusName);
        return statusIndex >= 0 ? statusIndex : 0;
    };

    const updateStatus = async (newStatusId) => {
        try {
            await orderStore.updateOrderStatus(orderStore.currentOrder.id, newStatusId);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (!orderStore.currentOrder) {
        return <div>Loading...</div>;
    }

    const order = orderStore.currentOrder;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined/>}
                    onClick={() => navigate(-1)}
                    className={styles.backButton}
                />
                <Title level={3} className={styles.title}>Заказ #{order.id}</Title>
            </div>

            <Card className={styles.statusCard}>
                <Steps current={getCurrentStep(order.status.name)}>
                    {statusSteps.map((step, index) => (
                        <Step
                            key={step.title}
                            title={step.title}
                            icon={index <= getCurrentStep(order.status.name) ? <CheckCircleOutlined/> :
                                <ClockCircleOutlined/>}
                        />
                    ))}
                </Steps>
            </Card>

            <Card className={styles.infoCard}>
                <div className={styles.infoRow}>
                    <Text strong>Дата заказа:</Text>
                    <Text>{new Date(order.orderDate).toLocaleString()}</Text>
                </div>

                <div className={styles.infoRow}>
                    <Text strong>Сумма:</Text>
                    <Text>{order.price.toFixed(2)} ₽</Text>
                </div>

                <div className={styles.infoRow}>
                    <Text strong>Способ оплаты:</Text>
                    <Text>{order.paymentType === 'cash' ? 'Наличные' : 'Карта'}</Text>
                </div>

                {order.orderType === 'delivery' ? (
                    <div className={styles.infoRow}>
                        <CarOutlined className={styles.icon}/>
                        <div>
                            <Text strong>Адрес доставки:</Text>
                            <Text>{order.address}</Text>
                        </div>
                    </div>
                ) : (
                    <div className={styles.infoRow}>
                        <EnvironmentOutlined className={styles.icon}/>
                        <div>
                            <Text strong>Пункт выдачи:</Text>
                            <Text>{order.ocp?.address}</Text>
                        </div>
                    </div>
                )}
            </Card>

            <Card className={styles.itemsCard}>
                <Title level={5} className={styles.sectionTitle}>Состав заказа</Title>
                <List
                    itemLayout="horizontal"
                    dataSource={order.items}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Badge count={item.quantity}>
                                        <Avatar
                                            src={`http://localhost:4000${item.bouquet.image}`}
                                            shape="square"
                                            size={64}
                                        />
                                    </Badge>
                                }
                                title={item.bouquet.name}
                                description={`${item.price} ₽ × ${item.quantity}`}
                            />
                            <div>{(item.quantity * item.price).toFixed(2)} ₽</div>
                        </List.Item>
                    )}
                />
            </Card>

            {/* Action buttons for deliveryman */}
            {authStore.currentUser?.role === 'deliveryman' && (
                <div className={styles.actions}>
                    {order.status.id === 2 && (
                        <Button
                            type="primary"
                            onClick={() => updateStatus(3)} // Mark as "In Transit"
                        >
                            Начать доставку
                        </Button>
                    )}
                    {order.status.id === 3 && (
                        <Button
                            type="primary"
                            onClick={() => updateStatus(4)} // Mark as "Delivered"
                        >
                            Завершить доставку
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
});

export default OrderDetailsPage;