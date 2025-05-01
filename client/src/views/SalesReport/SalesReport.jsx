import React, { useState } from 'react';
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
import { 
    Spin, 
    Alert, 
    Select, 
    Button, 
    DatePicker, 
    Space,
    Typography,
    Card
} from 'antd';
import { 
    BarChartOutlined, 
    PieChartOutlined, 
    ReloadOutlined,
    CalendarOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { GET_SALES_REPORT } from '@/graphql/queries';
import styles from './SalesReport.module.css';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const SalesReport = () => {
    const [dateRange, setDateRange] = useState([
        dayjs().startOf('month'),
        dayjs().endOf('month')
    ]);
    const [statusFilter, setStatusFilter] = useState(['Новый', 'Собран', 'В процессе', 'Доставлен']);

    const { loading, error, data, refetch } = useQuery(GET_SALES_REPORT, {
        variables: {
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD'),
            statuses: statusFilter.length > 0 ? statusFilter : ['Новый', 'Собран', 'В процессе', 'Доставлен', 'Отменён']
        },
        fetchPolicy: 'network-only'
    });

    const handleDateChange = (dates) => {
        if (dates) {
            setDateRange(dates);
            refetch({
                startDate: dates[0].format('YYYY-MM-DD'),
                endDate: dates[1].format('YYYY-MM-DD'),
                statuses: statusFilter.length > 0 ? statusFilter : ['Новый', 'Собран', 'В процессе', 'Доставлен', 'Отменён']
            });
        }
    };

    const handleStatusChange = (values) => {
        setStatusFilter(values);
        refetch({
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD'),
            statuses: values.length > 0 ? values : ['Новый', 'Собран', 'В процессе', 'Доставлен', 'Отменён']
        });
    };

    const transformMonthlyData = (data) => {
        if (!data?.getSalesByMonth) return null;

        return {
            labels: data.getSalesByMonth.map(item => item.month),
            datasets: [{
                label: 'Продажи (руб)',
                data: data.getSalesByMonth.map(item => item.total),
                backgroundColor: 'rgba(24, 144, 255, 0.7)',
                borderColor: 'rgba(24, 144, 255, 1)',
                borderWidth: 1
            }]
        };
    };

    const transformBouquetData = (data) => {
        if (!data?.getSalesByBouquet) return null;

        return {
            labels: data.getSalesByBouquet.map(item => item.name),
            datasets: [{
                label: 'Продажи (шт)',
                data: data.getSalesByBouquet.map(item => item.count),
                backgroundColor: data.getSalesByBouquet.map((_, i) => 
                    `hsl(${i * 360 / Math.max(1, data.getSalesByBouquet.length)}, 70%, 50%)`
                )
            }]
        };
    };

    const transformCategoryData = (data) => {
        if (!data?.getSalesByCategory) return null;

        return {
            labels: data.getSalesByCategory.map(item => item.name),
            datasets: [{
                label: 'Продажи (руб)',
                data: data.getSalesByCategory.map(item => item.total),
                backgroundColor: data.getSalesByCategory.map((_, i) => 
                    `hsl(${i * 360 / Math.max(1, data.getSalesByCategory.length)}, 70%, 50%)`
                )
            }]
        };
    };

    if (loading) return <Spin size="large" className={styles.spin} />;

    return (
        <div className={styles.reportContainer}>
            <div className={styles.reportHeader}>
                <Title level={2} className={styles.title}>
                    <BarChartOutlined style={{ paddingRight: '8px'}}/>
                    Отчёт по продажам
                </Title>
                <Space className={styles.controls} style={{ marginTop: '14px', paddingLeft: '8px' }}>
                    <RangePicker
                        value={dateRange}
                        onChange={handleDateChange}
                        format="DD.MM.YYYY"
                        suffixIcon={<CalendarOutlined />}
                    />
                    <Select
                        mode="multiple"
                        placeholder="Фильтр по статусам"
                        value={statusFilter}
                        onChange={handleStatusChange}
                        style={{ width: 300 }}
                        suffixIcon={<FilterOutlined />}
                        options={[
                            { value: 'Новый', label: 'Новый' },
                            { value: 'Собран', label: 'Собран' },
                            { value: 'В процессе', label: 'В процессе' },
                            { value: 'Доставлен', label: 'Доставлен' },
                            { value: 'Отменён', label: 'Отменён' }
                        ]}
                    />
                    <Button 
                        onClick={() => refetch()} 
                        icon={<ReloadOutlined />}
                        type="primary"
                    >
                        Обновить
                    </Button>
                </Space>
            </div>

            {error && (
                <Alert 
                    type="error" 
                    message={error.message} 
                    className={styles.error}
                    action={
                        <Button size="small" type="primary" onClick={() => refetch()}>
                            Повторить
                        </Button>
                    }
                />
            )}

            <div className={styles.chartGrid}>
                <Card className={styles.chartSection}>
                    <Title level={4}>
                        <BarChartOutlined style={{ paddingRight: '8px'}}/>
                        Продажи по месяцам
                    </Title>
                    <div className={styles.chartWrapper}>
                        {data?.getSalesByMonth ? (
                            <Bar
                                data={transformMonthlyData(data)}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: 'top' },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => {
                                                    return `${context.dataset.label}: ${context.raw.toLocaleString('ru-RU')} ₽`;
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                callback: (value) => `${value.toLocaleString('ru-RU')} ₽`
                                            }
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <Alert 
                                type="warning" 
                                message="Нет данных для отображения" 
                                showIcon 
                            />
                        )}
                    </div>
                </Card>

                <Card className={styles.chartSection}>
                    <Title level={4}>
                        <PieChartOutlined style={{ paddingRight: '8px'}}/>
                        Продажи по букетам
                    </Title>
                    <div className={styles.chartWrapper}>
                        {data?.getSalesByBouquet ? (
                            <Bar
                                data={transformBouquetData(data)}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: 'top' },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => {
                                                    return `${context.dataset.label}: ${context.raw} шт`;
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                callback: (value) => `${value} шт`
                                            }
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <Alert 
                                type="warning" 
                                message="Нет данных для отображения" 
                                showIcon 
                            />
                        )}
                    </div>
                </Card>

                <Card className={styles.chartSection}>
                    <Title level={4}>
                        <PieChartOutlined style={{ paddingRight: '8px'}}/>
                        Продажи по категориям
                    </Title>
                    <div className={styles.chartWrapper}>
                        {data?.getSalesByCategory ? (
                            <Pie
                                data={transformCategoryData(data)}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: 'right' },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => {
                                                    return `${context.label}: ${context.raw.toLocaleString('ru-RU')} ₽`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <Alert 
                                type="warning" 
                                message="Нет данных для отображения" 
                                showIcon 
                            />
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SalesReport;