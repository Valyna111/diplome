import React, {useContext, useEffect, useState} from 'react';
import {message, Table} from 'antd';
import {UserAddOutlined, UserDeleteOutlined} from '@ant-design/icons';
import Button from '@/components/Form/Button/Button';
import s from './UserInput.module.css';
import {observer} from "mobx-react-lite";
import ModalCreateUser from "./Modal/ModalCreateUser";
import StoreContext from '@/store/StoreContext';
import roles from "@/views/UserInput/roles";

const UserInput = observer(() => {
    const {authStore} = useContext(StoreContext);
    const [isModalCreateUser, setIsModalCreateUser] = useState(false);

    useEffect(() => {
        authStore.getAllUsers();
    }, [authStore.currentUser]);

    const handleToggleBlock = async (userId, isBlocked) => {
        try {
            await authStore.toggleUserBlock(userId, isBlocked);
            message.success(`Пользователь успешно ${isBlocked ? 'разблокирован' : 'заблокирован'}`);
        } catch (error) {
            message.error('Ошибка при изменении статуса пользователя');
        }
    };

    const getRoleLabel = (roleId) => {
        const role = roles.find(r => r.value === roleId);
        return role ? role.label : 'Неизвестная роль';
    };

    const columns = [
        {title: 'Имя', dataIndex: 'username', key: 'username'},
        {title: 'Фамилия', dataIndex: 'surname', key: 'surname'},
        {title: 'Email', dataIndex: 'email', key: 'email'},
        {title: 'Телефон', dataIndex: 'phone', key: 'phone'},
        {
            title: 'Роль',
            key: 'role',
            render: (_, record) => getRoleLabel(record.roleByRoleId?.id)
        },
        {
            title: 'Статус',
            key: 'status',
            render: (_, record) => record.isBlocked ? 'Заблокирован' : 'Активен'
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                !record.isBlocked ? (
                    <Button
                        icon={<UserDeleteOutlined/>}
                        onClick={() => handleToggleBlock(record.id, record.isBlocked)}
                        placeholder="Заблокировать"
                        width={160}
                    />
                ) : (
                    <Button
                        type="second"
                        icon={<UserAddOutlined/>}
                        onClick={() => handleToggleBlock(record.id, record.isBlocked)}
                        placeholder="Разблокировать"
                        width={160}
                    />
                )
            ),
        },
    ];

    return (
        <div className={s.container}>
            <h2 className={s.title}>Управление пользователями</h2>
            <Button
                type="primary"
                onClick={() => setIsModalCreateUser(true)}
                className={s.addUserButton}
                placeholder="Добавить пользователя"
                width={215}
            />

            <Table
                dataSource={authStore.users || []}
                columns={columns}
                rowKey="id"
                loading={authStore.isLoading}
                className={s.table}
            />

            <ModalCreateUser
                isOpen={isModalCreateUser}
                onClose={() => setIsModalCreateUser(false)}
                onSubmit={() => setIsModalCreateUser(false)}
            />
        </div>
    );
});

export default UserInput;