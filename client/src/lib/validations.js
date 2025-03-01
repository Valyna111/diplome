const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validatePassword = (password) => {
    // Минимальная длина пароля
    const minLength = 8;

    // Проверка длины пароля
    if (password.length < minLength) {
        return {
            isValid: false,
            message: `Пароль должен содержать как минимум ${minLength} символов`,
        };
    }

    // Дополнительные проверки (опционально)
    const hasUpperCase = /[A-Z]/.test(password); // Есть ли заглавные буквы
    const hasLowerCase = /[a-z]/.test(password); // Есть ли строчные буквы
    const hasNumbers = /\d/.test(password); // Есть ли цифры
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password); // Есть ли спецсимволы

    // Пример проверки на наличие заглавных букв и цифр
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        return {
            isValid: false,
            message: 'Пароль должен содержать заглавные буквы, строчные буквы и цифры',
        };
    }

    // Если все проверки пройдены
    return {
        isValid: true,
        message: 'Пароль валиден',
    };
};

export { validateEmail, validatePassword };