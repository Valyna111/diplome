const postgraphile = require('postgraphile').default;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cookieParser());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'flowerShop',
    password: '112233',
    port: 5432,
});

app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

// Кастомные маршруты
app.post('/register', async (req, res) => {
    const { username, email, password, phone, surname } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, email, passhash, phone, surname, role_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [username, email, hashedPassword, phone, surname, 1]
        );

        res.status(201).json({ user: newUser.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Пользователь не найден' });
        }

        const validPassword = await bcrypt.compare(password, user.passhash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Неверный пароль' });
        }

        const sessionToken = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '1h' });
        const expiresAt = new Date(Date.now() + 3600000);

        await pool.query(
            'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)',
            [user.id, sessionToken, expiresAt]
        );

        res.cookie('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });

        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/logout', async (req, res) => {
    const sessionToken = req.cookies?.session_token;

    if (!sessionToken) {
        return res.status(400).json({ error: 'Сессия не найдена' });
    }

    try {
        await pool.query('DELETE FROM user_sessions WHERE session_token = $1', [sessionToken]);
        res.clearCookie('session_token');
        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const authenticateToken = async (req, res, next) => {
    console.log(req.cookies);
    const sessionToken = req.cookies?.session_token;

    if (!sessionToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Проверка токена в базе данных
        const { rows } = await pool.query(
            'SELECT * FROM user_sessions WHERE session_token = $1 AND expires_at > NOW()',
            [sessionToken]
        );

        if (rows.length === 0) {
            return res.status(403).json({ error: 'Invalid or expired session' });
        }

        // Проверка JWT токена
        jwt.verify(sessionToken, 'your-secret-key', (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT users.*, role.name AS role_name 
             FROM users 
             JOIN role ON users.role_id = role.id 
             WHERE users.id = $1`,
            [req.user.id]
        );

        const user = rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/profile', authenticateToken, async (req, res) => {
    const { username, email, phone, surname, birthdate } = req.body;

    try {
        // Проверяем, есть ли уже дата рождения в базе данных
        const { rows: existingUser } = await pool.query(
            'SELECT birthdate FROM users WHERE id = $1',
            [req.user.id]
        );

        // Если дата рождения уже есть, не обновляем её
        const finalBirthdate = existingUser[0].birthdate || birthdate;

        const { rows } = await pool.query(
            `UPDATE users 
             SET username = $1, email = $2, phone = $3, surname = $4, birthdate = $5
             WHERE id = $6 
             RETURNING *`,
            [username, email, phone, surname, finalBirthdate, req.user.id]
        );

        const user = rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/driver/deliveries', authenticateToken, async (req, res) => {
    try {
        const driverId = req.user.id; // ID доставщика из токена

        // Получаем deliveryman_info для этого пользователя
        const { rows: deliverymanInfo } = await pool.query(
            `SELECT id FROM deliveryman_info WHERE user_id = $1`,
            [driverId]
        );

        if (deliverymanInfo.length === 0) {
            return res.status(404).json({ error: 'Доставщик не найден' });
        }

        const deliverymanId = deliverymanInfo[0].id;

        // Получаем доставки для этого доставщика
        const { rows: deliveries } = await pool.query(
            `SELECT 
                orders.id AS "orderId", 
                orders.order_date AS "orderDate", 
                orders.customer_address AS "customerAddress", 
                orders.price AS "orderPrice", 
                (orders.price::numeric * 0.1) AS earnings -- 10% от стоимости заказа
             FROM orders
             WHERE delivery_id = $1`,
            [deliverymanId]
        );

        res.json({ deliveries });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






app.use(
    postgraphile(pool, 'public', {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true,
    })
);

app.listen(4000, () => {
    console.log('🚀 Server ready at http://localhost:4000/graphql');
});