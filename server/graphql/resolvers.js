// graphql/resolvers.js
const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    // Получить всех пользователей
    users: async (_, __, { pool }) => {
      const { rows } = await pool.query('SELECT * FROM users');
      return rows;
    },

    // Получить пользователя по ID
    user: async (_, { userid }, { pool }) => {
      const { rows } = await pool.query('SELECT * FROM users WHERE userid = $1', [userid]);
      return rows[0];
    },
  },

  Mutation: {
    // Создать нового пользователя
    createUser: async (
      _,
      { username, passhash, email, phone, role, dateofbirth, usersyrname },
      { pool }
    ) => {
      const hashedPassword = await bcrypt.hash(passhash, 10);
      const { rows } = await pool.query(
        `INSERT INTO users (username, passhash, email, phone, role, dateofbirth, usersyrname)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [username, hashedPassword, email, phone, role, dateofbirth, usersyrname]
      );
      return rows[0];
    },

    // Обновить пользователя
    updateUser: async (
      _,
      { userid, username, passhash, email, phone, role, dateofbirth, usersyrname },
      { pool }
    ) => {
      let hashedPassword;
      if (passhash) {
        hashedPassword = await bcrypt.hash(passhash, 10);
      }

      const { rows } = await pool.query(
        `UPDATE users
         SET
           username = COALESCE($1, username),
           passhash = COALESCE($2, passhash),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           role = COALESCE($5, role),
           dateofbirth = COALESCE($6, dateofbirth),
           usersyrname = COALESCE($7, usersyrname)
         WHERE userid = $8
         RETURNING *`,
        [username, hashedPassword, email, phone, role, dateofbirth, usersyrname, userid]
      );
      return rows[0];
    },

    // Удалить пользователя
    deleteUser: async (_, { userid }, { pool }) => {
      await pool.query('DELETE FROM users WHERE userid = $1', [userid]);
      return true;
    },
  },
};

module.exports = resolvers;