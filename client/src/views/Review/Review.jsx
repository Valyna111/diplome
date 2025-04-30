import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Rate, Input, Button, Steps, message, Spin, Result } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import StoreContext from '@/store/StoreContext';
import styles from './Review.module.css';

const { TextArea } = Input;
const { Step } = Steps;

const Review = observer(() => {
    const location = useLocation();
    const { feedbackStore } = useContext(StoreContext);
    const [currentStep, setCurrentStep] = useState(0);
    const [orderRating, setOrderRating] = useState(0);
    const [orderComment, setOrderComment] = useState('');
    const [bouquetReviews, setBouquetReviews] = useState(new Map());

    useEffect(() => {
        const verifyData = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const encryptedData = searchParams.get('data');
                
                if (!encryptedData) {
                    throw new Error('Отсутствуют данные для отзыва');
                }

                const data = await feedbackStore.verifyFeedbackData(encryptedData);
                
                // Если уже есть отзыв о заказе, сразу переходим к отзывам о букетах
                if (data.hasOrderFeedback) {
                    setCurrentStep(1);
                }
            } catch (err) {
                message.error(err.message);
            }
        };

        verifyData();

        return () => {
            feedbackStore.reset();
        };
    }, [location, feedbackStore]);

    const handleOrderSubmit = async () => {
        if (!feedbackStore.feedbackData) return;

        try {
            await feedbackStore.addOrderFeedback({
                bouquetId: null,
                rating: orderRating,
                comment: orderComment,
            });

            message.success('Спасибо за отзыв о заказе!');
            setCurrentStep(1);
        } catch (err) {
            message.error(err.message);
        }
    };

    const handleBouquetReview = async (bouquetId) => {
        if (!feedbackStore.feedbackData) return;

        const review = bouquetReviews.get(bouquetId);
        if (!review) return;

        try {
            await feedbackStore.addOrderFeedback({
                bouquetId,
                rating: review.rating,
                comment: review.comment,
            });

            message.success('Спасибо за отзыв о букете!');
        } catch (err) {
            message.error(err.message);
        }
    };

    const renderContent = () => {
        if (currentStep === 0 && !feedbackStore.feedbackData?.hasOrderFeedback) {
            return (
                <Card className={styles.orderReview}>
                    <h2>Оцените ваш заказ</h2>
                    <div className={styles.ratingContainer}>
                        <Rate
                            value={orderRating}
                            onChange={setOrderRating}
                            character={<StarFilled style={{ fontSize: '2rem' }} />}
                            style={{ color: '#e91e63' }}
                        />
                    </div>
                    <TextArea
                        value={orderComment}
                        onChange={(e) => setOrderComment(e.target.value)}
                        placeholder="Расскажите о вашем опыте заказа..."
                        autoSize={{ minRows: 4, maxRows: 6 }}
                        className={styles.commentInput}
                    />
                    <Button
                        type="primary"
                        onClick={handleOrderSubmit}
                        disabled={orderRating === 0}
                        className={styles.submitButton}
                        size="large"
                    >
                        Продолжить
                    </Button>
                </Card>
            );
        }

        return (
            <div className={styles.bouquetReviews}>
                <h2>Оцените букеты из заказа</h2>
                {feedbackStore.feedbackData?.bouquets.length > 0 ? (
                    <div className={styles.bouquetsGrid}>
                        {feedbackStore.feedbackData.bouquets.map((bouquet) => (
                            <Card
                                key={bouquet.bouquetId}
                                cover={
                                    <img
                                        alt={bouquet.name}
                                        src={`http://localhost:4000${bouquet.image}`}
                                        className={styles.bouquetImage}
                                    />
                                }
                                className={styles.bouquetCard}
                            >
                                <Card.Meta
                                    title={bouquet.name}
                                    description={
                                        <div className={styles.reviewInputs}>
                                            <Rate
                                                value={bouquetReviews.get(bouquet.bouquetId)?.rating || 0}
                                                onChange={(value) => {
                                                    setBouquetReviews(new Map(bouquetReviews.set(
                                                        bouquet.bouquetId,
                                                        {
                                                            rating: value,
                                                            comment: bouquetReviews.get(bouquet.bouquetId)?.comment || ''
                                                        }
                                                    )));
                                                }}
                                                style={{ color: '#e91e63' }}
                                            />
                                            <TextArea
                                                value={bouquetReviews.get(bouquet.bouquetId)?.comment || ''}
                                                onChange={(e) => {
                                                    setBouquetReviews(new Map(bouquetReviews.set(
                                                        bouquet.bouquetId,
                                                        {
                                                            rating: bouquetReviews.get(bouquet.bouquetId)?.rating || 0,
                                                            comment: e.target.value
                                                        }
                                                    )));
                                                }}
                                                placeholder="Расскажите о букете..."
                                                autoSize={{ minRows: 3, maxRows: 5 }}
                                                className={styles.commentInput}
                                            />
                                            <Button
                                                type="primary"
                                                onClick={() => handleBouquetReview(bouquet.bouquetId)}
                                                disabled={!bouquetReviews.get(bouquet.bouquetId)?.rating}
                                                className={styles.submitButton}
                                            >
                                                Оставить отзыв
                                            </Button>
                                        </div>
                                    }
                                />
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Result
                        status="success"
                        title="Спасибо за ваши отзывы!"
                        subTitle="Вы оценили все букеты из заказа"
                    />
                )}
            </div>
        );
    };

    if (feedbackStore.isLoading) {
        return (
            <div className={styles.container}>
                <Spin size="large" tip="Загрузка..." />
            </div>
        );
    }

    if (feedbackStore.error) {
        return (
            <div className={styles.container}>
                <Result
                    status="error"
                    title="Ошибка"
                    subTitle={feedbackStore.error}
                />
            </div>
        );
    }

    if (!feedbackStore.feedbackData) {
        return (
            <div className={styles.container}>
                <Result
                    status="404"
                    title="Данные для отзыва не найдены"
                    subTitle="Возможно, ссылка устарела или некорректна"
                />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Steps
                current={currentStep}
                items={[
                    {
                        title: 'Оценка заказа',
                        description: 'Общее впечатление',
                        disabled: feedbackStore.feedbackData.hasOrderFeedback
                    },
                    {
                        title: 'Оценка букетов',
                        description: 'Детальные отзывы'
                    },
                ]}
                className={styles.steps}
            />
            {renderContent()}
        </div>
    );
});

export default Review; 