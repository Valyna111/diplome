const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'flowerShop',
  password: '112233',
  port: 5432,
});

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  if (!firstName || !lastName || !email || !phone || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь уже зарегистрирован' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO public.users (userid, username, "login ", passhash, email, phone, role, usersyrname)
       VALUES (DEFAULT, $1, $2, $3, $4, $5, 1, $6) RETURNING *`,
      [firstName, email, email, hashedPassword, email, phone, lastName]
    );

    res.status(201).json({ message: 'Регистрация успешна', user: result.rows[0] });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
