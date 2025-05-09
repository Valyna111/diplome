import {gql} from '@apollo/client';

// Запросы для таблицы item
export const GET_ALL_ITEMS = gql`
    query allItems {
        allItems {
            nodes {
                id
                name
                typeByTypeId {
                    id
                    name
                }
                cost
            }
        }
    }
`;

export const GET_ITEM_BY_ID = gql`
    query GetItemById($id: Int!) {
        itemById(id: $id) {
            id
            name
            type {
                id
                name
            }
            cost
        }
    }
`;

// Запросы для таблицы bonuses
export const GET_ALL_BONUSES = gql`
    query GetAllBonuses {
        bonuses {
            id
            bonus
            user {
                id
                username
            }
        }
    }
`;

export const GET_BONUS_BY_ID = gql`
    query GetBonusById($id: Int!) {
        bonusById(id: $id) {
            id
            bonus
            user {
                id
                username
            }
        }
    }
`;

// Запросы для таблицы bouquets
export const GET_ALL_BOUQUETS = gql`
    query allBouquets {
        allBouquets {
            nodes {
                id
                name
                categoryByCategoryId {
                    id
                    name
                }
                price
                image
                description
                sale
                secondImage
                itemsInBouquetsByBouquetId {
                    nodes {
                        id
                        amount
                        itemId
                        itemByItemId {
                            name
                            cost
                        }
                    }
                }
            }
        }
    }
`;

export const GET_BOUQUET_BY_ID = gql`
    query bouquetById($id: Int!) {
        bouquetById(id: $id) {
            id
            name
            categoryByCategoryId {
                id
                name
            }
            price
            image
            description
            sale
            secondImage
            itemsInBouquetsByBouquetId {
                nodes {
                    id
                    amount
                    itemId
                    itemByItemId {
                        name
                        cost
                    }
                }
            }
        }
    }
`;

// Запросы для таблицы cart
export const GET_ALL_CARTS = gql`
    query GetAllCarts {
        carts {
            id
            user {
                id
                username
            }
            bouquet {
                id
                name
            }
        }
    }
`;

export const GET_CART_BY_ID = gql`
    query GetCartById($id: Int!) {
        cartById(id: $id) {
            id
            user {
                id
                username
            }
            bouquet {
                id
                name
            }
        }
    }
`;

// Запросы для таблицы category
export const GET_ALL_CATEGORIES = gql`
    query allCategories {
        allCategories {
            nodes {
                id
                name
            }
        }
    }
`;

export const GET_CATEGORY_BY_ID = gql`
    query GetCategoryById($id: Int!) {
        categoryById(id: $id) {
            id
            name
        }
    }
`;

// Запросы для таблицы credit_info
export const GET_ALL_CREDIT_INFOS = gql`
    query GetAllCreditInfos {
        creditInfos {
            id
            cardNumber
            cvv
            user {
                id
                username
            }
            ownerName
        }
    }
`;

export const GET_CREDIT_INFO_BY_ID = gql`
    query GetCreditInfoById($id: Int!) {
        creditInfoById(id: $id) {
            id
            cardNumber
            cvv
            user {
                id
                username
            }
            ownerName
        }
    }
`;

// Запросы для таблицы deliveryman_info
export const GET_ALL_DELIVERYMAN_INFOS = gql`
    query GetAllDeliverymanInfos {
        deliverymanInfos {
            id
            user {
                id
                username
            }
            ocp {
                id
                address
            }
        }
    }
`;

export const GET_DELIVERYMAN_INFO_BY_ID = gql`
    query GetDeliverymanInfoById($id: Int!) {
        deliverymanInfoById(id: $id) {
            id
            user {
                id
                username
            }
            ocp {
                id
                address
            }
        }
    }
`;

// Запросы для таблицы feedback
export const GET_ALL_FEEDBACKS = gql`
    query GetAllFeedbacks {
        feedbacks {
            id
            order {
                id
                user {
                    id
                    username
                }
            }
            user {
                id
                username
            }
            text
            score
        }
    }
`;

export const GET_FEEDBACK_BY_ID = gql`
    query GetFeedbackById($id: Int!) {
        feedbackById(id: $id) {
            id
            order {
                id
                user {
                    id
                    username
                }
            }
            user {
                id
                username
            }
            text
            score
        }
    }
`;

// Запросы для таблицы flowers_in_bouquets
export const GET_ALL_FLOWERS_IN_BOUQUETS = gql`
    query GetAllFlowersInBouquets {
        flowersInBouquets {
            id
            flower {
                id
                name
            }
            amount
            bouquet {
                id
                name
            }
        }
    }
`;

