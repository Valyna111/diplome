import React from 'react';
import {Button, Descriptions, List, Modal, Tag, Typography} from 'antd';
import {motion} from 'framer-motion';

const {Text, Title} = Typography;

const OrderDetailsModal = ({visible, order, onCancel, showActions, onComplete}) => {
    if (!order) return null;

    return (
        <Modal
            title={`Детали заказа #${order.id}`}
            visible={visible}
            onCancel={onCancel}
            footer={
                showActions ? (
                    <Button type="primary" onClick={onComplete}>
                        Завершить доставку
                    </Button>
                ) : null
            }
            width={800}
        >
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.3}}
            >
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Статус">
                        <Tag color={
                            order.status.name === 'pending' ? 'orange' :
                                order.status.name === 'in_progress' ? 'blue' : 'green'
                        }>
                            {order.status.name.toUpperCase()}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Дата/время">
                        {order.orderDate} {order.orderTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="Тип заказа">
                        {order.orderType === 'delivery' ? 'Доставка' : 'Самовывоз'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Способ оплаты">
                        {order.paymentType}
                    </Descriptions.Item>
                    {order.address && (
                        <Descriptions.Item label="Адрес доставки" span={2}>
                            {order.address}
                        </Descriptions.Item>
                    )}
                    {order.pickupPoint && (
                        <Descriptions.Item label="Пункт выдачи" span={2}>
                            {order.pickupPoint.address}
                        </Descriptions.Item>
                    )}
                    {order.deliveryInfo && (
                        <Descriptions.Item label="Курьер" span={2}>
                            {order.deliveryInfo.deliveryman.username} (тел: {order.deliveryInfo.deliveryman.phone})
                            <br/>
                            <Text type="secondary">Принят: {order.deliveryInfo.assignedAt}</Text>
                        </Descriptions.Item>
                    )}
                </Descriptions>

                <Title level={5} style={{marginTop: 24}}>Состав заказа</Title>
                <List
                    dataSource={order.items}
                    renderItem={(item) => (
                        <List.Item>
                            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                                <div>
                                    <Text strong>{item.bouquet.name}</Text>
                                    <Text type="secondary"> x{item.quantity}</Text>
                                </div>
                                <Text strong>{item.price * item.quantity} ₽</Text>
                            </div>
                        </List.Item>
                    )}
                />

                <div style={{textAlign: 'right', marginTop: 16}}>
                    <Text strong>Итого: {order.price} ₽</Text>
                </div>
            </motion.div>
        </Modal>
    );
};

export default OrderDetailsModal;