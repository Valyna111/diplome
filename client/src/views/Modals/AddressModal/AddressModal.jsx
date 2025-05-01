import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import StoreContext from '@/store/StoreContext';
import { Modal, Form, Input, Button, message } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

const AddressModal = observer(() => {
    const rootStore = useContext(StoreContext);
    const authStore = rootStore.authStore;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const success = await authStore.updateUserAddress(values.address);
            if (!success) {
                message.error(authStore.error || 'Ошибка при сохранении адреса');
                return;
            }
            message.success('Адрес успешно сохранен');
            authStore.setAddressModalOpen(false);
        } catch (error) {
            message.error('Произошла ошибка при сохранении адреса');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        authStore.setAddressModalOpen(false);
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <EnvironmentOutlined />
                    <span>Укажите ваш адрес</span>
                </div>
            }
            open={authStore.isAddressModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={500}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ address: '' }}
            >
                <Form.Item
                    name="address"
                    label="Адрес"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите адрес' },
                        { min: 5, message: 'Адрес должен содержать минимум 5 символов' }
                    ]}
                >
                    <Input
                        rows={3}
                        placeholder="Введите ваш адрес"
                        disabled={loading}
                    />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button onClick={handleCancel} disabled={loading}>
                        Отмена
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Сохранить
                    </Button>
                </div>
            </Form>
        </Modal>
    );
});

export default AddressModal; 