import { gql } from '@apollo/client';
import { makeAutoObservable, runInAction } from 'mobx';

export default class FeedbackStore {
    feedbackData = null;
    isLoading = false;
    error = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    async verifyFeedbackData(encryptedData) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await fetch('http://localhost:4000/api/feedback/verify-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ encryptedData }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка при проверке данных отзыва');
            }

            runInAction(() => {
                this.feedbackData = data;
            });

            return data;
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
            throw error;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async addOrderFeedback(feedback) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await this.rootStore.client.mutate({
                mutation: gql`
                    mutation AddFeedback($input: NewFeedbackInput!) {
                        addFeedback(input: $input) {
                            success
                            message
                            feedback {
                                id
                                text
                                score
                            }
                        }
                    }
                `,
                variables: {
                    input: {
                        orderId: this.feedbackData.orderId,
                        bouquetId: feedback.bouquetId,
                        userId: this.feedbackData.userId,
                        text: feedback.comment,
                        score: feedback.rating
                    }
                }
            });

            const { data } = response;

            if (!data.addFeedback.success) {
                throw new Error(data.addFeedback.message);
            }

            // Обновляем список доступных букетов
            if (feedback.bouquetId) {
                runInAction(() => {
                    this.feedbackData.bouquets = this.feedbackData.bouquets.filter(
                        b => b.bouquetId !== feedback.bouquetId
                    );
                });
            }

            return data.addFeedback;
        } catch (error) {
            runInAction(() => {
                this.error = error.message;
            });
            throw error;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    reset() {
        this.feedbackData = null;
        this.isLoading = false;
        this.error = null;
    }

    // Ответ на отзыв
    async replyToFeedback(feedbackId, text, userId) {
        try {
            const result = await this.rootStore.client.mutate({
                mutation: gql`
                    mutation ReplyToFeedback($feedbackId: Int!, $text: String!, $userId: Int!) {
                        replyToFeedback(feedbackId: $feedbackId, text: $text, userId: $userId) {
                            success
                            message
                            feedback {
                                id
                                text
                                score
                                createdAt
                                userByUserId {
                                    username
                                    surname
                                    email
                                }
                                refId
                            }
                        }
                    }
                    `,
                variables: {
                    feedbackId: parseInt(feedbackId),
                    text,
                    userId: parseInt(userId)
                }
            });

            if (result.data.replyToFeedback.success) {
                return {
                    success: true,
                    message: result.data.replyToFeedback.message
                };
            } else {
                throw new Error(result.data.replyToFeedback.message);
            }
        } catch (error) {
            console.error("Error replying to feedback:", error);
            throw error;
        }
    }
} 