export const GET_FLOWERS_IN_BOUQUET_BY_ID = gql`
    query GetFlowersInBouquetById($id: Int!) {
        flowersInBouquetById(id: $id) {
            id
            flower {
                id
                name
            }
            amount
            bouquet {
                id
                name
            }
        }
    }
`;

// Запросы для таблицы ocp
export const GET_ALL_OCPS = gql`
    query GetAllOcps {
        ocps {
            id
            address
        }
    }
`;

export const GET_OCP_BY_ID = gql`
    query GetOcpById($id: Int!) {
        ocpById(id: $id) {
            id
            address
        }
    }
`;

// Запросы для таблицы ocp_item
export const GET_ALL_OCP_ITEMS = gql`
    query GetAllOcpItems {
        ocpItems {
            id
            item {
                id
                name
            }
            amount
            ocp {
                id
                address
            }
        }
    }
`;

export const GET_OCP_ITEM_BY_ID = gql`
    query GetOcpItemById($id: Int!) {
        ocpItemById(id: $id) {
            id
            item {
                id
                name
            }
            amount
            ocp {
                id
                address
            }
        }
    }
`;

// Запросы для таблицы orders
export const GET_ALL_ORDERS = gql`
    query GetAllOrders($limit: Int, $offset: Int) {
        allOrders(limit: $limit, offset: $offset) {
            nodes {
                id
                orderDate
                orderTime
                price
                status {
                    id
                    name
                }
                address
                paymentType
                orderType
                items {
                    id
                    quantity
                    price
                    addons
                    bouquet {
                        id
                        name
                        price
                        image
                        description
                    }
                }
                customer {
                    id
                    username
                    phone
                }
                deliveryInfo {
                    deliveryman {
                        id
                        username
                        phone
                    }
                    assignedAt
                }
                ocp {
                    id
                    address
                }
            }
            totalCount
        }
    }
`;

export const GET_ORDER_BY_ID = gql`
    query GetOrderById($id: Int!) {
        orderById(id: $id) {
            id
            user {
                id
                username
            }
            bouquet {
                id
                name
            }
            orderDate
            price
            status {
                id
                name
            }
            customerAddress
            delivery {
                id
                user {
                    id
                    username
                }
            }
        }
    }
`;

// Запросы для таблицы role
export const GET_ALL_ROLES = gql`
    query GetAllRoles {
        roles {
            id
            name
        }
    }
`;

export const GET_ROLE_BY_ID = gql`
    query GetRoleById($id: Int!) {
        roleById(id: $id) {
            id
            name
        }
    }
`;

// Запросы для таблицы status
export const GET_ALL_STATUSES = gql`
    query GetAllStatuses {
        statuses {
            id
            name
        }
    }
`;

export const GET_STATUS_BY_ID = gql`
    query GetStatusById($id: Int!) {
        statusById(id: $id) {
            id
            name
        }
    }
`;

// Запросы для таблицы type
export const GET_ALL_TYPES = gql`
    query allTypes {
        allTypes {
            nodes {
                id
                name
            }
        }
    }
`;

export const GET_TYPE_BY_ID = gql`
    query GetTypeById($id: Int!) {
        typeById(id: $id) {
            id
            name
        }
    }
`;

// Запросы для таблицы users
export const GET_ALL_USERS = gql`
    query allUsers {
        allUsers {
            nodes {
                createdAt
                dateOfBirth
                email
                id
                isBlocked
                phone
                roleByRoleId {
                    name
                    id
                }
                username
                surname
            }
        }
    }
`;

export const GET_USER_BY_ID = gql`
    query GetUserById($id: Int!) {
        userById(id: $id) {
            id
            username
            passhash
            email
            phone
            role {
                id
                name
            }
            dateOfBirth
            surname
        }
    }
`;

// Запросы для таблицы wishlist
export const GET_ALL_WISHLISTS = gql`
    query GetAllWishlists {
        wishlists {
            id
            user {
                id
                username
            }
            bouquet {
                id
                name
            }
        }
    }
`;

export const GET_WISHLIST_BY_ID = gql`
    query GetWishlistById($id: Int!) {
        wishlistById(id: $id) {
            id
            user {
                id
                username
            }
            bouquet {
                id
                name
            }
        }
    }
`;

// Запросы для таблицы events
export const GET_ALL_EVENTS = gql`
    query allEvents {
        allEvents {
            nodes {
                id
                description
                image
            }
        }
    }
`;

export const GET_EVENT_BY_ID = gql`
    query GetEventById($id: Int!) {
        eventById(id: $id) {
            id
            description
            image
            bouquet {
                id
                name
            }
        }
    }
`;

