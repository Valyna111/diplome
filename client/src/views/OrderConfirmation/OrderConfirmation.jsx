import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {CheckCircleFilled, ShoppingCartOutlined} from '@ant-design/icons';
import {Avatar, Badge, Button, Card, Col, Divider, List, Result, Row, Typography} from 'antd';
import styles from './OrderConfirmation.module.css';

const {Title, Text} = Typography;

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;


    const primaryColor = "#e91e63";
    const secondaryColor = "#d81b60";

    const handleContinueShopping = () => {
        navigate('/main/catalog');
    };

    const handleGoToOrders = () => {
        navigate('/user/order-history');
    };

    return (
        <div className={styles.container}>
            <Result
                icon={<CheckCircleFilled style={{color: primaryColor}}/>}
                title="Заказ успешно оформлен!"
                subTitle={`Номер вашего заказа: #${order?.id || '0000'}`}
                extra={[
                    <Button
                        type="primary"
                        key="continue"
                        onClick={handleContinueShopping}
                        icon={<ShoppingCartOutlined/>}
                        style={{background: primaryColor, borderColor: secondaryColor}}
                    >
                        Продолжить покупки
                    </Button>,
                    <Button
                        key="orders"
                        onClick={handleGoToOrders}
                    >
                        Мои заказы
                    </Button>,
                ]}
            />

            <Card className={styles.summaryCard}>
                <Title level={4} className={styles.summaryTitle}>Детали заказа</Title>

                <Row gutter={16}>
                    <Col span={12}>
                        <Text strong>Сумма:</Text>
                        <Text> {order?.price.toFixed(2)} ₽</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Статус:</Text>
                        <Text> {order?.status?.name || "Новый"}</Text>
                    </Col>
                    {order?.address && (
                        <Col span={24} style={{marginTop: 12}}>
                            <Text strong>Адрес доставки:</Text>
                            <Text> {order.address}</Text>
                        </Col>
                    )}
                    {order?.ocp && (
                        <Col span={24} style={{marginTop: 12}}>
                            <Text strong>Пункт выдачи:</Text>
                            <Text> {order.ocp.address}</Text>
                        </Col>
                    )}
                </Row>

                <Divider/>

                <Title level={5}>Состав заказа</Title>
                <List
                    itemLayout="horizontal"
                    dataSource={order?.items || []}
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
        </div>
    );
};

export default OrderConfirmation;