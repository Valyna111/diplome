const {makeExtendSchemaPlugin, gql} = require('graphile-utils');

const UserDataPlugin = makeExtendSchemaPlugin(build => {
    return {
        typeDefs: gql`
            type CustomCartItem {
                id: ID!
                quantity: Int!
                addons: JSON!
                createdAt: String!
                bouquet: Bouquet!
            }

            type OrderWithItems {
                id: ID!
                orderDate: String!
                price: Float!
                statusName: String!
                customerAddress: String!
                createdAt: String!
                items: [CustomOrderItem!]!
            }

            type CustomOrderItem {
                id: ID!
                quantity: Int!
                price: Float!
                addons: JSON!
                createdAt: String!
                bouquet: Bouquet!
            }

            type UserExtendedData {
                user: User!
                cart: CartWithItems!
                wishlist: [Bouquet!]!
                bonuses: Int
                orders: [OrderWithItems!]!
            }

            extend type Query {
                getUserFullData(userId: Int!): UserExtendedData
            }
        `,
        resolvers: {
            Query: {
                getUserFullData: async (_, {userId}, {pgClient}, resolveInfo) => {
                    try {
                        // Получаем пользователя
                        const userQuery = await pgClient.query(
                            `SELECT *
                             FROM users
                             WHERE id = $1`,
                            [userId]
                        );
                        const user = userQuery.rows[0];
                        if (!user) throw new Error('User not found');

                        // Получаем корзину пользователя
                        const cartQuery = await pgClient.query(
                            `SELECT id, user_id, created_at
                             FROM cart
                             WHERE user_id = $1`,
                            [userId]
                        );
                        const cart = cartQuery.rows[0] || {
                            id: null,
                            user_id: userId,
                            created_at: new Date().toISOString()
                        };

                        // Получаем элементы корзины
                        const cartItemsQuery = await pgClient.query(
                            `SELECT ci.id,
                                    ci.quantity,
                                    ci.addons,
                                    ci.created_at,
                                    b.id as bouquet_id,
                                    b.name,
                                    b.price,
                                    b.image,
                                    b.description
                             FROM cart_items ci
                                      JOIN bouquets b ON ci.bouquet_id = b.id
                             WHERE ci.cart_id = $1`,
                            [cart.id]
                        );

                        const cartWithItems = {
                            id: cart.id,
                            user_id: cart.user_id,
                            created_at: cart.created_at,
                            items: cartItemsQuery.rows.map(row => ({
                                id: row.id,
                                quantity: row.quantity,
                                addons: row.addons || [],
                                createdAt: row.created_at,
                                bouquet: {
                                    id: row.bouquet_id,
                                    name: row.name,
                                    price: row.price,
                                    image: row.image,
                                    description: row.description
                                }
                            }))
                        };

                        // Wishlist
                        const wishlistQuery = await pgClient.query(
                            `SELECT b.*
                             FROM wishlist w
                                      JOIN bouquets b ON w.bouquet_id = b.id
                             WHERE w.user_id = $1`,
                            [userId]
                        );
                        const wishlist = wishlistQuery.rows;

                        // Бонусы
                        const bonusesQuery = await pgClient.query(
                            `SELECT bonus
                             FROM bonuses
                             WHERE user_id = $1`,
                            [userId]
                        );
                        const bonuses = bonusesQuery.rows[0]?.bonus || 0;

                        // Заказы с элементами
                        const ordersQuery = await pgClient.query(
                            `SELECT o.id,
                                    o.order_date,
                                    o.price,
                                    s.name        as status_name,
                                    o.customer_address,
                                    o.created_at,
                                    oi.id         as item_id,
                                    oi.quantity   as item_quantity,
                                    oi.price      as item_price,
                                    oi.addons     as item_addons,
                                    oi.created_at as item_created_at,
                                    b.id          as bouquet_id,
                                    b.name        as bouquet_name,
                                    b.price       as bouquet_price,
                                    b.image       as bouquet_image
                             FROM orders o
                                      JOIN status s ON o.status_id = s.id
                                      LEFT JOIN order_items oi ON o.id = oi.order_id
                                      LEFT JOIN bouquets b ON oi.bouquet_id = b.id
                             WHERE o.user_id = $1
                             ORDER BY o.id, oi.id`,
                            [userId]
                        );

                        const orders = [];
                        let currentOrder = null;
                        ordersQuery.rows.forEach(row => {
                            if (!currentOrder || currentOrder.id !== row.id) {
                                currentOrder = {
                                    id: row.id,
                                    orderDate: row.order_date,
                                    price: row.price,
                                    statusName: row.status_name,
                                    customerAddress: row.customer_address,
                                    createdAt: row.created_at,
                                    items: []
                                };
                                orders.push(currentOrder);
                            }

                            if (row.item_id) {
                                currentOrder.items.push({
                                    id: row.item_id,
                                    quantity: row.item_quantity,
                                    price: row.item_price,
                                    addons: row.item_addons || [],
                                    createdAt: row.item_created_at,
                                    bouquet: {
                                        id: row.bouquet_id,
                                        name: row.bouquet_name,
                                        price: row.bouquet_price,
                                        image: row.bouquet_image
                                    }
                                });
                            }
                        });

                        return {
                            user,
                            cart: cartWithItems,
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

const StoreMutationsPlugin = makeExtendSchemaPlugin(build => {
    return {
        typeDefs: gql`

            type WishlistOperationResult {
                success: Boolean!
                wishlist: [Bouquet!]!
                message: String
            }

            type CartOperationResult {
                success: Boolean!
                cart: CartWithItems!  # Изменили тип возвращаемого значения
                message: String
            }

            type CartWithItems {
                id: ID!
                user_id: Int!
                items: [CustomCartItem!]!  # Теперь items доступен как поле
                created_at: String!
                updated_at: String!
            }

            input CustomCartItemInput {
                bouquetId: Int!
                quantity: Int
                addons: [String!]
            }

            input CartItemUpdateInput {
                bouquetId: Int!
                quantity: Int!
                addons: [String!]
            }

            input CartItemDeleteInput {
                bouquetId: Int!
            }

            extend type Mutation {
                # Универсальный метод для работы с корзиной
                syncCart(
                    userId: Int!
                    updates: [CartItemUpdateInput!]!
                    deletes: [CartItemDeleteInput!]!
                ): CartOperationResult!

                # Работа с wishlist
                toggleWishlistItem(
                    userId: Int!
                    bouquetId: Int!
                ): WishlistOperationResult!

                clearWishlist(
                    userId: Int!
                ): WishlistOperationResult!
            }
        `,
        resolvers: {
            Mutation: {
                // Универсальный метод для синхронизации корзины
                syncCart: async (_, {userId, updates, deletes}, {pgClient}) => {
                    try {
                        await pgClient.query('BEGIN');

                        // 1. Получаем или создаем корзину
                        const {rows: [cart]} = await pgClient.query(
                            `INSERT INTO cart (user_id)
                             VALUES ($1)
                             ON CONFLICT (user_id) DO UPDATE
                                 SET user_id = EXCLUDED.user_id
                             RETURNING *`,
                            [userId]
                        );

                        // 2. Обрабатываем удаления
                        if (deletes && deletes.length > 0) {
                            const deleteIds = deletes.map(d => d.bouquetId);
                            await pgClient.query(
                                `DELETE
                                 FROM cart_items
                                 WHERE cart_id = $1
                                   AND bouquet_id = ANY ($2::int[])`,
                                [cart.id, deleteIds]
                            );
                        }

                        // 3. Обрабатываем обновления/добавления
                        if (updates && updates.length > 0) {
                            // Получаем текущие items для проверки существования
                            const {rows: currentItems} = await pgClient.query(
                                `SELECT id, bouquet_id
                                 FROM cart_items
                                 WHERE cart_id = $1`,
                                [cart.id]
                            );

                            for (const item of updates) {
                                const existing = currentItems.find(ci => ci.bouquet_id === item.bouquetId);

                                if (existing) {
                                    // Обновляем существующий item
                                    await pgClient.query(
                                        `UPDATE cart_items
                                         SET quantity = $1,
                                             addons   = $2
                                         WHERE id = $3`,
                                        [item.quantity, item.addons || [], existing.id]
                                    );
                                } else {
                                    // Добавляем новый item
                                    await pgClient.query(
                                        `INSERT INTO cart_items
                                             (cart_id, bouquet_id, quantity, addons)
                                         VALUES ($1, $2, $3, $4)`,
                                        [cart.id, item.bouquetId, item.quantity, item.addons || []]
                                    );
                                }
                            }
                        }

                        // 4. Получаем обновленную корзину
                        const {rows: cartItems} = await pgClient.query(
                            `SELECT ci.*, b.*
                             FROM cart_items ci
                                      JOIN bouquets b ON ci.bouquet_id = b.id
                             WHERE ci.cart_id = $1`,
                            [cart.id]
                        );

                        await pgClient.query('COMMIT');

                        return {
                            success: true,
                            cart: {
                                id: cart.id,
                                user_id: cart.user_id,
                                items: cartItems.map(ci => ({
                                    id: ci.id,
                                    quantity: ci.quantity,
                                    addons: ci.addons || [],
                                    createdAt: ci.created_at,
                                    bouquet: {
                                        id: ci.bouquet_id,
                                        name: ci.name,
                                        price: ci.price,
                                        image: ci.image
                                    }
                                }))
                            },
                            message: 'Cart updated successfully'
                        };

                    } catch (error) {
                        await pgClient.query('ROLLBACK');
                        console.error('Cart sync error:', error);
                        throw error;
                    }
                },

                // Переключение элемента wishlist
                toggleWishlistItem: async (_, {userId, bouquetId}, {pgClient}) => {
                    try {
                        await pgClient.query('BEGIN');

                        // Проверяем существование записи
                        const {rows: [existing]} = await pgClient.query(
                            `SELECT id
                             FROM wishlist
                             WHERE user_id = $1
                               AND bouquet_id = $2`,
                            [userId, bouquetId]
                        );

                        if (existing) {
                            // Удаляем если существует
                            await pgClient.query(
                                `DELETE
                                 FROM wishlist
                                 WHERE id = $1`,
                                [existing.id]
                            );
                        } else {
                            // Добавляем если не существует
                            await pgClient.query(
                                `INSERT INTO wishlist (user_id, bouquet_id)
                                 VALUES ($1, $2)`,
                                [userId, bouquetId]
                            );
                        }

                        // Получаем обновленный wishlist
                        const {rows: wishlist} = await pgClient.query(
                            `SELECT b.*
                             FROM wishlist w
                                      JOIN bouquets b ON w.bouquet_id = b.id
                             WHERE w.user_id = $1`,
                            [userId]
                        );

                        await pgClient.query('COMMIT');

                        return {
                            success: true,
                            wishlist,
                            message: existing
                                ? 'Item removed from wishlist'
                                : 'Item added to wishlist'
                        };

                    } catch (error) {
                        await pgClient.query('ROLLBACK');
                        console.error('Wishlist toggle error:', error);
                        throw error;
                    }
                },

                // Очистка wishlist
                clearWishlist: async (_, {userId}, {pgClient}) => {
                    try {
                        await pgClient.query('BEGIN');

                        await pgClient.query(
                            `DELETE
                             FROM wishlist
                             WHERE user_id = $1`,
                            [userId]
                        );

                        await pgClient.query('COMMIT');

                        return {
                            success: true,
                            wishlist: [],
                            message: 'Wishlist cleared successfully'
                        };

                    } catch (error) {
                        await pgClient.query('ROLLBACK');
                        console.error('Clear wishlist error:', error);
                        throw error;
                    }
                }
            }
        }
    };
});

module.exports = {UserDataPlugin, StoreMutationsPlugin};