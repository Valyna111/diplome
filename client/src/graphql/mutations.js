import { gql } from '@apollo/client';

// Мутации для таблицы item
export const CREATE_ITEM = gql`
    mutation CreateItem($name: String!, $typeId: Int!, $cost: Money!) {
        createItem(input: { item: { name: $name, typeId: $typeId, cost: $cost } }) {
            item {
                id
                name
                type {
                    id
                    name
                }
                cost
            }
        }
    }
`;

export const UPDATE_ITEM = gql`
    mutation UpdateItem($id: Int!, $name: String!, $typeId: Int!, $cost: Money!) {
        updateItemById(input: { id: $id, itemPatch: { name: $name, typeId: $typeId, cost: $cost } }) {
            item {
                id
                name
                type {
                    id
                    name
                }
                cost
            }
        }
    }
`;

export const DELETE_ITEM = gql`
    mutation DeleteItem($id: Int!) {
        deleteItemById(input: { id: $id }) {
            item {
                id
            }
        }
    }
`;

// Мутации для таблицы bonuses
export const CREATE_BONUS = gql`
    mutation CreateBonus($bonus: Int!, $userId: Int!) {
        createBonus(input: { bonus: { bonus: $bonus, userId: $userId } }) {
            bonus {
                id
                bonus
                user {
                    id
                    username
                }
            }
        }
    }
`;

export const UPDATE_BONUS = gql`
    mutation UpdateBonus($id: Int!, $bonus: Int!, $userId: Int!) {
        updateBonusById(input: { id: $id, bonusPatch: { bonus: $bonus, userId: $userId } }) {
            bonus {
                id
                bonus
                user {
                    id
                    username
                }
            }
        }
    }
`;

export const DELETE_BONUS = gql`
    mutation DeleteBonus($id: Int!) {
        deleteBonusById(input: { id: $id }) {
            bonus {
                id
            }
        }
    }
`;

// Мутации для таблицы bouquets
export const CREATE_BOUQUET = gql`
    mutation CreateBouquet($name: String!, $categoryId: Int!, $price: Money!, $image: String!, $description: String!, $amount: Int!, $sale: Int, $secondImage: String) {
        createBouquet(input: { bouquet: { name: $name, categoryId: $categoryId, price: $price, image: $image, description: $description, amount: $amount, sale: $sale, secondImage: $secondImage } }) {
            bouquet {
                id
                name
                category {
                    id
                    name
                }
                price
                image
                description
                amount
                sale
                secondImage
            }
        }
    }
`;

export const UPDATE_BOUQUET = gql`
    mutation UpdateBouquet($id: Int!, $name: String!, $categoryId: Int!, $price: Money!, $image: String!, $description: String!, $amount: Int!, $sale: Int, $secondImage: String) {
        updateBouquetById(input: { id: $id, bouquetPatch: { name: $name, categoryId: $categoryId, price: $price, image: $image, description: $description, amount: $amount, sale: $sale, secondImage: $secondImage } }) {
            bouquet {
                id
                name
                category {
                    id
                    name
                }
                price
                image
                description
                amount
                sale
                secondImage
            }
        }
    }
`;

export const DELETE_BOUQUET = gql`
    mutation DeleteBouquet($id: Int!) {
        deleteBouquetById(input: { id: $id }) {
            bouquet {
                id
            }
        }
    }
`;

// Мутации для таблицы cart
export const CREATE_CART = gql`
    mutation CreateCart($userId: Int!, $bouquetId: Int!) {
        createCart(input: { cart: { userId: $userId, bouquetId: $bouquetId } }) {
            cart {
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
    }
`;

export const UPDATE_CART = gql`
    mutation UpdateCart($id: Int!, $userId: Int!, $bouquetId: Int!) {
        updateCartById(input: { id: $id, cartPatch: { userId: $userId, bouquetId: $bouquetId } }) {
            cart {
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
    }
`;

export const DELETE_CART = gql`
    mutation DeleteCart($id: Int!) {
        deleteCartById(input: { id: $id }) {
            cart {
                id
            }
        }
    }
`;

// Мутации для таблицы category
export const CREATE_CATEGORY = gql`
    mutation CreateCategory($name: String!) {
        createCategory(input: { category: { name: $name } }) {
            category {
                id
                name
            }
        }
    }
`;

