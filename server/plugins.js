const {makeExtendSchemaPlugin, gql, extend} = require('graphile-utils');

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

            type UserExtendedData {
                user: User!
                cart: CartWithItems!
                wishlist: [Bouquet!]!
                bonuses: Int
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
                                    b.description,
                                    b.amount,
                                    b.sale
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
                                    description: row.description,
                                    amount: row.amount,
                                    sale: row.sale,
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


                        return {
                            user,
                            cart: cartWithItems,
                            wishlist,
                            bonuses,
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

const BlockUserPlugin = makeExtendSchemaPlugin(build => {
    return {
        typeDefs: gql`
            type BlockUserPayload {
                success: Boolean!
                message: String
                user: User
            }

            extend type Mutation {
                blockUser(userId: Int!, isBlocked: Boolean!): BlockUserPayload!
            }
        `,
        resolvers: {
            Mutation: {
                blockUser: async (_, {userId, isBlocked}, {pgClient}) => {
                    try {
                        await pgClient.query('BEGIN');

                        // 1. Проверяем существование пользователя
                        const userCheck = await pgClient.query(
                            `SELECT id
                             FROM users
                             WHERE id = $1`,
                            [userId]
                        );

                        if (userCheck.rows.length === 0) {
                            throw new Error('Пользователь не найден');
                        }

                        // 2. Обновляем статус блокировки
                        const {rows: [updatedUser]} = await pgClient.query(
                            `UPDATE users
                             SET is_blocked = $1
                             WHERE id = $2
                             RETURNING
                                 id,
                                 username,
                                 email,
                                 phone,
                                 is_blocked as "isBlocked",
                                 role_id,
                                 surname,
                                 created_at as "createdAt"`,
                            [isBlocked, userId]
                        );

                        // 3. Получаем информацию о роли
                        const role = await pgClient.query(
                            `SELECT id, name
                             FROM role
                             WHERE id = $1`,
                            [updatedUser.role_id]
                        );

                        await pgClient.query('COMMIT');

                        return {
                            success: true,
                            message: `Пользователь успешно ${isBlocked ? 'заблокирован' : 'разблокирован'}`,
                            user: {
                                ...updatedUser,
                                roleByRoleId: role.rows[0]
                            }
                        };
                    } catch (error) {
                        await pgClient.query('ROLLBACK');
                        console.error('Block user error:', error);
                        return {
                            success: false,
                            message: error.message
                        };
                    }
                }
            }
        }
    };
});

const OCPSchemaPlugin = makeExtendSchemaPlugin(build => {
    return {
        typeDefs: gql`
            type Ocp {
                id: Int!
                address: String!
                createdAt: String!
                ocpItems: [OcpItem!]!
                deliverymen: [DeliverymanInfo!]!
            }

            type OcpItem {
                id: Int!
                itemId: Int!
                amount: Int!
                ocpId: Int!
                createdAt: String!
                item: Item!
            }

            type DeliverymanInfo {
                id: Int!
                userId: Int!
                ocpId: Int!
                createdAt: String!
                user: User!
            }

            extend type Query {
                allOcp: [Ocp!]!
                ocpById(id: Int!): Ocp
            }

            extend type Mutation {
                createOcp(address: String!): Ocp
                createOcpItem(ocpId: Int!, itemId: Int!, amount: Int!): OcpItem
                assignDeliveryman(ocpId: Int!, userId: Int!): DeliverymanInfo
            }
        `,
        resolvers: {
            Ocp: {
                createdAt: (parent) => parent.created_at || new Date().toISOString(),
                ocpItems: async (parent, _, {pgClient}) => {
                    const {rows} = await pgClient.query(
                        `SELECT id, item_id as "itemId", amount, ocp_id as "ocpId", created_at
                         FROM ocp_item
                         WHERE ocp_id = $1`,
                        [parent.id]
                    );
                    return rows.map(row => ({
                        ...row,
                        createdAt: row.created_at
                    }));
                },
                deliverymen: async (parent, _, {pgClient}) => {
                    const {rows} = await pgClient.query(
                        `SELECT id, user_id as "userId", ocp_id as "ocpId", created_at
                         FROM deliveryman_info
                         WHERE ocp_id = $1`,
                        [parent.id]
                    );
                    return rows.map(row => ({
                        ...row,
                        createdAt: row.created_at
                    }));
                }
            },
            OcpItem: {
                createdAt: (parent) => parent.created_at || new Date().toISOString(),
                item: async (parent, _, {pgClient}) => {
                    const {rows} = await pgClient.query(
                        `SELECT *
                         FROM item
                         WHERE id = $1`,
                        [parent.itemId]
                    );
                    return rows[0];
                }
            },
            DeliverymanInfo: {
                createdAt: (parent) => parent.created_at || new Date().toISOString(),
                user: async (parent, _, {pgClient}) => {
                    const {rows} = await pgClient.query(
                        `SELECT *
                         FROM users
                         WHERE id = $1`,
                        [parent.userId]
                    );
                    return rows[0];
                }
            },
            Query: {
                allOcp: async (_, __, {pgClient}) => {
                    const {rows} = await pgClient.query(
                        `SELECT id, address, created_at
                         FROM ocp
                         ORDER BY created_at DESC`
                    );
                    return rows.map(row => ({
                        ...row,
                        createdAt: row.created_at
                    }));
                },
                ocpById: async (_, {id}, {pgClient}) => {
                    const {rows} = await pgClient.query(
                        `SELECT id, address, created_at
                         FROM ocp
                         WHERE id = $1`,
                        [id]
                    );
                    return rows[0] ? {
                        ...rows[0],
                        createdAt: rows[0].created_at
                    } : null;
                }
            },
            Mutation: {
                createOcp: async (_, {address}, {pgClient}) => {
                    const {rows} = await pgClient.query(
                        `INSERT INTO ocp (address)
                         VALUES ($1)
                         RETURNING id, address, created_at`,
                        [address]
                    );
                    return {
                        ...rows[0],
                        createdAt: rows[0].created_at
                    };
                },
                createOcpItem: async (_, {ocpId, itemId, amount}, {pgClient}) => {
                    const {rows} = await pgClient.query(
                        `INSERT INTO ocp_item (ocp_id, item_id, amount)
                         VALUES ($1, $2, $3)
                         RETURNING id, item_id as "itemId", amount, ocp_id as "ocpId", created_at`,
                        [ocpId, itemId, amount]
                    );
                    return {
                        ...rows[0],
                        createdAt: rows[0].created_at
                    };
                },
                assignDeliveryman: async (_, {ocpId, userId}, {pgClient}) => {
                    const {rows} = await pgClient.query(
                        `INSERT INTO deliveryman_info (ocp_id, user_id)
                         VALUES ($1, $2)
                         RETURNING id, user_id as "userId", ocp_id as "ocpId", created_at`,
                        [ocpId, userId]
                    );
                    return {
                        ...rows[0],
                        createdAt: rows[0].created_at
                    };
                }
            }
        }
    };
});

const OrderPlugin = makeExtendSchemaPlugin(build => {
    return {
        typeDefs: gql`
            input CreateOrderInput {
                userId: Int!
                items: [OrderItemInput!]!
                orderType: String!
                address: String
                ocpId: Int
                paymentType: String!
                orderDate: String!
                orderTime: String!
            }

            input OrderItemInput {
                bouquetId: Int!
                quantity: Int!
                price: Float!
                addons: [String!]
            }

            type CustomOrderItem {
                id: ID!
                quantity: Int!
                price: Float!
                addons: JSON!
                createdAt: String!
                bouquet: Bouquet!
            }

            type OrderResponse {
                id: ID!
                orderDate: String!
                orderTime: String!
                price: Float!
                status: Status!
                address: String
                delivery: DeliverymanInfo
                paymentType: String!
                orderType: String!
                ocp: Ocp
                items: [CustomOrderItem!]!
            }

            type TakeOrderResponse {
                success: Boolean!
                message: String
                order: DeliveryOrder
            }

            type OrderItem {
                id: ID!
                quantity: Int!
                price: Float!
                addons: JSON!
                bouquet: Bouquet!
            }

            type OrderStatus {
                id: ID!
                name: String!
            }

            # Типы для пользователя
            type UserOrder {
                id: ID!
                orderDate: String!
                orderTime: String!
                price: Float!
                status: OrderStatus!
                address: String
                paymentType: String!
                orderType: String!
                items: [OrderItem!]!
                ocp: Ocp,
                deliveryInfo: DeliveryInfo
                customer: User!
            }

            type UserOrderConnection {
                nodes: [UserOrder!]!
                totalCount: Int!
            }

            # Типы для курьера
            type DeliveryOrder {
                id: ID!
                orderDate: String!
                orderTime: String!
                price: Float!
                status: OrderStatus!
                address: String
                paymentType: String!
                orderType: String!
                items: [OrderItem!]!
                customer: User!
                pickupPoint: Ocp
            }

            type DeliveryOrderConnection {
                nodes: [DeliveryOrder!]!
                totalCount: Int!
            }

            type AvailableOrderConnection {
                nodes: [DeliveryOrder!]!
                totalCount: Int!
            }

            type DeliveryInfo {
                deliveryman: User
                assignedAt: String
            }

            type AllOrdersConnection {
                nodes: [UserOrder!]!
                totalCount: Int!
            }

            type MonthlySales {
                month: String!
                total: Float!
            }

            type BouquetSales {
                name: String!
                count: Int!
            }

            type CategorySales {
                name: String!
                total: Float!
            }

            type SalesReport {
                monthlySales: [MonthlySales!]!
                bouquetSales: [BouquetSales!]!
                categorySales: [CategorySales!]!
            }

            # Запросы
            extend type Query {
                # Для пользователя
                userOrders(
                    userId: Int!
                    status: String
                    limit: Int = 10
                    offset: Int = 0
                ): UserOrderConnection!

                # Для курьера
                deliverymanOrders(
                    deliverymanId: Int!
                    status: String
                    limit: Int = 10
                    offset: Int = 0
                ): DeliveryOrderConnection!

                availableDeliveryOrders(
                    limit: Int = 10
                    offset: Int = 0
                ): AvailableOrderConnection!

                availableFloristOrders(
                    limit: Int = 10
                    offset: Int = 0
                ): AvailableOrderConnection!

                allOrders(limit: Int, offset: Int): AllOrdersConnection!

                # Отчеты по продажам
                getSalesByMonth(startDate: String!, endDate: String!, statuses: [String!]!): [MonthlySales!]!
                getSalesByBouquet(startDate: String!, endDate: String!, statuses: [String!]!): [BouquetSales!]!
                getSalesByCategory(startDate: String!, endDate: String!, statuses: [String!]!): [CategorySales!]!
            }

            # Мутации
            extend type Mutation {
                createOrder(input: CreateOrderInput!): OrderResponse!
                takeOrder(orderId: Int!, deliverymanId: Int!): TakeOrderResponse!
                updateOrderStatus(orderId: Int!, statusId: Int!): DeliveryOrder!
            }
        `,
        resolvers: {
            Query: {
                // Запросы пользователя
                userOrders: async (_, {userId, status, limit, offset}, {pgClient}) => {
                    const query = {
                        text: `
                            SELECT o.*,
                                   json_agg(
                                           json_build_object(
                                                   'id', oi.id,
                                                   'quantity', oi.quantity,
                                                   'price', oi.price,
                                                   'addons', oi.addons,
                                                   'bouquet', json_build_object(
                                                           'id', b.id,
                                                           'name', b.name,
                                                           'price', b.price,
                                                           'image', b.image,
                                                           'description', b.description
                                                              )
                                           )
                                   )                                                              AS items,
                                   (SELECT row_to_json(s) FROM status s WHERE s.id = o.status_id) AS status,
                                   (SELECT row_to_json(d)
                                    FROM deliveryman_info d
                                    WHERE d.id = o.delivery_id)                                   AS delivery_info,
                                   (SELECT row_to_json(ocp) FROM ocp WHERE ocp.id = o.ocp_id)     AS ocp
                            FROM orders o
                                     JOIN order_items oi ON oi.order_id = o.id
                                     JOIN bouquets b ON b.id = oi.bouquet_id
                            WHERE o.user_id = $1
                                ${status ? 'AND s.name = $2' : ''}
                            GROUP BY o.id
                            ORDER BY o.order_date DESC
                            LIMIT $${status ? 3 : 2} OFFSET $${status ? 4 : 3}
                        `,
                        values: [userId]
                    };

                    if (status) query.values.push(status);
                    query.values.push(limit, offset);

                    const {rows: orders} = await pgClient.query(query);
                    const {rows: [{count}]} = await pgClient.query(
                        `SELECT COUNT(*)
                         FROM orders
                         WHERE user_id = $1`,
                        [userId]
                    );

                    return {
                        nodes: orders.map(formatUserOrder),
                        totalCount: parseInt(count, 10)
                    };
                },

                // Запросы курьера
                deliverymanOrders: async (_, {deliverymanId, status, limit, offset}, {pgClient}) => {
                    const {rows: [deliveryman]} = await pgClient.query(
                        `SELECT id
                         FROM deliveryman_info
                         WHERE user_id = $1`,
                        [deliverymanId]
                    );

                    if (!deliveryman) throw new Error('Deliveryman not found');

                    const query = {
                        text: `
                            SELECT o.*,
                                   json_agg(
                                           json_build_object(
                                                   'id', oi.id,
                                                   'quantity', oi.quantity,
                                                   'price', oi.price,
                                                   'addons', oi.addons,
                                                   'bouquet', json_build_object(
                                                           'id', b.id,
                                                           'name', b.name,
                                                           'price', b.price,
                                                           'image', b.image,
                                                           'description', b.description
                                                              )
                                           )
                                   )                                                              AS items,
                                   (SELECT row_to_json(u) FROM users u WHERE u.id = o.user_id)    AS customer,
                                   (SELECT row_to_json(s) FROM status s WHERE s.id = o.status_id) AS status,
                                   (SELECT row_to_json(ocp) FROM ocp WHERE ocp.id = o.ocp_id)     AS pickupPoint
                            FROM orders o
                                     JOIN order_items oi ON oi.order_id = o.id
                                     JOIN bouquets b ON b.id = oi.bouquet_id
                            WHERE o.delivery_id = $1
                                ${status ? 'AND s.name = $2' : ''}
                            GROUP BY o.id
                            ORDER BY o.order_date ASC
                            LIMIT $${status ? 3 : 2} OFFSET $${status ? 4 : 3}
                        `,
                        values: [deliveryman.id]
                    };

                    if (status) query.values.push(status);
                    query.values.push(limit, offset);

                    const {rows: orders} = await pgClient.query(query);
                    const {rows: [{count}]} = await pgClient.query(
                        `SELECT COUNT(*)
                         FROM orders
                         WHERE delivery_id = $1`,
                        [deliveryman.id]
                    );

                    return {
                        nodes: orders.map(formatDeliveryOrder),
                        totalCount: parseInt(count, 10)
                    };
                },
                availableFloristOrders: async (_, {limit, offset}, {pgClient}) => {
                    const query = {
                        text: `
                            SELECT o.*,
                                   json_agg(
                                           json_build_object(
                                                   'id', oi.id,
                                                   'quantity', oi.quantity,
                                                   'price', oi.price,
                                                   'addons', oi.addons,
                                                   'bouquet', json_build_object(
                                                           'id', b.id,
                                                           'name', b.name,
                                                           'price', b.price,
                                                           'image', b.image,
                                                           'description', b.description
                                                              )
                                           )
                                   )                                                              AS items,
                                   (SELECT row_to_json(u) FROM users u WHERE u.id = o.user_id)    AS customer,
                                   (SELECT row_to_json(s) FROM status s WHERE s.id = o.status_id) AS status,
                                   (SELECT row_to_json(ocp) FROM ocp WHERE ocp.id = o.ocp_id)     AS pickupPoint
                            FROM orders o
                                     JOIN order_items oi ON oi.order_id = o.id
                                     JOIN bouquets b ON b.id = oi.bouquet_id
                            WHERE o.status_id IN (1, 2, 3) -- Using your custom status IDs (1=Новый, 2=Собран, 3=В процессе)
                            GROUP BY o.id
                            ORDER BY CASE o.status_id
                                         WHEN 1 THEN 1 -- Новый - highest priority
                                         WHEN 3 THEN 2 -- В процессе
                                         WHEN 2 THEN 3 -- Собран
                                         ELSE 4
                                         END,
                                     o.order_date ASC
                            LIMIT $1 OFFSET $2
                        `,
                        values: [limit, offset]
                    };

                    const {rows: orders} = await pgClient.query(query);

                    const {rows: [{count}]} = await pgClient.query(
                        `SELECT COUNT(*)
                         FROM orders
                         WHERE order_type = 'delivery'
                           AND delivery_id IS NULL
                           AND status_id IN (1, 2, 3)`
                    );

                    return {
                        nodes: orders.map(formatDeliveryOrder),
                        totalCount: parseInt(count, 10)
                    };
                },
                availableDeliveryOrders: async (_, {limit, offset}, {pgClient}) => {
                    const query = {
                        text: `
                            SELECT o.*,
                                   json_agg(
                                           json_build_object(
                                                   'id', oi.id,
                                                   'quantity', oi.quantity,
                                                   'price', oi.price,
                                                   'addons', oi.addons,
                                                   'bouquet', json_build_object(
                                                           'id', b.id,
                                                           'name', b.name,
                                                           'price', b.price,
                                                           'image', b.image,
                                                           'description', b.description
                                                              )
                                           )
                                   )                                                              AS items,
                                   (SELECT row_to_json(u) FROM users u WHERE u.id = o.user_id)    AS customer,
                                   (SELECT row_to_json(s) FROM status s WHERE s.id = o.status_id) AS status,
                                   (SELECT row_to_json(ocp) FROM ocp WHERE ocp.id = o.ocp_id)     AS pickupPoint
                            FROM orders o
                                     JOIN order_items oi ON oi.order_id = o.id
                                     JOIN bouquets b ON b.id = oi.bouquet_id
                            WHERE o.order_type = 'delivery'
                              AND o.delivery_id IS NULL
                              AND o.status_id IN (1, 2, 3) -- Using your custom status IDs (1=Новый, 2=Собран, 3=В процессе)
                            GROUP BY o.id
                            ORDER BY CASE o.status_id
                                         WHEN 1 THEN 1 -- Новый - highest priority
                                         WHEN 3 THEN 2 -- В процессе
                                         WHEN 2 THEN 3 -- Собран
                                         ELSE 4
                                         END,
                                     o.order_date ASC
                            LIMIT $1 OFFSET $2
                        `,
                        values: [limit, offset]
                    };

                    const {rows: orders} = await pgClient.query(query);

                    const {rows: [{count}]} = await pgClient.query(
                        `SELECT COUNT(*)
                         FROM orders
                         WHERE order_type = 'delivery'
                           AND delivery_id IS NULL
                           AND status_id IN (1, 2, 3)`
                    );

                    return {
                        nodes: orders.map(formatDeliveryOrder),
                        totalCount: parseInt(count, 10)
                    };
                },
                allOrders: async (_, {limit, offset}, {pgClient}) => {
                    const query = {
                        text: `
                            SELECT o.*,
                                   json_agg(
                                           json_build_object(
                                                   'id', oi.id,
                                                   'quantity', oi.quantity,
                                                   'price', oi.price,
                                                   'addons', oi.addons,
                                                   'bouquet', json_build_object(
                                                           'id', b.id,
                                                           'name', b.name,
                                                           'price', b.price,
                                                           'image', b.image,
                                                           'description', b.description
                                                              )
                                           )
                                   )                                                              AS items,
                                   (SELECT row_to_json(u) FROM users u WHERE u.id = o.user_id)    AS customer,
                                   (SELECT row_to_json(s) FROM status s WHERE s.id = o.status_id) AS status,
                                   (SELECT row_to_json(d)
                                    FROM deliveryman_info d
                                    WHERE d.id = o.delivery_id)                                   AS delivery_info,
                                   (SELECT row_to_json(ocp) FROM ocp WHERE ocp.id = o.ocp_id)     AS ocp
                            FROM orders o
                                     JOIN order_items oi ON oi.order_id = o.id
                                     JOIN bouquets b ON b.id = oi.bouquet_id
                            GROUP BY o.id
                            ORDER BY o.order_date DESC
                            LIMIT $1 OFFSET $2
                        `,
                        values: [limit, offset]
                    };

                    const {rows: orders} = await pgClient.query(query);
                    const {rows: [{count}]} = await pgClient.query(
                        `SELECT COUNT(*)
                         FROM orders`
                    );

                    return {
                        nodes: orders.map(formatUserOrder),
                        totalCount: parseInt(count, 10)
                    };
                },
                getSalesByMonth: async (_, { startDate, endDate, statuses }, { pgClient }) => {
                    const query = `
                        SELECT 
                            TO_CHAR(o.order_date, 'YYYY-MM') as month,
                            SUM(o.price) as total
                        FROM orders o
                        WHERE o.order_date BETWEEN $1 AND $2
                        AND o.status_id IN (SELECT id FROM status WHERE name = ANY($3))
                        GROUP BY TO_CHAR(o.order_date, 'YYYY-MM')
                        ORDER BY month
                    `;
                    console.log('getSalesByMonth params:', { startDate, endDate, statuses });
                    const result = await pgClient.query(query, [startDate, endDate, statuses]);
                    console.log('getSalesByMonth result:', result.rows);
                    return result.rows;
                },
                getSalesByBouquet: async (_, { startDate, endDate, statuses }, { pgClient }) => {
                    const query = `
                        SELECT 
                            b.name,
                            COUNT(oi.id) as count
                        FROM order_items oi
                        JOIN bouquets b ON oi.bouquet_id = b.id
                        JOIN orders o ON oi.order_id = o.id
                        WHERE o.order_date BETWEEN $1 AND $2
                        AND o.status_id IN (SELECT id FROM status WHERE name = ANY($3))
                        GROUP BY b.name
                        ORDER BY count DESC
                        LIMIT 10
                    `;
                    console.log('getSalesByBouquet params:', { startDate, endDate, statuses });
                    const result = await pgClient.query(query, [startDate, endDate, statuses]);
                    console.log('getSalesByBouquet result:', result.rows);
                    return result.rows;
                },
                getSalesByCategory: async (_, { startDate, endDate, statuses }, { pgClient }) => {
                    const query = `
                        SELECT 
                            c.name,
                            SUM(oi.price * oi.quantity) as total
                        FROM order_items oi
                        JOIN bouquets b ON oi.bouquet_id = b.id
                        JOIN category c ON b.category_id = c.id
                        JOIN orders o ON oi.order_id = o.id
                        WHERE o.order_date BETWEEN $1 AND $2
                        AND o.status_id IN (SELECT id FROM status WHERE name = ANY($3))
                        GROUP BY c.name
                        ORDER BY total DESC
                    `;
                    console.log('getSalesByCategory params:', { startDate, endDate, statuses });
                    const result = await pgClient.query(query, [startDate, endDate, statuses]);
                    console.log('getSalesByCategory result:', result.rows);
                    return result.rows;
                }
            },
            Mutation: {
                createOrder: async (_, {input}, {pgClient}) => {
                    await pgClient.query('BEGIN');

                    try {
                        // 1. Создаем заказ
                        const {rows: [order]} = await pgClient.query(
                            `INSERT INTO orders (user_id,
                                                 price,
                                                 status_id,
                                                 address,
                                                 payment_type,
                                                 order_type,
                                                 ocp_id,
                                                 order_date,
                                                 order_time)
                             VALUES ($1, $2, 1, $3, $4, $5, $6, $7, $8)
                             RETURNING *`,
                            [
                                input.userId,
                                input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                                input.address,
                                input.paymentType,
                                input.orderType,
                                input.ocpId,
                                input.orderDate,
                                input.orderTime
                            ]
                        );

                        // 2. Добавляем товары
                        const items = [];
                        for (const item of input.items) {
                            const {rows: [orderItem]} = await pgClient.query(
                                `INSERT INTO order_items (order_id, bouquet_id, quantity, price, addons)
                                 VALUES ($1, $2, $3, $4, $5)
                                 RETURNING *`,
                                [order.id, item.bouquetId, item.quantity, item.price, JSON.stringify(item.addons || [])]
                            );

                            // Получаем полную информацию о букете
                            const {rows: [bouquet]} = await pgClient.query(
                                `SELECT *
                                 FROM bouquets
                                 WHERE id = $1`,
                                [item.bouquetId]
                            );

                            items.push({
                                ...orderItem,
                                bouquet
                            });
                        }

                        // Получаем полную информацию о заказе
                        const {rows: [status]} = await pgClient.query(
                            `SELECT *
                             FROM status
                             WHERE id = 1`
                        );

                        let ocp = null;
                        if (order.ocp_id) {
                            const {rows: [ocpData]} = await pgClient.query(
                                `SELECT *
                                 FROM ocp
                                 WHERE id = $1`,
                                [order.ocp_id]
                            );
                            ocp = ocpData;
                        }

                        await pgClient.query('COMMIT');

                        return {
                            ...order,
                            status,
                            items,
                            orderDate: order.order_date, // Format as 'YYYY-MM-DD'
                            orderTime: order.order_time, // Already a string in 'HH:MM:SS' format
                            paymentType: order.payment_type,
                            orderType: order.order_type,
                            ocp,
                            delivery: null,

                        };
                    } catch (error) {
                        await pgClient.query('ROLLBACK');
                        throw error;
                    }
                },

                updateOrderStatus: async (_, {orderId, statusId}, {pgClient}) => {
                    await pgClient.query('BEGIN');

                    try {
                        // Update the status
                        const {rows: [order]} = await pgClient.query(
                            `UPDATE orders
                             SET status_id = $1
                             WHERE id = $2
                             RETURNING *`,
                            [statusId, orderId]
                        );

                        // Get the updated status
                        const {rows: [status]} = await pgClient.query(
                            `SELECT *
                             FROM status
                             WHERE id = $1`,
                            [statusId]
                        );

                        // Get order items
                        const {rows: items} = await pgClient.query(
                            `SELECT oi.*, b.*
                             FROM order_items oi
                                      JOIN bouquets b ON oi.bouquet_id = b.id
                             WHERE oi.order_id = $1`,
                            [orderId]
                        );

                        // Get customer info
                        const {rows: [customer]} = await pgClient.query(
                            `SELECT *
                             FROM users
                             WHERE id = $1`,
                            [order.user_id]
                        );

                        // Get pickup point if exists
                        let pickupPoint = null;
                        if (order.ocp_id) {
                            const {rows: [ocp]} = await pgClient.query(
                                `SELECT *
                                 FROM ocp
                                 WHERE id = $1`,
                                [order.ocp_id]
                            );
                            pickupPoint = ocp;
                        }

                        // Get delivery info if exists
                        let delivery = null;
                        if (order.delivery_id) {
                            const {rows: [deliveryInfo]} = await pgClient.query(
                                `SELECT di.*
                                 FROM deliveryman_info di
                                 WHERE di.id = $1`,
                                [order.delivery_id]
                            );
                            delivery = deliveryInfo;
                        }

                        await pgClient.query('COMMIT');

                        return {
                            id: order.id,
                            orderDate: order.order_date,
                            orderTime: order.order_time,
                            price: order.price,
                            status: status,
                            address: order.address,
                            paymentType: order.payment_type,
                            orderType: order.order_type,
                            items: items.map(item => ({
                                id: item.id,
                                quantity: item.quantity,
                                price: item.price,
                                addons: item.addons,
                                bouquet: {
                                    id: item.bouquet_id,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image,
                                    description: item.description
                                }
                            })),
                            customer: customer,
                            pickupPoint: pickupPoint,
                            delivery: delivery
                        };
                    } catch (error) {
                        await pgClient.query('ROLLBACK');
                        throw error;
                    }
                },

                takeOrder: async (_, {orderId, deliverymanId}, {pgClient}) => {
                    await pgClient.query('BEGIN');

                    try {
                        // Проверяем, что заказ доступен для взятия
                        // const {rows: [order]} = await pgClient.query(
                        //     `SELECT *
                        //      FROM orders
                        //      WHERE id = $1
                        //        AND order_type = 'delivery'
                        //        AND delivery_id IS NULL`,
                        //     [orderId]
                        // );
                        //
                        // if (!order) {
                        //     throw new Error('Заказ недоступен для взятия');
                        // }

                        // Проверяем, что пользователь является курьером
                        const {rows: [deliveryman]} = await pgClient.query(
                            `SELECT *
                             FROM deliveryman_info
                             WHERE user_id = $1`,
                            [deliverymanId]
                        );

                        if (!deliveryman) {
                            throw new Error('Пользователь не является курьером');
                        }

                        // Назначаем курьера
                        const {rows: [updatedOrder]} = await pgClient.query(
                            `UPDATE orders
                             SET delivery_id = $1
                             WHERE id = $2
                             RETURNING *`,
                            [deliveryman.id, orderId]
                        );

                        // Получаем полную информацию о заказе
                        const {rows: [status]} = await pgClient.query(
                            `SELECT *
                             FROM status
                             WHERE id = $1`,
                            [updatedOrder.statusId]
                        );

                        const {rows: items} = await pgClient.query(
                            `SELECT oi.*, b.*
                             FROM order_items oi
                                      JOIN bouquets b ON oi.bouquet_id = b.id
                             WHERE oi.order_id = $1`,
                            [orderId]
                        );

                        // Форматируем заказ для ответа
                        const formattedOrder = {
                            id: updatedOrder.id,
                            orderDate: updatedOrder.order_date,
                            orderTime: updatedOrder.order_time,
                            price: updatedOrder.price,
                            status: status,
                            address: updatedOrder.address,
                            paymentType: updatedOrder.payment_type,
                            orderType: updatedOrder.order_type,
                            items: items.map(item => ({
                                id: item.id,
                                quantity: item.quantity,
                                price: item.price,
                                addons: item.addons,
                                bouquet: {
                                    id: item.bouquet_id,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image,
                                    description: item.description
                                }
                            })),
                            customer: null, // Будет заполнено ниже
                            pickupPoint: null // Будет заполнено ниже
                        };

                        // Получаем информацию о клиенте
                        const {rows: [customer]} = await pgClient.query(
                            `SELECT *
                             FROM users
                             WHERE id = $1`,
                            [updatedOrder.user_id]
                        );
                        formattedOrder.customer = customer;

                        // Получаем информацию о пункте выдачи, если есть
                        if (updatedOrder.ocp_id) {
                            const {rows: [ocp]} = await pgClient.query(
                                `SELECT *
                                 FROM ocp
                                 WHERE id = $1`,
                                [updatedOrder.ocp_id]
                            );
                            formattedOrder.pickupPoint = ocp;
                        }

                        await pgClient.query('COMMIT');

                        return {
                            success: true,
                            message: 'Заказ успешно взят',
                            order: formattedOrder
                        };
                    } catch (error) {
                        await pgClient.query('ROLLBACK');
                        return {
                            success: false,
                            message: error.message,
                            order: null
                        };
                    }
                }
            }
        }
    };
});

function formatUserOrder(order) {
    return {
        ...order,
        orderDate: order.order_date,
        orderTime: order.order_time,
        paymentType: order.payment_type,
        ocp: order.ocp,
        orderType: order.order_type,
        customer: order.customer,
        deliveryInfo: order.delivery_info ? {
            deliveryman: order.delivery_info.user,
            assignedAt: order.delivery_info.created_at
        } : null
    };
}

function formatDeliveryOrder(order) {
    return {
        ...order,
        orderDate: order.order_date,
        orderTime: order.order_time,
        paymentType: order.payment_type,
        orderType: order.order_type
    };
}

module.exports = {UserDataPlugin, StoreMutationsPlugin, BlockUserPlugin, OCPSchemaPlugin, OrderPlugin};