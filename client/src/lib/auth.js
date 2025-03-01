// Функция для регистрации
const registerUser = async (userData) => {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
      throw new Error('Registration failed');
    }
  
    return response.json();
  };
  
  // Функция для входа
  const loginUser = async (credentials) => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      credentials: 'include', // Важно: для отправки cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  
    const data = await response.json(); // Парсим ответ сервера
  
    if (!response.ok) {
      // Если статус ответа не 200-299, выбрасываем ошибку с сообщением от сервера
      throw new Error(data.error || 'Произошла ошибка при входе');
    }
  
    return data; // Возвращаем данные, если всё успешно
  };
  
  // Функция для получения информации о пользователе
  const fetchProfile = async () => {
    const response = await fetch('http://localhost:3000/profile', {
      method: 'GET',
      credentials: 'include', // Важно: для отправки cookies
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
  
    return response.json();
  };
  
  // Функция для выхода
  const logoutUser = async () => {
    const response = await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include', // Важно: для отправки cookies
    });
  
    if (!response.ok) {
      throw new Error('Logout failed');
    }
  
    return response.json();
  };

export { registerUser, loginUser, fetchProfile, logoutUser};