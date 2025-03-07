import { postgraphile } from 'postgraphile';
import express from 'express';
import cors from 'cors';
const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173', // Укажите домен вашего фронтенда
        credentials: true, // Разрешить отправку cookies
    })
);

app.use(
    postgraphile(
        'postgres://postgres:1851@localhost:5432/flowerShop', // Подключение к базе данных
        'public', // Схема базы данных
        {
            watchPg: true, // Автоматическое обновление схемы при изменении базы данных
            graphiql: true, // Включить GraphiQL для тестирования
            enhanceGraphiql: true, // Улучшенный интерфейс GraphiQL
        }
    )
);

app.listen(4000, () => {
    console.log('🚀 Server ready at http://localhost:4000/graphql');
});