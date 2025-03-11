import React, { useState } from 'react';
import { Table, Button, message, List } from 'antd';
import { EyeInvisibleOutlined, UserDeleteOutlined } from '@ant-design/icons';
import s from './UserComments.module.css';

const UserComments = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'User1', isBlocked: false, comments: [
      { id: 1, text: 'This is a comment from user 1', isHidden: false },
      { id: 2, text: 'Another comment from user 1', isHidden: false },
    ]},
    { id: 2, name: 'User2', isBlocked: false, comments: [
      { id: 3, text: 'This is a comment from user 2', isHidden: false },
      { id: 4, text: 'Another comment from user 2', isHidden: false },
    ]},
  ]);

  const [selectedUser, setSelectedUser] = useState(null);

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

  // Данные для таблицы пользователей
  const dataSource = users.map(user => ({
    key: user.id,
    name: user.name,
    actions: (
      <Button
        type="danger"
        icon={<UserDeleteOutlined />}
        onClick={() => handleBlockUser(user.id)}
      >
        {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
      </Button>
    ),
  }));

  // Колонки для таблицы пользователей
  const userColumns = [
    { title: 'Имя пользователя', dataIndex: 'name', key: 'name' },
    { title: 'Действия', key: 'actions', render: (_, record) => record.actions },
  ];

  return (
    <div className={s.container}>
      <h2 className={s.title}>Список пользователей</h2>
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
                  >
                    {comment.isHidden ? 'Показать комментарий' : 'Скрыть комментарий'}
                  </Button>
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
