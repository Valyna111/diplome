import { gql } from '@apollo/client';

// Запросы для таблицы Item
export const GET_ITEM = gql`
    query GetItem($itemid: Int!) {
        itemById(itemid: $itemid) {
            itemid
            itemname
            typeid
            cost
            type {
                typeid
                name
            }
        }
    }
`;

export const LIST_ITEMS = gql`
    query ListItems {
        allItems {
            nodes {
                itemid
                itemname
                typeid
                cost
                type {
                    typeid
                    name
                }
            }
        }
    }
`;

// Запросы для таблицы Bonuses
export const GET_BONUS = gql`
    query GetBonus($bonusid: Int!) {
        bonusById(bonusid: $bonusid) {
            bonusid
            bonus
            userid
            user {
                userid
                username
            }
        }
    }
`;

export const LIST_BONUSES = gql`
    query ListBonuses {
        allBonuses {
            nodes {
                bonusid
                bonus
                userid
                user {
                    userid
                    username
                }
            }
        }
    }
`;

// Запросы для таблицы Bouquets
export const GET_BOUQUET = gql`
    query GetBouquet($bouquetid: Int!) {
        bouquetById(bouquetid: $bouquetid) {
            bouquetid
            bouquetname
            category
            price
            image
            description
            amount
            sale
            secondImage
            categoryByCategory {
                categoryid
                category
            }
            flowersInBouquetsByBouquetid {
                nodes {
                    fbid
                    flowerid
                    amount
                    flower {
                        itemid
                        itemname
                    }
                }
            }
        }
    }
`;

export const LIST_BOUQUETS = gql`
    query ListBouquets {
        allBouquets {
            nodes {
                bouquetid
                bouquetname
                category
                price
                image
                description
                amount
                sale
                secondImage
                categoryByCategory {
                    categoryid
                    category
                }
                flowersInBouquetsByBouquetid {
                    nodes {
                        fbid
                        flowerid
                        amount
                        flower {
                            itemid
                            itemname
                        }
                    }
                }
            }
        }
    }
`;

// Запросы для таблицы Cart
export const GET_CART = gql`
    query GetCart($cartid: Int!) {
        cartById(cartid: $cartid) {
            cartid
            userid
            bouquetid
            user {
                userid
                username
            }
            bouquet {
                bouquetid
                bouquetname
            }
        }
    }
`;

export const LIST_CARTS = gql`
    query ListCarts {
        allCarts {
            nodes {
                cartid
                userid
                bouquetid
                user {
                    userid
                    username
                }
                bouquet {
                    bouquetid
                    bouquetname
                }
            }
        }
    }
`;

// Запросы для таблицы Category
export const GET_CATEGORY = gql`
    query GetCategory($categoryid: Int!) {
        categoryById(categoryid: $categoryid) {
            categoryid
            category
        }
    }
`;

export const LIST_CATEGORIES = gql`
    query ListCategories {
        allCategories {
            nodes {
                categoryid
                category
            }
        }
    }
`;

// Запросы для таблицы CreditInfo
export const GET_CREDIT_INFO = gql`
    query GetCreditInfo($creditid: Int!) {
        creditInfoById(creditid: $creditid) {
            creditid
            cardnumber
            cvv
            userid
            ownername
            user {
                userid
                username
            }
        }
    }
`;

export const LIST_CREDIT_INFOS = gql`
    query ListCreditInfos {
        allCreditInfos {
            nodes {
                creditid
                cardnumber
                cvv
                userid
                ownername
                user {
                    userid
                    username
                }
            }
        }
    }
`;

// Запросы для таблицы DeliveryManInfo
export const GET_DELIVERY_MAN_INFO = gql`
    query GetDeliveryManInfo($diliverymanid: Int!) {
        deliveryManInfoById(diliverymanid: $diliverymanid) {
            diliverymanid
            userid
            ocpid
            user {
                userid
                username
            }
            ocp {
                ocpid
                address
            }
        }
    }
`;

export const LIST_DELIVERY_MAN_INFOS = gql`
    query ListDeliveryManInfos {
        allDeliveryManInfos {
            nodes {
                diliverymanid
                userid
                ocpid
                user {
                    userid
                    username
                }
                ocp {
                    ocpid
                    address
                }
            }
        }
    }
`;

// Запросы для таблицы Feedback
export const GET_FEEDBACK = gql`
    query GetFeedback($feedbackid: Int!) {
        feedbackById(feedbackid: $feedbackid) {
            feedbackid
            orderid
            userid
            text
            score
            user {
                userid
                username
            }
            order {
                orderid
                orderdate
            }
        }
    }
`;

export const LIST_FEEDBACKS = gql`
    query ListFeedbacks {
        allFeedbacks {
            nodes {
                feedbackid
                orderid
                userid
                text
                score
                user {
                    userid
                    username
                }
                order {
                    orderid
                    orderdate
                }
            }
        }
    }
`;

