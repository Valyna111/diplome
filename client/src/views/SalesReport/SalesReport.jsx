import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import styles from "./SalesReport.module.css"; // Подключаем стили

const API_URL = "http://localhost:3000/sales-report"; // API бекенда (пока не используется)

const SalesReport = () => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [bouquetSales, setBouquetSales] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Фейковые данные (пока нет API)
    const fetchData = () => {
      try {
        setTimeout(() => {
          setMonthlySales([
            { month: "Янв", sales: 120 },
            { month: "Фев", sales: 150 },
            { month: "Мар", sales: 200 },
            { month: "Апр", sales: 180 },
            { month: "Май", sales: 250 },
            { month: "Июн", sales: 300 },
            { month: "Июл", sales: 270 },
            { month: "Авг", sales: 310 },
            { month: "Сен", sales: 280 },
            { month: "Окт", sales: 320 },
            { month: "Ноя", sales: 330 },
            { month: "Дек", sales: 400 },
          ]);

          setBouquetSales([
            { bouquet: "Розы", sales: 350 },
            { bouquet: "Тюльпаны", sales: 280 },
            { bouquet: "Лилии", sales: 150 },
            { bouquet: "Хризантемы", sales: 100 },
            { bouquet: "Пионы", sales: 220 },
          ]);

          setCategorySales([
            { category: "Свадебные", sales: 500 },
            { category: "День Рождения", sales: 450 },
            { category: "Юбилеи", sales: 300 },
            { category: "Корпоративы", sales: 200 },
            { category: "Декор", sales: 150 },
          ]);

          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Ошибка при загрузке данных");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className={styles.loading}>Загрузка...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.reportContainer}>
      <h1>📊 Отчёт по продажам</h1>

      {/* График продаж по месяцам */}
      <div className={styles.chart}>
        <h2>Продажи по месяцам</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlySales}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* График продаж по букетам */}
      <div className={styles.chart}>
        <h2>Продажи по букетам</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bouquetSales}>
            <XAxis dataKey="bouquet" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* График продаж по категориям */}
      <div className={styles.chart}>
        <h2>Продажи по категориям</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categorySales}
              dataKey="sales"
              nameKey="category"
              outerRadius={100}
              fill="#ff7300"
              label
            >
              {categorySales.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={["#ff7300", "#8884d8", "#82ca9d", "#ffc658", "#ff6347"][index]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesReport;