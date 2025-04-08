const bcrypt = require('bcrypt');

const password = '1851'; // Пароль администратора
const saltRounds = 10; // Количество раундов для генерации соли

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Ошибка при генерации хэша:', err);
        return;
    }
    console.log('Хэш пароля:', hash);
});