// Запросы для таблицы FlowersInBouquets
export const GET_FLOWERS_IN_BOUQUETS = gql`
    query GetFlowersInBouquets($fbid: Int!) {
        flowersInBouquetsById(fbid: $fbid) {
            fbid
            flowerid
            amount
            bouquetid
            flower {
                itemid
                itemname
            }
            bouquet {
                bouquetid
                bouquetname
            }
        }
    }
`;

export const LIST_FLOWERS_IN_BOUQUETS = gql`
    query ListFlowersInBouquets {
        allFlowersInBouquets {
            nodes {
                fbid
                flowerid
                amount
                bouquetid
                flower {
                    itemid
                    itemname
                }
                bouquet {
                    bouquetid
                    bouquetname
                }
            }
        }
    }
`;

// Запросы для таблицы OCP
export const GET_OCP = gql`
    query GetOCP($ocpid: Int!) {
        ocpById(ocpid: $ocpid) {
            ocpid
            address
        }
    }
`;

export const LIST_OCPS = gql`
    query ListOCPs {
        allOcps {
            nodes {
                ocpid
                address
            }
        }
    }
`;

// Запросы для таблицы OCPItem
export const GET_OCP_ITEM = gql`
    query GetOCPItem($ocpitemd: Int!) {
        ocpItemById(ocpitemd: $ocpitemd) {
            ocpitemd
            itemid
            amount
            ocpid
            item {
                itemid
                itemname
            }
            ocp {
                ocpid
                address
            }
        }
    }
`;

export const LIST_OCP_ITEMS = gql`
    query ListOCPItems {
        allOcpItems {
            nodes {
                ocpitemd
                itemid
                amount
                ocpid
                item {
                    itemid
                    itemname
                }
                ocp {
                    ocpid
                    address
                }
            }
        }
    }
`;

// Запросы для таблицы Orders
export const GET_ORDER = gql`
    query GetOrder($orderid: Int!) {
        orderById(orderid: $orderid) {
            orderid
            userid
            bouquetid
            orderdate
            price
            statusid
            customeraddress
            delivery
            user {
                userid
                username
            }
            bouquet {
                bouquetid
                bouquetname
            }
            status {
                statusid
                status
            }
        }
    }
`;

export const LIST_ORDERS = gql`
    query ListOrders {
        allOrders {
            nodes {
                orderid
                userid
                bouquetid
                orderdate
                price
                statusid
                customeraddress
                delivery
                user {
                    userid
                    username
                }
                bouquet {
                    bouquetid
                    bouquetname
                }
                status {
                    statusid
                    status
                }
            }
        }
    }
`;

// Запросы для таблицы Role
export const GET_ROLE = gql`
    query GetRole($roleid: Int!) {
        roleById(roleid: $roleid) {
            roleid
            role
        }
    }
`;

export const LIST_ROLES = gql`
    query ListRoles {
        allRoles {
            nodes {
                roleid
                role
            }
        }
    }
`;

// Запросы для таблицы Status
export const GET_STATUS = gql`
    query GetStatus($statusid: Int!) {
        statusById(statusid: $statusid) {
            statusid
            status
        }
    }
`;

export const LIST_STATUSES = gql`
    query ListStatuses {
        allStatuses {
            nodes {
                statusid
                status
            }
        }
    }
`;

// Запросы для таблицы Type
export const GET_TYPE = gql`
    query GetType($typeid: Int!) {
        typeByTypeid(typeid: $typeid) {
            typeid
            name
        }
    }
`;

export const LIST_TYPES = gql`
    query ListTypes {
        allTypes {
            nodes {
                typeid
                name
            }
        }
    }
`;

// Запросы для таблицы Users
export const GET_USER = gql`
    query GetUser($userid: Int!) {
        userById(userid: $userid) {
            userid
            username
            passhash
            email
            phone
            role
            dateofbirth
            usersyrname
            roleByRole {
                roleid
                role
            }
        }
    }
`;

export const LIST_USERS = gql`
    query ListUsers {
        allUsers {
            nodes {
                userid
                username
                passhash
                email
                phone
                role
                dateofbirth
                usersyrname
                roleByRole {
                    roleid
                    role
                }
            }
        }
    }
`;

// Запросы для таблицы Wishlist
export const GET_WISHLIST = gql`
    query GetWishlist($wishlistid: Int!) {
        wishlistById(wishlistid: $wishlistid) {
            wishlistid
            userid
            bouquetid
            user {
                userid
                username
            }
            bouquet {
                bouquetid
                bouquetname
            }
        }
    }
`;

export const LIST_WISHLISTS = gql`
    query ListWishlists {
        allWishlists {
            nodes {
                wishlistid
                userid
                bouquetid
                user {
                    userid
                    username
                }
                bouquet {
                    bouquetid
                    bouquetname
                }
            }
        }
    }
`;