const express = require('express');
const {Pool} = require('pg')


const app = express();
app.use(express.json());


const pool = new Pool({
    user :'postgres',
    host : 'localhost',
    database: 'flowerShop',
    password:'112233',
    port:'5432'
})



pool.connect()
    .then(() => console.log(' Подключено к PostgreSQL'))
    .catch(err => console.error(' Ошибка подключения:', err));



app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(' Ошибка при получении данных:', err);
        res.status(500).json({ error: err.message });
    }
});


app.get('/', (req, res) => {
    res.send("Hello, server is running!");
});

const PORT = 3000;


app.listen(PORT, async () => {

    console.log(` Сервер запущен на http://localhost:${PORT}`);
});
module.exports = pool;