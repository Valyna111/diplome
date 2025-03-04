import { useState, useEffect } from "react";
import "./OrderHistory.module.css"; // Подключаем стили

const API_URL = "http://localhost:3000/orders"; // API бекенда

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка загрузки данных:", error);
                setError("Ошибка загрузки данных");
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="loading">Загрузка...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="orders-container">
            <h1>История заказов</h1>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Дата заказа</th>
                        <th>Букет</th>
                        <th>Цена</th>
                        <th>Статус</th>
                        <th>Адрес доставки</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderid}>
                            <td>{new Date(order.orderdate).toLocaleDateString()}</td>
                            <td>{order.bouquetid}</td> {/* Позже заменим на имя букета */}
                            <td>{order.price}</td>
                            <td>{order.statusid}</td> {/* Позже заменим на статус */}
                            <td>{order.customeraddress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistory;
