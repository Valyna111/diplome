const postgraphile = require('postgraphile').default;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {Pool} = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {UserDataPlugin, StoreMutationsPlugin, BlockUserPlugin, OCPSchemaPlugin, OrderPlugin, StockSchemaPlugin, FeedbackPlugin} = require("./plugins");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fetch = require('node-fetch');

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

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
// Настройка Multer для сохранения файлов в папку "uploads"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Файлы будут сохраняться в папку "uploads"
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Уникальное имя файла
    }
});

const upload = multer({storage});

// Маршрут для загрузки изображений
app.post('/upload-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'No file uploaded'});
        }

        // Возвращаем путь к файлу
        const filePath = `/uploads/${req.file.filename}`;
        res.json({imageUrl: filePath});
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({error: 'Failed to upload image'});
    }
});

// Маршрут для отдачи статических файлов (изображений)
app.use('/uploads', express.static('uploads'));

// Кастомные маршруты
app.post('/register', async (req, res) => {
    const {username, email, password, phone, surname, role, force_password_change} = req.body;

    try {
        const {rows} = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            return res.status(400).json({error: 'Пользователь с таким email уже существует'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, email, passhash, phone, surname, role_id, force_password_change) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [username, email, hashedPassword, phone, surname, role || 1, force_password_change || false]
        );

        res.status(201).json({user: newUser.rows[0]});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const {rows} = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(400).json({error: 'Пользователь не найден'});
        }

        const validPassword = await bcrypt.compare(password, user.passhash);
        if (!validPassword) {
            return res.status(400).json({error: 'Неверный пароль'});
        }

        const sessionToken = jwt.sign({id: user.id}, 'your-secret-key', {expiresIn: '3h'});
        const expiresAt = new Date(Date.now() + 36000000);

        await pool.query(
            'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)',
            [user.id, sessionToken, expiresAt]
        );

        res.cookie('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 36000000,
        });

        res.json({
            message: 'Login successful', 
            user,
            forcePasswordChange: user.force_password_change
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.post('/logout', async (req, res) => {
    const sessionToken = req.cookies?.session_token;

    if (!sessionToken) {
        return res.status(400).json({error: 'Сессия не найдена'});
    }

    try {
        await pool.query('DELETE FROM user_sessions WHERE session_token = $1', [sessionToken]);
        res.clearCookie('session_token');
        res.json({message: 'Logout successful'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

const authenticateToken = async (req, res, next) => {
    console.log(req.cookies);
    const sessionToken = req.cookies?.session_token;

    if (!sessionToken) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    try {
        // Проверка токена в базе данных
        const {rows} = await pool.query(
            'SELECT * FROM user_sessions WHERE session_token = $1 AND expires_at > NOW()',
            [sessionToken]
        );

        if (rows.length === 0) {
            return res.status(403).json({error: 'Invalid or expired session'});
        }

        // Проверка JWT токена
        jwt.verify(sessionToken, 'your-secret-key', (err, user) => {
            if (err) {
                return res.status(403).json({error: 'Invalid token'});
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const {rows} = await pool.query(
            `SELECT users.*, role.name AS role_name
             FROM users
                      JOIN role ON users.role_id = role.id
             WHERE users.id = $1`,
            [req.user.id]
        );

        const user = rows[0];

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        res.json({user});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.put('/profile', authenticateToken, async (req, res) => {
    const {username, email, phone, surname, birthdate} = req.body;

    try {
        // Проверяем, есть ли уже дата рождения в базе данных
        const {rows: existingUser} = await pool.query(
            'SELECT birthdate FROM users WHERE id = $1',
            [req.user.id]
        );

        // Если дата рождения уже есть, не обновляем её
        const finalBirthdate = existingUser[0].birthdate || birthdate;

        const {rows} = await pool.query(
            `UPDATE users
             SET username  = $1,
                 email     = $2,
                 phone     = $3,
                 surname   = $4,
                 birthdate = $5
             WHERE id = $6
             RETURNING *`,
            [username, email, phone, surname, finalBirthdate, req.user.id]
        );

        const user = rows[0];

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        res.json({user});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.use(
    postgraphile(pool, 'public', {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true,
        appendPlugins: [
            UserDataPlugin, 
            StoreMutationsPlugin, 
            BlockUserPlugin, 
            OCPSchemaPlugin, 
            OrderPlugin, 
            StockSchemaPlugin,
            FeedbackPlugin
        ]
    })
);
// Добавляем новый маршрут для смены пароля
app.post('/change-password', authenticateToken, async (req, res) => {
    const {currentPassword, newPassword} = req.body;

    try {
        const {rows} = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({error: 'Пользователь не найден'});
        }

        const validPassword = await bcrypt.compare(currentPassword, user.passhash);
        if (!validPassword) {
            return res.status(400).json({error: 'Неверный текущий пароль'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET passhash = $1, force_password_change = false WHERE id = $2',
            [hashedPassword, req.user.id]
        );

        res.json({message: 'Пароль успешно изменен'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Настройка nodemailer для отправки писем
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'maskabedwars@gmail.com',
        pass: 'baer uuzl glsp jqbg ', // Замените на пароль приложения из Google
    },
});

// Генерация токена сброса пароля
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Маршрут для запроса сброса пароля
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ error: 'Пользователь с таким email не найден' });
        }

        const resetToken = generateResetToken();
        const expiresAt = new Date(Date.now() + 3600000); // Токен действителен 1 час

        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
            [resetToken, expiresAt, user.id]
        );

        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Сброс пароля',
            html: `
                <h2>Сброс пароля</h2>
                <p>Для сброса пароля перейдите по ссылке:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>Ссылка действительна в течение 1 часа.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Инструкции по сбросу пароля отправлены на email' });
    } catch (error) {
        console.error('Error in forgot-password:', error);
        res.status(500).json({ error: 'Ошибка при обработке запроса' });
    }
});

// Маршрут для сброса пароля
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
            [token]
        );
        const user = rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Недействительный или просроченный токен' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET passhash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
            [hashedPassword, user.id]
        );

        res.json({ message: 'Пароль успешно изменен' });
    } catch (error) {
        console.error('Error in reset-password:', error);
        res.status(500).json({ error: 'Ошибка при сбросе пароля' });
    }
});

// Эндпоинт для подсказок адресов
app.get('/api/geocode/suggest', async (req, res) => {
    try {
        const { query } = req.query;
        const response = await fetch(
            `https://suggest-maps.yandex.ru/v1/suggest?apikey=4f077bcb-a707-4aca-8995-ce4bce271eb5&text=${encodeURIComponent(query)}&lang=ru_RU&type=address&results=5&bbox=23.5,51.5~32.5,56.5`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:5173'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Error parsing JSON:', text);
            throw new Error('Invalid JSON response from Yandex API');
        }

        if (!data.results) {
            return res.json({ results: [] });
        }

        res.json(data);
    } catch (error) {
        console.error('Error in geocode suggest:', error);
        res.status(500).json({ 
            error: 'Ошибка при поиске адреса',
            details: error.message 
        });
    }
});

// Эндпоинт для получения координат
app.get('/api/geocode/coordinates', async (req, res) => {
    try {
        const { address } = req.query;
        const response = await fetch(
            `https://geocode-maps.yandex.ru/1.x/?apikey=6471aef4-7562-4730-87e3-60a918596904&geocode=${encodeURIComponent(address)}&format=json&lang=ru_RU&results=1`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:5173'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Error parsing JSON:', text);
            throw new Error('Invalid JSON response from Yandex API');
        }

        const featureMember = data.response?.GeoObjectCollection?.featureMember;
        if (!featureMember || featureMember.length === 0) {
            return res.status(404).json({ 
                error: 'Адрес не найден',
                details: 'Не удалось определить координаты для указанного адреса'
            });
        }

        const geoObject = featureMember[0].GeoObject;
        const [lon, lat] = geoObject.Point.pos.split(' ').map(Number);

        res.json({
            lat,
            lon,
            address: geoObject.metaDataProperty.GeocoderMetaData.text,
            fullAddress: geoObject.metaDataProperty.GeocoderMetaData.Address.formatted
        });
    } catch (error) {
        console.error('Error in geocode coordinates:', error);
        res.status(500).json({ 
            error: 'Ошибка при определении координат',
            details: error.message 
        });
    }
});

// Эндпоинт для поиска ближайшего ОЦП
app.get('/api/ocp/nearest', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                error: 'Необходимо указать координаты',
                details: 'Требуются параметры lat и lon'
            });
        }

        // Получаем все ОЦП из базы данных
        const { rows: ocps } = await pool.query(
            `SELECT id, address, latitude, longitude
             FROM ocp
             WHERE latitude IS NOT NULL AND longitude IS NOT NULL`
        );

        if (ocps.length === 0) {
            return res.status(404).json({
                error: 'ОЦП не найдены',
                details: 'В базе данных нет ОЦП с координатами'
            });
        }

        // Функция для расчета расстояния между двумя точками (формула гаверсинусов)
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Радиус Земли в километрах
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        };

        // Находим ближайший ОЦП
        let nearestOCP = ocps[0];
        let minDistance = calculateDistance(lat, lon, nearestOCP.latitude, nearestOCP.longitude);

        for (const ocp of ocps) {
            const distance = calculateDistance(lat, lon, ocp.latitude, ocp.longitude);
            if (distance < minDistance) {
                minDistance = distance;
                nearestOCP = ocp;
            }
        }

        res.json({
            id: nearestOCP.id,
            address: nearestOCP.address,
            distance: minDistance.toFixed(2) // Расстояние в километрах
        });
    } catch (error) {
        console.error('Error finding nearest OCP:', error);
        res.status(500).json({
            error: 'Ошибка при поиске ближайшего ОЦП',
            details: error.message
        });
    }
});

// Добавляем таблицу для хранения токенов отзывов
app.post('/api/feedback/verify-order', async (req, res) => {
    const { encryptedOrderId } = req.body;

    try {
        // Расшифровываем ID заказа
        const decipher = crypto.createDecipher('aes-256-cbc', 'your-secret-key');
        let orderId = decipher.update(encryptedOrderId, 'hex', 'utf8');
        orderId += decipher.final('utf8');
        orderId = parseInt(orderId);

        // Проверяем существование заказа и его статус
        const { rows: [order] } = await pool.query(
            `SELECT o.*, u.email 
             FROM orders o
             JOIN users u ON o.user_id = u.id
             WHERE o.id = $1 AND o.status_id = 4`,
            [orderId]
        );

        if (!order) {
            return res.status(404).json({ 
                error: 'Заказ не найден или не доставлен'
            });
        }

        // Получаем информацию о букетах в заказе
        const { rows: orderItems } = await pool.query(
            `SELECT oi.*, b.name, b.image
             FROM order_items oi
             JOIN bouquets b ON oi.bouquet_id = b.id
             WHERE oi.order_id = $1`,
            [orderId]
        );

        // Получаем существующие отзывы пользователя на букеты из этого заказа
        const { rows: existingFeedback } = await pool.query(
            `SELECT bouquet_id
             FROM feedback
             WHERE user_id = $1 AND order_id = $2`,
            [order.user_id, orderId]
        );

        // Фильтруем букеты, на которые еще нет отзывов
        const availableBouquets = orderItems.filter(item => 
            !existingFeedback.some(feedback => feedback.bouquet_id === item.bouquet_id)
        );

        if (availableBouquets.length === 0) {
            return res.status(400).json({
                error: 'Вы уже оставили отзывы на все букеты из этого заказа'
            });
        }

        res.json({
            orderId,
            userId: order.user_id,
            bouquets: availableBouquets
        });
    } catch (error) {
        console.error('Error verifying order:', error);
        res.status(500).json({
            error: 'Ошибка при проверке заказа',
            details: error.message
        });
    }
});

// Эндпоинт для проверки данных отзыва
app.post('/api/feedback/verify-data', async (req, res) => {
    const { encryptedData } = req.body;

    try {
        // Разделяем IV и зашифрованные данные
        const [ivHex, encryptedHex] = encryptedData.split(':');
        
        // Преобразуем hex строки обратно в буферы
        const iv = Buffer.from(ivHex, 'hex');
        const key = crypto.scryptSync('your-secret-password', 'salt', 32);

        // Расшифровываем данные
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decryptedData = decipher.update(encryptedHex, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');
        
        const feedbackData = JSON.parse(decryptedData);
        const { orderId, userId, items } = feedbackData;

        // Проверяем существование заказа и его статус
        const { rows: [order] } = await pool.query(
            `SELECT o.*, u.email 
             FROM orders o
             JOIN users u ON o.user_id = u.id
             WHERE o.id = $1 AND o.status_id = 4 AND o.user_id = $2`,
            [orderId, userId]
        );

        if (!order) {
            return res.status(404).json({ 
                error: 'Заказ не найден или не доставлен'
            });
        }

        // Проверяем, оставлял ли пользователь общий отзыв о заказе
        const { rows: orderFeedback } = await pool.query(
            `SELECT id
             FROM feedback
             WHERE user_id = $1 AND order_id = $2 AND bouquet_id IS NULL`,
            [userId, orderId]
        );

        const hasOrderFeedback = orderFeedback.length > 0;

        // Получаем существующие отзывы пользователя на букеты из этого заказа
        const { rows: existingFeedback } = await pool.query(
            `SELECT bouquet_id
             FROM feedback
             WHERE user_id = $1 AND order_id = $2 AND bouquet_id IS NOT NULL`,
            [userId, orderId]
        );

        // Фильтруем букеты, на которые еще нет отзывов
        const availableBouquets = items.filter(item => 
            !existingFeedback.some(feedback => feedback.bouquet_id === item.bouquetId)
        );

        if (availableBouquets.length === 0 && hasOrderFeedback) {
            return res.status(400).json({
                error: 'Вы уже оставили все отзывы для этого заказа'
            });
        }

        res.json({
            orderId,
            userId,
            bouquets: availableBouquets,
            hasOrderFeedback
        });
    } catch (error) {
        console.error('Error verifying feedback data:', error);
        res.status(500).json({
            error: 'Ошибка при проверке данных отзыва',
            details: error.message
        });
    }
});

app.listen(4000, () => {
    console.log('🚀 Server ready at http://localhost:4000/graphql');
});