export const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($id: Int!, $name: String!) {
        updateCategoryById(input: { id: $id, categoryPatch: { name: $name } }) {
            category {
                id
                name
            }
        }
    }
`;

export const DELETE_CATEGORY = gql`
    mutation DeleteCategory($id: Int!) {
        deleteCategoryById(input: { id: $id }) {
            category {
                id
            }
        }
    }
`;

// Мутации для таблицы credit_info
export const CREATE_CREDIT_INFO = gql`
    mutation CreateCreditInfo($cardNumber: Int!, $cvv: Int!, $userId: Int!, $ownerName: String!) {
        createCreditInfo(input: { creditInfo: { cardNumber: $cardNumber, cvv: $cvv, userId: $userId, ownerName: $ownerName } }) {
            creditInfo {
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
    }
`;

export const UPDATE_CREDIT_INFO = gql`
    mutation UpdateCreditInfo($id: Int!, $cardNumber: Int!, $cvv: Int!, $userId: Int!, $ownerName: String!) {
        updateCreditInfoById(input: { id: $id, creditInfoPatch: { cardNumber: $cardNumber, cvv: $cvv, userId: $userId, ownerName: $ownerName } }) {
            creditInfo {
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
    }
`;

export const DELETE_CREDIT_INFO = gql`
    mutation DeleteCreditInfo($id: Int!) {
        deleteCreditInfoById(input: { id: $id }) {
            creditInfo {
                id
            }
        }
    }
`;

// Мутации для таблицы deliveryman_info
export const CREATE_DELIVERYMAN_INFO = gql`
    mutation CreateDeliverymanInfo($userId: Int!, $ocpId: Int!) {
        createDeliverymanInfo(input: { deliverymanInfo: { userId: $userId, ocpId: $ocpId } }) {
            deliverymanInfo {
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
    }
`;

export const UPDATE_DELIVERYMAN_INFO = gql`
    mutation UpdateDeliverymanInfo($id: Int!, $userId: Int!, $ocpId: Int!) {
        updateDeliverymanInfoById(input: { id: $id, deliverymanInfoPatch: { userId: $userId, ocpId: $ocpId } }) {
            deliverymanInfo {
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
    }
`;

export const DELETE_DELIVERYMAN_INFO = gql`
    mutation DeleteDeliverymanInfo($id: Int!) {
        deleteDeliverymanInfoById(input: { id: $id }) {
            deliverymanInfo {
                id
            }
        }
    }
`;

// Мутации для таблицы feedback
export const CREATE_FEEDBACK = gql`
    mutation CreateFeedback($orderId: Int!, $userId: Int!, $text: String!, $score: Int!) {
        createFeedback(input: { feedback: { orderId: $orderId, userId: $userId, text: $text, score: $score } }) {
            feedback {
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
    }
`;

export const UPDATE_FEEDBACK = gql`
    mutation UpdateFeedback($id: Int!, $orderId: Int!, $userId: Int!, $text: String!, $score: Int!) {
        updateFeedbackById(input: { id: $id, feedbackPatch: { orderId: $orderId, userId: $userId, text: $text, score: $score } }) {
            feedback {
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
    }
`;

export const DELETE_FEEDBACK = gql`
    mutation DeleteFeedback($id: Int!) {
        deleteFeedbackById(input: { id: $id }) {
            feedback {
                id
            }
        }
    }
`;

// Мутации для таблицы flowers_in_bouquets
export const CREATE_FLOWERS_IN_BOUQUET = gql`
    mutation CreateFlowersInBouquet($flowerId: Int!, $amount: Int!, $bouquetId: Int!) {
        createFlowersInBouquet(input: { flowersInBouquet: { flowerId: $flowerId, amount: $amount, bouquetId: $bouquetId } }) {
            flowersInBouquet {
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
    }
`;

export const UPDATE_FLOWERS_IN_BOUQUET = gql`
    mutation UpdateFlowersInBouquet($id: Int!, $flowerId: Int!, $amount: Int!, $bouquetId: Int!) {
        updateFlowersInBouquetById(input: { id: $id, flowersInBouquetPatch: { flowerId: $flowerId, amount: $amount, bouquetId: $bouquetId } }) {
            flowersInBouquet {
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
    }
`;

export const DELETE_FLOWERS_IN_BOUQUET = gql`
    mutation DeleteFlowersInBouquet($id: Int!) {
        deleteFlowersInBouquetById(input: { id: $id }) {
            flowersInBouquet {
                id
            }
        }
    }
`;

// Мутации для таблицы ocp
export const CREATE_OCP = gql`
    mutation CreateOcp($address: String!) {
        createOcp(input: { ocp: { address: $address } }) {
            ocp {
                id
                address
            }
        }
    }
`;

export const UPDATE_OCP = gql`
    mutation UpdateOcp($id: Int!, $address: String!) {
        updateOcpById(input: { id: $id, ocpPatch: { address: $address } }) {
            ocp {
                id
                address
            }
        }
    }
`;

export const DELETE_OCP = gql`
    mutation DeleteOcp($id: Int!) {
        deleteOcpById(input: { id: $id }) {
            ocp {
                id
            }
        }
    }
`;

// Мутации для таблицы ocp_item
export const CREATE_OCP_ITEM = gql`
    mutation CreateOcpItem($itemId: Int!, $amount: Int!, $ocpId: Int!) {
        createOcpItem(input: { ocpItem: { itemId: $itemId, amount: $amount, ocpId: $ocpId } }) {
            ocpItem {
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
    }
`;

export const UPDATE_OCP_ITEM = gql`
    mutation UpdateOcpItem($id: Int!, $itemId: Int!, $amount: Int!, $ocpId: Int!) {
        updateOcpItemById(input: { id: $id, ocpItemPatch: { itemId: $itemId, amount: $amount, ocpId: $ocpId } }) {
            ocpItem {
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
    }
`;

export const DELETE_OCP_ITEM = gql`
    mutation DeleteOcpItem($id: Int!) {
        deleteOcpItemById(input: { id: $id }) {
            ocpItem {
                id
            }
        }
    }
`;

// Мутации для таблицы orders
export const CREATE_ORDER = gql`
    mutation CreateOrder($userId: Int!, $bouquetId: Int!, $orderDate: Date!, $price: Money!, $statusId: Int!, $customerAddress: String!, $deliveryId: Int!) {
        createOrder(input: { order: { userId: $userId, bouquetId: $bouquetId, orderDate: $orderDate, price: $price, statusId: $statusId, customerAddress: $customerAddress, deliveryId: $deliveryId } }) {
            order {
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
    }
`;

export const UPDATE_ORDER = gql`
    mutation UpdateOrder($id: Int!, $userId: Int!, $bouquetId: Int!, $orderDate: Date!, $price: Money!, $statusId: Int!, $customerAddress: String!, $deliveryId: Int!) {
        updateOrderById(input: { id: $id, orderPatch: { userId: $userId, bouquetId: $bouquetId, orderDate: $orderDate, price: $price, statusId: $statusId, customerAddress: $customerAddress, deliveryId: $deliveryId } }) {
            order {
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
    }
`;

export const DELETE_ORDER = gql`
    mutation DeleteOrder($id: Int!) {
        deleteOrderById(input: { id: $id }) {
            order {
                id
            }
        }
    }
`;

// Мутации для таблицы role
export const CREATE_ROLE = gql`
    mutation CreateRole($name: String!) {
        createRole(input: { role: { name: $name } }) {
            role {
                id
                name
            }
        }
    }
`;

export const UPDATE_ROLE = gql`
    mutation UpdateRole($id: Int!, $name: String!) {
        updateRoleById(input: { id: $id, rolePatch: { name: $name } }) {
            role {
                id
                name
            }
        }
    }
`;

export const DELETE_ROLE = gql`
    mutation DeleteRole($id: Int!) {
        deleteRoleById(input: { id: $id }) {
            role {
                id
            }
        }
    }
`;

// Мутации для таблицы status
export const CREATE_STATUS = gql`
    mutation CreateStatus($name: String!) {
        createStatus(input: { status: { name: $name } }) {
            status {
                id
                name
            }
        }
    }
`;

export const UPDATE_STATUS = gql`
    mutation UpdateStatus($id: Int!, $name: String!) {
        updateStatusById(input: { id: $id, statusPatch: { name: $name } }) {
            status {
                id
                name
            }
        }
    }
`;

export const DELETE_STATUS = gql`
    mutation DeleteStatus($id: Int!) {
        deleteStatusById(input: { id: $id }) {
            status {
                id
            }
        }
    }
`;

// Мутации для таблицы type
export const CREATE_TYPE = gql`
    mutation CreateType($name: String!) {
        createType(input: { type: { name: $name } }) {
            type {
                id
                name
            }
        }
    }
`;

export const UPDATE_TYPE = gql`
    mutation UpdateType($id: Int!, $name: String!) {
        updateTypeById(input: { id: $id, typePatch: { name: $name } }) {
            type {
                id
                name
            }
        }
    }
`;

export const DELETE_TYPE = gql`
    mutation DeleteType($id: Int!) {
        deleteTypeById(input: { id: $id }) {
            type {
                id
            }
        }
    }
`;

// Мутации для таблицы users
export const CREATE_USER = gql`
    mutation CreateUser($username: String!, $passhash: String!, $email: String, $phone: String, $roleId: Int!, $dateOfBirth: Date, $surname: String!) {
        createUser(input: { user: { username: $username, passhash: $passhash, email: $email, phone: $phone, roleId: $roleId, dateOfBirth: $dateOfBirth, surname: $surname } }) {
            user {
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
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($id: Int!, $username: String!, $passhash: String!, $email: String, $phone: String, $roleId: Int!, $dateOfBirth: Date, $surname: String!) {
        updateUserById(input: { id: $id, userPatch: { username: $username, passhash: $passhash, email: $email, phone: $phone, roleId: $roleId, dateOfBirth: $dateOfBirth, surname: $surname } }) {
            user {
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
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($id: Int!) {
        deleteUserById(input: { id: $id }) {
            user {
                id
            }
        }
    }
`;

// Мутации для таблицы wishlist
export const CREATE_WISHLIST = gql`
    mutation CreateWishlist($userId: Int!, $bouquetId: Int!) {
        createWishlist(input: { wishlist: { userId: $userId, bouquetId: $bouquetId } }) {
            wishlist {
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
    }
`;

export const UPDATE_WISHLIST = gql`
    mutation UpdateWishlist($id: Int!, $userId: Int!, $bouquetId: Int!) {
        updateWishlistById(input: { id: $id, wishlistPatch: { userId: $userId, bouquetId: $bouquetId } }) {
            wishlist {
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
    }
`;

export const DELETE_WISHLIST = gql`
    mutation DeleteWishlist($id: Int!) {
        deleteWishlistById(input: { id: $id }) {
            wishlist {
                id
            }
        }
    }
`;

// Мутации для таблицы events
export const CREATE_EVENT = gql`
    mutation CreateEvent($description: String!, $image: String!, $bouquetId: Int!) {
        createEvent(input: { event: { description: $description, image: $image, bouquetId: $bouquetId } }) {
            event {
                id
                description
                image
                bouquet {
                    id
                    name
                }
            }
        }
    }
`;

export const UPDATE_EVENT = gql`
    mutation UpdateEvent($id: Int!, $description: String!, $image: String!, $bouquetId: Int!) {
        updateEventById(input: { id: $id, eventPatch: { description: $description, image: $image, bouquetId: $bouquetId } }) {
            event {
                id
                description
                image
                bouquet {
                    id
                    name
                }
            }
        }
    }
`;

export const DELETE_EVENT = gql`
    mutation DeleteEvent($id: Int!) {
        deleteEventById(input: { id: $id }) {
            event {
                id
            }
        }
    }
`;

// Мутации для таблицы articles
export const CREATE_ARTICLE = gql`
    mutation CreateArticle($header: String!, $image1: String, $image2: String, $image3: String, $description1: String, $description2: String, $description3: String) {
        createArticle(input: { article: { header: $header, image1: $image1, image2: $image2, image3: $image3, description1: $description1, description2: $description2, description3: $description3 } }) {
            article {
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
    }
`;

export const UPDATE_ARTICLE = gql`
    mutation UpdateArticle($id: Int!, $header: String!, $image1: String, $image2: String, $image3: String, $description1: String, $description2: String, $description3: String) {
        updateArticleById(input: { id: $id, articlePatch: { header: $header, image1: $image1, image2: $image2, image3: $image3, description1: $description1, description2: $description2, description3: $description3 } }) {
            article {
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
    }
`;

export const DELETE_ARTICLE = gql`
    mutation DeleteArticle($id: Int!) {
        deleteArticleById(input: { id: $id }) {
            article {
                id
            }
        }
    }
`;