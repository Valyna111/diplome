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
                amount
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
            amount
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
    query GetAllOrders {
        orders {
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
    query GetAllUsers {
        users {
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
    query GetAllEvents {
        events {
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

// Запросы для таблицы articles
export const GET_ALL_ARTICLES = gql`
    query GetAllArticles {
        articles {
            id
            header
            image1
            image2
            image3
            description1
            description2
            description3
        }
    }
`;

export const GET_ARTICLE_BY_ID = gql`
    query GetArticleById($id: Int!) {
        articleById(id: $id) {
            id
            header
            image1
            image2
            image3
            description1
            description2
            description3
        }
    }
`;