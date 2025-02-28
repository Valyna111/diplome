import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import StoreContext from '@/store/StoreContext';

const AuthTestButtons = observer(() => {
  const rootStore = useContext(StoreContext);

  const handleRegister = async () => {
    try {
      await rootStore.authStore.registerUser({
        firstName: 'Max',
        lastName: 'Klochko',
        email: 'max.doe@example.com',
        phone: '1234567890',
        password: 'password123',
      });
      alert('Регистрация прошла успешно!');
    } catch (error) {
      alert(`Ошибка регистрации: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      await rootStore.authStore.login({
        email: 'max.doe@example.com',
        password: 'password123',
      });
      alert('Вход выполнен успешно!');
    } catch (error) {
      alert(`Ошибка входа: ${error.message}`);
    }
  };

  const handleFetchProfile = async () => {
    try {
      await rootStore.authStore.fetchUserProfile();
      alert('Данные пользователя получены!');
      console.log('Текущий пользователь:', rootStore.authStore.currentUser);
    } catch (error) {
      alert(`Ошибка получения профиля: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await rootStore.authStore.logout();
      alert('Выход выполнен успешно!');
    } catch (error) {
      alert(`Ошибка выхода: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Тестирование аутентификации</h2>
      <button onClick={handleRegister}>Регистрация</button>
      <button onClick={handleLogin}>Вход</button>
      <button onClick={handleFetchProfile}>Получить профиль</button>
      <button onClick={handleLogout}>Выход</button>

      {rootStore.authStore.isLoading && <p>Загрузка...</p>}

      {rootStore.authStore.currentUser && (
        <div>
          <h3>Текущий пользователь:</h3>
          <p>ID: {rootStore.authStore.currentUser.id}</p>
          <p>Имя: {rootStore.authStore.currentUser.firstName}</p>
          <p>Фамилия: {rootStore.authStore.currentUser.lastName}</p>
          <p>Email: {rootStore.authStore.currentUser.email}</p>
          <p>Телефон: {rootStore.authStore.currentUser.phone}</p>
        </div>
      )}
    </div>
  );
});

export default AuthTestButtons;