export const GET_ALL_ARTICLES = gql`
    query GetAllArticles {
        allArticles {
            nodes {
                id
                header
                createdAt
                articleBlocksByArticleId {
                    nodes {
                        id
                        image
                        text
                        orderNum
                    }
                }
            }
        }
    }
`;

export const GET_ARTICLE_BY_ID = gql`
    query GetArticleById($id: Int!) {
        articleById(id: $id) {
            id
            header
            createdAt
            articleBlocksByArticleId {
                nodes {
                    id
                    image
                    text
                    orderNum
                }
            }
        }
    }
`;

export const GET_USER_RELATIVE_DATA = gql`
    query GetUserFullData($userId: Int!) {
        getUserFullData(userId: $userId) {
            user {
                id
                username
                email
            }
            cart {
                id
                user_id
                items {
                    id
                    quantity
                    addons
                    createdAt
                    bouquet {
                        id
                        name
                        price
                        image
                        sale
                    }
                }
            }
            wishlist {
                id
                name
                price
                image
            }
            bonuses
        }
    }
`;

export const GET_USER_ORDERS = gql`
    query GetUserOrders($userId: Int!, $status: String, $limit: Int, $offset: Int) {
        userOrders(userId: $userId, status: $status, limit: $limit, offset: $offset) {
            nodes {
                id
                orderDate
                orderTime
                price
                status {
                    id
                    name
                }
                address
                paymentType
                orderType
                items {
                    id
                    quantity
                    price
                    addons
                    bouquet {
                        id
                        name
                        price
                        image
                        description
                    }
                }
                deliveryInfo {
                    deliveryman {
                        id
                        username
                        phone
                    }
                    assignedAt
                }
                ocp {
                    id
                    address
                }
            }
            totalCount
        }
    }
`;

export const GET_DELIVERYMAN_ORDERS = gql`
    query GetDeliverymanOrders($deliverymanId: Int!, $status: String, $limit: Int, $offset: Int) {
        deliverymanOrders(deliverymanId: $deliverymanId, status: $status, limit: $limit, offset: $offset) {
            nodes {
                id
                orderDate
                orderTime
                price
                status {
                    id
                    name
                }
                address
                paymentType
                orderType
                items {
                    id
                    quantity
                    price
                    addons
                    bouquet {
                        id
                        name
                        price
                        image
                        description
                    }
                }
                customer {
                    id
                    username
                    phone
                    address
                }
                pickupPoint {
                    id
                    address
                }
            }
            totalCount
        }
    }
`;

export const GET_AVAILABLE_ORDERS = gql`
    query GetAvailableDeliveryOrders($limit: Int, $offset: Int) {
        availableDeliveryOrders(limit: $limit, offset: $offset) {
            nodes {
                id
                orderDate
                orderTime
                price
                status {
                    id
                    name
                }
                address
                paymentType
                orderType
                items {
                    id
                    quantity
                    price
                    addons
                    bouquet {
                        id
                        name
                        price
                        image
                        description
                    }
                }
                customer {
                    id
                    username
                    phone
                    address
                }
                pickupPoint {
                    id
                    address
                }
            }
            totalCount
        }
    }
`;
export const GET_AVAILABLE_FLORIS_ORDERS = gql`
    query GetAvailableFloristOrders($limit: Int, $offset: Int) {
        availableFloristOrders(limit: $limit, offset: $offset) {
            nodes {
                id
                orderDate
                orderTime
                price
                status {
                    id
                    name
                }
                address
                paymentType
                orderType
                items {
                    id
                    quantity
                    price
                    addons
                    bouquet {
                        id
                        name
                        price
                        image
                        description
                    }
                }
                customer {
                    id
                    username
                    phone
                    address
                }
                pickupPoint {
                    id
                    address
                }
            }
            totalCount
        }
    }
`;

export const GET_SALES_REPORT = gql`
    query GetSalesReport($startDate: String!, $endDate: String!, $statuses: [String!]!) {
        getSalesByMonth(startDate: $startDate, endDate: $endDate, statuses: $statuses) {
            month
            total
        }
        getSalesByBouquet(startDate: $startDate, endDate: $endDate, statuses: $statuses) {
            name
            count
        }
        getSalesByCategory(startDate: $startDate, endDate: $endDate, statuses: $statuses) {
            name
            total
        }
    }
`;

export const GET_AVAILABLE_BOUQUET_QUANTITIES = gql`
    query GetAvailableBouquetQuantities($ocpId: Int!) {
        getAvailableBouquetQuantities(ocpId: $ocpId) {
            bouquetId
            maxQuantity
        }
    }
`;