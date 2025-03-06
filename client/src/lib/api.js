const API_URL = 'http://localhost:3000/auth'; // Серверный URL

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const text = await response.text(); // Читаем текст ответа
    console.log("Ответ сервера:", text);

    try {
        const data = JSON.parse(text); // Пробуем распарсить JSON
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка регистрации');
        }
        return data;
    } catch (error) {
        throw new Error('Ошибка сервера. Некорректный JSON.');
    }
};
