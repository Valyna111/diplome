const {makeExtendSchemaPlugin, gql} = require('graphile-utils');

const UserDataPlugin = makeExtendSchemaPlugin(build => {
    return {
        typeDefs: gql`
            type UserExtendedData {
                user: User!
                cart: [Bouquet!]!
                wishlist: [Bouquet!]!
                bonuses: Int
                orders: [Order!]!
            }

            extend type Query {
                getUserFullData(userId: Int!): UserExtendedData
            }
        `,
        resolvers: {
            Query: {
                getUserFullData: async (_, {userId}, {pgClient}, resolveInfo) => {
                    try {
                        // Получаем основную информацию о пользователе
                        const userQuery = await pgClient.query(
                            `SELECT *
                             FROM users
                             WHERE id = $1`,
                            [userId]
                        );
                        const user = userQuery.rows[0];

                        if (!user) {
                            throw new Error('User not found');
                        }

                        // Получаем корзину пользователя
                        const cartQuery = await pgClient.query(
                            `SELECT b.*
                             FROM cart c
                                      JOIN bouquets b ON c.bouquet_id = b.id
                             WHERE c.user_id = $1`,
                            [userId]
                        );
                        const cart = cartQuery.rows;

                        // Получаем wishlist пользователя
                        const wishlistQuery = await pgClient.query(
                            `SELECT b.*
                             FROM wishlist w
                                      JOIN bouquets b ON w.bouquet_id = b.id
                             WHERE w.user_id = $1`,
                            [userId]
                        );
                        const wishlist = wishlistQuery.rows;

                        // Получаем бонусы пользователя
                        const bonusesQuery = await pgClient.query(
                            `SELECT bonus
                             FROM bonuses
                             WHERE user_id = $1`,
                            [userId]
                        );
                        const bonuses = bonusesQuery.rows[0]?.bonus || 0;

                        // Получаем заказы пользователя
                        const ordersQuery = await pgClient.query(
                            `SELECT o.*, s.name as status_name
                             FROM orders o
                                      JOIN status s ON o.status_id = s.id
                             WHERE o.user_id = $1`,
                            [userId]
                        );
                        const orders = ordersQuery.rows;

                        return {
                            user,
                            cart,
                            wishlist,
                            bonuses,
                            orders
                        };
                    } catch (error) {
                        console.error('Error in getUserFullData resolver:', error);
                        throw error;
                    }
                }
            }
        }
    };
});

module.exports = {UserDataPlugin};