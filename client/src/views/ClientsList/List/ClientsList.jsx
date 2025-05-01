import React, { useState, useContext, useMemo, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useQuery, gql } from "@apollo/client";
import { Card, Input, Button, Rate, message, Empty, Spin } from "antd";
import { StarFilled } from "@ant-design/icons";
import StoreContext from "@/store/StoreContext";
import styles from "./ClientsList.module.css";

const GET_FEEDBACKS = gql`
  query GetFeedbacks {
    allFeedbacks {
      nodes {
        id
        text
        score
        createdAt
        bouquetId
        orderId
        refId
        userByUserId {
          id
          username
          surname
          email
        }
        feedbacksByRefId {
          nodes {
            id
            text
            createdAt
            userByUserId {
              username
              surname
            }
          }
        }
      }
    }
  }
`;

const ClientsList = observer(() => {
  const rootStore = useContext(StoreContext);
  const [replyTexts, setReplyTexts] = useState({});
  const { loading, error, data, refetch } = useQuery(GET_FEEDBACKS);

  const feedbacks = useMemo(() => {
    const allFeedbacks = data?.allFeedbacks?.nodes || [];
    return allFeedbacks.filter(feedback => !feedback.refId);
  }, [data]);

  const handleReplySubmit = useCallback(async (feedbackId) => {
    const replyText = replyTexts[feedbackId];
    if (!replyText) {
      message.error("Введите текст ответа");
      return;
    }

    try {
      const result = await rootStore.feedbackStore.replyToFeedback(
        feedbackId,
        replyText,
        rootStore.authStore.currentUser.id
      );

      if (result.success) {
        message.success("Ответ успешно добавлен");
        setReplyTexts(prev => ({
          ...prev,
          [feedbackId]: ""
        }));
        refetch();
      } else {
        message.error(result.message || "Ошибка при добавлении ответа");
      }
    } catch (error) {
      message.error(error.message || "Произошла ошибка при отправке ответа");
    }
  }, [replyTexts, rootStore.feedbackStore, rootStore.authStore.currentUser, refetch]);

  const handleReplyTextChange = useCallback((feedbackId, value) => {
    setReplyTexts(prev => ({
      ...prev,
      [feedbackId]: value
    }));
  }, []);

  if (loading) return <Spin size="large" className={styles.spinner} />;
  if (error) return <div className={styles.error}>Ошибка загрузки данных: {error.message}</div>;

  return (
    <div className={styles.container}>
      <h2>Отзывы клиентов</h2>
      {feedbacks.length > 0 ? (
        <div className={styles.feedbacksGrid}>
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className={styles.feedbackCard}>
              <div className={styles.userInfo}>
                <h3>
                  {feedback.userByUserId.surname} {feedback.userByUserId.username}
                </h3>
                <Rate
                  disabled
                  value={feedback.score}
                  character={<StarFilled style={{ color: "#e91e63" }} />}
                />
              </div>
              <div className={styles.feedbackContent}>
                <p className={styles.feedbackText}>{feedback.text}</p>
                <p className={styles.feedbackDate}>
                  {new Date(feedback.createdAt).toLocaleString()}
                </p>
                {feedback.bouquetId && (
                  <p className={styles.feedbackType}>Отзыв на букет</p>
                )}
                {feedback.orderId && !feedback.bouquetId && (
                  <p className={styles.feedbackType}>Отзыв на заказ</p>
                )}
              </div>

              {/* Показываем существующие ответы */}
              {feedback.feedbacksByRefId?.nodes?.map((reply) => (
                <div key={reply.id} className={styles.replyContainer}>
                  <div className={styles.replyHeader}>
                    <span className={styles.replyAuthor}>
                      {reply.userByUserId.surname} {reply.userByUserId.username}
                    </span>
                    <span className={styles.replyDate}>
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className={styles.replyText}>{reply.text}</p>
                </div>
              ))}

              {/* Форма для ответа - показываем только если еще нет ответа */}
              {feedback.feedbacksByRefId?.nodes?.length === 0 && (
                <div className={styles.replyForm}>
                  <Input.TextArea
                    value={replyTexts[feedback.id] || ""}
                    onChange={(e) => handleReplyTextChange(feedback.id, e.target.value)}
                    placeholder="Написать ответ..."
                    className={styles.replyInput}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleReplySubmit(feedback.id)}
                    className={styles.replyButton}
                  >
                    Ответить
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Empty description="Нет отзывов" />
      )}
    </div>
  );
});

export default ClientsList;