const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 
const {Pool} = require('pg')
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const app = express();
app.use(express.json());
app.use(cookieParser());

const DATA_PATH = path.join(__dirname, 'data');

const pool = new Pool({
  user :'postgres',
  host : 'localhost',
  database: 'flowerShop',
  password: '112233',
  port:'5432'
})
pool.connect(undefined)
    .then(() => console.log(' Подключено к PostgresSQL'))
    .catch(err => console.error(' Ошибка подключения:', err));

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({ pool }), // Передаем pool в контекст
    });

    server.start().then(() => {
      server.applyMiddleware({ app, path: '/graphql' });
    });



app.use(
    cors({
      origin: 'http://localhost:5173', // Укажите домен вашего фронтенда
      credentials: true, // Разрешить отправку cookies
    })
);

// Функции для работы с файлами
const readData = (filename) => {
  const filePath = path.join(DATA_PATH, filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeData = (filename, data) => {
  const filePath = path.join(DATA_PATH, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Регистрация
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  const users = readData('users.json');
  const userExists = users.find(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ error: 'Пользователь уже зарегестрирован' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
  };

  users.push(newUser);
  writeData('users.json', users);

  res.status(201).json({ message: 'User registered successfully' });
});

// Логин
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const users = readData('users.json');
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ error: 'Пользователь не найден' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Неверный пароль' });
  }

  // Создание JWT токена
  const token = jwt.sign(
    { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone },
    'your-secret-key',
    { expiresIn: '1h' }
  );

  // Сохранение токена в cookies
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000, // Срок действия: 1 час
  });

  res.json({ message: 'Login successful' });
});

// Получение информации о пользователе
app.get('/profile', authenticateToken, (req, res) => {
  const users = readData('users.json');
  const user = users.find(user => user.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

// Выход
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
});