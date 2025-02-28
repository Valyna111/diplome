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
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    return response.json();
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