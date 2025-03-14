import React, { useState } from 'react';
import { Table, List, message } from 'antd';
import { EyeInvisibleOutlined, UserDeleteOutlined } from '@ant-design/icons';
import Input from '@/components/Form/Input/Input'; // Путь к компоненту Input
import Button from '@/components/Form/Button/Button'; // Путь к компоненту Button
import s from './UserComments.module.css';

const UserComments = () => {
  const [users, setUsers] = useState([
    { id: 1, username: 'User1', passhash: 'hashed1', email: 'user1@example.com', phone: '1234567890', role_id: 1, surname: 'Smith', isBlocked: false, comments: [] },
    { id: 2, username: 'User2', passhash: 'hashed2', email: 'user2@example.com', phone: '0987654321', role_id: 2, surname: 'Johnson', isBlocked: false, comments: [] },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserData, setNewUserData] = useState({
    username: '',
    passhash: '',
    email: '',
    phone: '',
    role_id: 1,
    surname: '',
  });

  // Функция для блокировки/разблокировки пользователя
  const handleBlockUser = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, isBlocked: !user.isBlocked };
      }
      return user;
    });
    setUsers(updatedUsers);
    message.success('Пользователь заблокирован/разблокирован');
  };

  // Функция для скрытия/отображения комментария
  const handleHideComment = (userId, commentId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          comments: user.comments.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, isHidden: !comment.isHidden };
            }
            return comment;
          })
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    message.success('Комментарий скрыт/отображен');
  };

  // Функция для добавления нового пользователя
  const handleAddUser = () => {
    if (newUserData.username && newUserData.surname) {
      const newUser = {
        id: Date.now(),
        ...newUserData,
        isBlocked: false,
        comments: [],
      };
      setUsers([...users, newUser]);
      setNewUserData({
        username: '',
        passhash: '',
        email: '',
        phone: '',
        role_id: 1,
        surname: '',
      });
      message.success('Пользователь добавлен');
    } else {
      message.error('Заполните обязательные поля');
    }
  };

  // Данные для таблицы пользователей
  const dataSource = users.map(user => ({
    key: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role_id === 1 ? 'User' : 'Admin',
    actions: (
      <Button
        type="danger"
        icon={<UserDeleteOutlined />}
        onClick={() => handleBlockUser(user.id)}
        placeholder={user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
      />
    ),
  }));

  // Колонки для таблицы пользователей
  const userColumns = [
    { title: 'Имя пользователя', dataIndex: 'username', key: 'username' },
    { title: 'Фамилия', dataIndex: 'surname', key: 'surname' },
    { title: 'Электронная почта', dataIndex: 'email', key: 'email' },
    { title: 'Телефон', dataIndex: 'phone', key: 'phone' },
    { title: 'Роль', dataIndex: 'role', key: 'role' },
    { title: 'Действия', key: 'actions', render: (_, record) => record.actions },
  ];

  return (
    <div className={s.container}>
      <h2 className={s.title}>Список пользователей</h2>

      {/* Форма для добавления нового пользователя */}
      <div className={s.addUserForm}>
        <div className={s.inputGroup}>
          <Input
            value={newUserData.username}
            onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
            placeholder="Имя пользователя"
            className={s.addUserInput}
          />
          <Input
            value={newUserData.surname}
            onChange={(e) => setNewUserData({ ...newUserData, surname: e.target.value })}
            placeholder="Фамилия"
            className={s.addUserInput}
          />
          <Input
            value={newUserData.passhash}
            onChange={(e) => setNewUserData({ ...newUserData, passhash: e.target.value })}
            placeholder="Пароль"
            className={s.addUserInput}
          />
        </div>
        <div className={s.inputGroup}>
          <Input
            value={newUserData.email}
            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
            placeholder="Электронная почта"
            className={s.addUserInput}
          />
          <Input
            value={newUserData.phone}
            onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
            placeholder="Телефон"
            className={s.addUserInput}
          />
          <Input
            value={newUserData.role_id}
            onChange={(e) => setNewUserData({ ...newUserData, role_id: e.target.value })}
            placeholder="Роль"
            className={s.addUserInput}
          />
        </div>
        <Button
          type="primary"
          onClick={handleAddUser}
          className={s.addUserButton}
          placeholder="Добавить пользователя"
        />
      </div>

      <Table
        dataSource={dataSource}
        columns={userColumns}
        pagination={false}
        className={s.table}
        onRow={(record) => ({
          onClick: () => setSelectedUser(record.key), // Выбор пользователя по клику
        })}
      />

      {/* Если выбран пользователь, отображаем его комментарии */}
      {selectedUser !== null && (
        <div className={s.commentSection}>
          <h3>Комментарии пользователя</h3>
          <List
            bordered
            dataSource={users.find(user => user.id === selectedUser).comments}
            renderItem={(comment) => (
              <List.Item
                actions={[
                  <Button
                    type="default"
                    icon={<EyeInvisibleOutlined />}
                    onClick={() => handleHideComment(selectedUser, comment.id)}
                    placeholder={comment.isHidden ? 'Показать комментарий' : 'Скрыть комментарий'}
                  />
                ]}
              >
                {comment.isHidden ? 'Комментарий скрыт' : comment.text}
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default UserComments;
