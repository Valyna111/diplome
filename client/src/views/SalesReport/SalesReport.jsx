import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  Tooltip, 
  Legend 
} from 'chart.js';
import { Spin, Alert, Select, Button } from 'antd';
import styles from './SalesReport.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const SalesReport = () => {
  const [reportData, setReportData] = useState({
    monthly: null,
    bouquets: null,
    categories: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(['completed', 'delivered']);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchReportData();
  }, [statusFilter, retryCount]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching report data with status filter:', statusFilter);

      const params = {
        statuses: statusFilter.join(',')
      };

      const [monthlyRes, bouquetsRes, categoriesRes] = await Promise.all([
        axios.get('/api/reports/monthly-sales', { params }),
        axios.get('/api/reports/bouquet-sales', { params }),
        axios.get('/api/reports/category-sales', { params })
      ]);

      console.log('API responses:', {
        monthly: monthlyRes.data,
        bouquets: bouquetsRes.data,
        categories: categoriesRes.data
      });

      const transformedData = {
        monthly: transformMonthlyData(monthlyRes.data),
        bouquets: transformBouquetData(bouquetsRes.data),
        categories: transformCategoryData(categoriesRes.data)
      };

      console.log('Transformed data:', transformedData);
      setReportData(transformedData);
    } catch (err) {
      console.error('Failed to load report data:', err);
      setError(err.response?.data?.message || err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const transformMonthlyData = (data) => {
    try {
      const dataArray = getDataArray(data);
      if (!dataArray.length) {
        console.warn('No valid monthly data found');
        return null;
      }

      return {
        labels: dataArray.map(item => item.month || item.month_name || 'Unknown'),
        datasets: [{
          label: 'Продажи (руб)',
          data: dataArray.map(item => item.total || item.amount || 0),
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        }]
      };
    } catch (err) {
      console.error('Error transforming monthly data:', err);
      return null;
    }
  };

  const transformBouquetData = (data) => {
    try {
      const dataArray = getDataArray(data);
      if (!dataArray.length) {
        console.warn('No valid bouquet data found');
        return null;
      }

      return {
        labels: dataArray.map(item => item.name || item.bouquet_name || 'Unknown'),
        datasets: [{
          label: 'Продажи (шт)',
          data: dataArray.map(item => item.count || item.quantity || 0),
          backgroundColor: dataArray.map((_, i) => 
            `hsl(${i * 360 / Math.max(1, dataArray.length)}, 70%, 50%)`
          )
        }]
      };
    } catch (err) {
      console.error('Error transforming bouquet data:', err);
      return null;
    }
  };

  const transformCategoryData = (data) => {
    try {
      const dataArray = getDataArray(data);
      if (!dataArray.length) {
        console.warn('No valid category data found');
        return null;
      }

      return {
        labels: dataArray.map(item => item.name || item.category_name || 'Unknown'),
        datasets: [{
          label: 'Продажи (руб)',
          data: dataArray.map(item => item.total || item.amount || 0),
          backgroundColor: dataArray.map((_, i) => 
            `hsl(${i * 360 / Math.max(1, dataArray.length)}, 70%, 50%)`
          )
        }]
      };
    } catch (err) {
      console.error('Error transforming category data:', err);
      return null;
    }
  };

  const getDataArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.result && Array.isArray(data.result)) return data.result;
    return [];
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) return <Spin size="large" className={styles.spin} />;

  return (
    <div className={styles.reportContainer}>
      <div className={styles.reportHeader}>
        <h1>📊 Отчёт по продажам</h1>
        <div className={styles.controls}>
          <Select
            mode="multiple"
            placeholder="Фильтр по статусам"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 300 }}
            options={[
              { value: 'completed', label: 'Собран' },
              { value: 'delivered', label: 'Доставлен' },
              { value: 'new', label: 'Новый' },
              { value: 'processing', label: 'В обработке' }
            ]}
          />
          <Button onClick={handleRetry} loading={loading}>
            Обновить
          </Button>
        </div>
      </div>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          className={styles.error}
          action={
            <Button size="small" type="primary" onClick={handleRetry}>
              Повторить
            </Button>
          }
        />
      )}

      <div className={styles.chartGrid}>
        <div className={styles.chartSection}>
          <h2>Продажи по месяцам</h2>
          {reportData.monthly ? (
            <div className={styles.chartWrapper}>
              <Bar
                data={reportData.monthly}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } }
                }}
              />
            </div>
          ) : (
            <Alert 
              type="warning" 
              message="Нет данных для отображения" 
              showIcon 
              action={
                <Button size="small" onClick={handleRetry}>
                  Обновить
                </Button>
              }
            />
          )}
        </div>

        <div className={styles.chartSection}>
          <h2>Продажи по букетам</h2>
          {reportData.bouquets ? (
            <div className={styles.chartWrapper}>
              <Bar
                data={reportData.bouquets}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } }
                }}
              />
            </div>
          ) : (
            <Alert 
              type="warning" 
              message="Нет данных для отображения" 
              showIcon 
            />
          )}
        </div>

        <div className={styles.chartSection}>
          <h2>Продажи по категориям</h2>
          {reportData.categories ? (
            <div className={styles.chartWrapper}>
              <Pie
                data={reportData.categories}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'right' } }
                }}
              />
            </div>
          ) : (
            <Alert 
              type="warning" 
              message="Нет данных для отображения" 
              showIcon 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;