import { gql } from '@apollo/client';

// Мутации для таблицы Item
export const CREATE_ITEM = gql`
    mutation CreateItem($itemname: String!, $typeid: Int!, $cost: Float!) {
        createItem(input: { item: { itemname: $itemname, typeid: $typeid, cost: $cost } }) {
            item {
                itemid
                itemname
                typeid
                cost
            }
        }
    }
`;

export const UPDATE_ITEM = gql`
    mutation UpdateItem($itemid: Int!, $itemname: String, $typeid: Int, $cost: Float) {
        updateItemById(input: { itemPatch: { itemname: $itemname, typeid: $typeid, cost: $cost }, itemid: $itemid }) {
            item {
                itemid
                itemname
                typeid
                cost
            }
        }
    }
`;

export const DELETE_ITEM = gql`
    mutation DeleteItem($itemid: Int!) {
        deleteItemById(input: { itemid: $itemid }) {
            item {
                itemid
            }
        }
    }
`;

// Мутации для таблицы Bonuses
export const CREATE_BONUS = gql`
    mutation CreateBonus($bonus: Int, $userid: Int) {
        createBonus(input: { bonus: { bonus: $bonus, userid: $userid } }) {
            bonus {
                bonusid
                bonus
                userid
            }
        }
    }
`;

export const UPDATE_BONUS = gql`
    mutation UpdateBonus($bonusid: Int!, $bonus: Int, $userid: Int) {
        updateBonusById(input: { bonusPatch: { bonus: $bonus, userid: $userid }, bonusid: $bonusid }) {
            bonus {
                bonusid
                bonus
                userid
            }
        }
    }
`;

export const DELETE_BONUS = gql`
    mutation DeleteBonus($bonusid: Int!) {
        deleteBonusById(input: { bonusid: $bonusid }) {
            bonus {
                bonusid
            }
        }
    }
`;

// Мутации для таблицы Bouquets
export const CREATE_BOUQUET = gql`
    mutation CreateBouquet($bouquetname: String!, $category: Int!, $price: Float!, $image: String!, $description: String!, $amount: Int!, $sale: Int, $secondImage: String) {
        createBouquet(input: { bouquet: { bouquetname: $bouquetname, category: $category, price: $price, image: $image, description: $description, amount: $amount, sale: $sale, secondImage: $secondImage } }) {
            bouquet {
                bouquetid
                bouquetname
                category
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
    mutation UpdateBouquet($bouquetid: Int!, $bouquetname: String, $category: Int, $price: Float, $image: String, $description: String, $amount: Int, $sale: Int, $secondImage: String) {
        updateBouquetById(input: { bouquetPatch: { bouquetname: $bouquetname, category: $category, price: $price, image: $image, description: $description, amount: $amount, sale: $sale, secondImage: $secondImage }, bouquetid: $bouquetid }) {
            bouquet {
                bouquetid
                bouquetname
                category
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
    mutation DeleteBouquet($bouquetid: Int!) {
        deleteBouquetById(input: { bouquetid: $bouquetid }) {
            bouquet {
                bouquetid
            }
        }
    }
`;

// Мутации для таблицы Cart
export const CREATE_CART = gql`
    mutation CreateCart($userid: Int!, $bouquetid: Int!) {
        createCart(input: { cart: { userid: $userid, bouquetid: $bouquetid } }) {
            cart {
                cartid
                userid
                bouquetid
            }
        }
    }
`;

export const UPDATE_CART = gql`
    mutation UpdateCart($cartid: Int!, $userid: Int, $bouquetid: Int) {
        updateCartById(input: { cartPatch: { userid: $userid, bouquetid: $bouquetid }, cartid: $cartid }) {
            cart {
                cartid
                userid
                bouquetid
            }
        }
    }
`;

export const DELETE_CART = gql`
    mutation DeleteCart($cartid: Int!) {
        deleteCartById(input: { cartid: $cartid }) {
            cart {
                cartid
            }
        }
    }
`;

// Мутации для таблицы Category
export const CREATE_CATEGORY = gql`
    mutation CreateCategory($category: String!) {
        createCategory(input: { category: { category: $category } }) {
            category {
                categoryid
                category
            }
        }
    }
`;

export const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($categoryid: Int!, $category: String) {
        updateCategoryById(input: { categoryPatch: { category: $category }, categoryid: $categoryid }) {
            category {
                categoryid
                category
            }
        }
    }
`;

export const DELETE_CATEGORY = gql`
    mutation DeleteCategory($categoryid: Int!) {
        deleteCategoryById(input: { categoryid: $categoryid }) {
            category {
                categoryid
            }
        }
    }
`;

// Мутации для таблицы CreditInfo
export const CREATE_CREDIT_INFO = gql`
    mutation CreateCreditInfo($cardnumber: Int!, $cvv: Int!, $userid: Int!, $ownername: String!) {
        createCreditInfo(input: { creditInfo: { cardnumber: $cardnumber, cvv: $cvv, userid: $userid, ownername: $ownername } }) {
            creditInfo {
                creditid
                cardnumber
                cvv
                userid
                ownername
            }
        }
    }
`;

export const UPDATE_CREDIT_INFO = gql`
    mutation UpdateCreditInfo($creditid: Int!, $cardnumber: Int, $cvv: Int, $userid: Int, $ownername: String) {
        updateCreditInfoById(input: { creditInfoPatch: { cardnumber: $cardnumber, cvv: $cvv, userid: $userid, ownername: $ownername }, creditid: $creditid }) {
            creditInfo {
                creditid
                cardnumber
                cvv
                userid
                ownername
            }
        }
    }
`;

export const DELETE_CREDIT_INFO = gql`
    mutation DeleteCreditInfo($creditid: Int!) {
        deleteCreditInfoById(input: { creditid: $creditid }) {
            creditInfo {
                creditid
            }
        }
    }
`;

// Мутации для таблицы DeliveryManInfo
export const CREATE_DELIVERY_MAN_INFO = gql`
    mutation CreateDeliveryManInfo($userid: Int!, $ocpid: Int!) {
        createDeliveryManInfo(input: { deliveryManInfo: { userid: $userid, ocpid: $ocpid } }) {
            deliveryManInfo {
                diliverymanid
                userid
                ocpid
            }
        }
    }
`;

export const UPDATE_DELIVERY_MAN_INFO = gql`
    mutation UpdateDeliveryManInfo($diliverymanid: Int!, $userid: Int, $ocpid: Int) {
        updateDeliveryManInfoById(input: { deliveryManInfoPatch: { userid: $userid, ocpid: $ocpid }, diliverymanid: $diliverymanid }) {
            deliveryManInfo {
                diliverymanid
                userid
                ocpid
            }
        }
    }
`;

export const DELETE_DELIVERY_MAN_INFO = gql`
    mutation DeleteDeliveryManInfo($diliverymanid: Int!) {
        deleteDeliveryManInfoById(input: { diliverymanid: $diliverymanid }) {
            deliveryManInfo {
                diliverymanid
            }
        }
    }
`;

// Мутации для таблицы Feedback
export const CREATE_FEEDBACK = gql`
    mutation CreateFeedback($orderid: Int!, $userid: Int!, $text: String!, $score: Int!) {
        createFeedback(input: { feedback: { orderid: $orderid, userid: $userid, text: $text, score: $score } }) {
            feedback {
                feedbackid
                orderid
                userid
                text
                score
            }
        }
    }
`;

export const UPDATE_FEEDBACK = gql`
    mutation UpdateFeedback($feedbackid: Int!, $orderid: Int, $userid: Int, $text: String, $score: Int) {
        updateFeedbackById(input: { feedbackPatch: { orderid: $orderid, userid: $userid, text: $text, score: $score }, feedbackid: $feedbackid }) {
            feedback {
                feedbackid
                orderid
                userid
                text
                score
            }
        }
    }
`;

export const DELETE_FEEDBACK = gql`
    mutation DeleteFeedback($feedbackid: Int!) {
        deleteFeedbackById(input: { feedbackid: $feedbackid }) {
            feedback {
                feedbackid
            }
        }
    }
`;

// Мутации для таблицы FlowersInBouquets
export const CREATE_FLOWERS_IN_BOUQUETS = gql`
    mutation CreateFlowersInBouquets($flowerid: Int!, $amount: Int!, $bouquetid: Int!) {
        createFlowersInBouquets(input: { flowersInBouquets: { flowerid: $flowerid, amount: $amount, bouquetid: $bouquetid } }) {
            flowersInBouquets {
                fbid
                flowerid
                amount
                bouquetid
            }
        }
    }
`;

export const UPDATE_FLOWERS_IN_BOUQUETS = gql`
    mutation UpdateFlowersInBouquets($fbid: Int!, $flowerid: Int, $amount: Int, $bouquetid: Int) {
        updateFlowersInBouquetsById(input: { flowersInBouquetsPatch: { flowerid: $flowerid, amount: $amount, bouquetid: $bouquetid }, fbid: $fbid }) {
            flowersInBouquets {
                fbid
                flowerid
                amount
                bouquetid
            }
        }
    }
`;

export const DELETE_FLOWERS_IN_BOUQUETS = gql`
    mutation DeleteFlowersInBouquets($fbid: Int!) {
        deleteFlowersInBouquetsById(input: { fbid: $fbid }) {
            flowersInBouquets {
                fbid
            }
        }
    }
`;

// Мутации для таблицы OCP
export const CREATE_OCP = gql`
    mutation CreateOCP($address: String!) {
        createOcp(input: { ocp: { address: $address } }) {
            ocp {
                ocpid
                address
            }
        }
    }
`;

export const UPDATE_OCP = gql`
    mutation UpdateOCP($ocpid: Int!, $address: String) {
        updateOcpById(input: { ocpPatch: { address: $address }, ocpid: $ocpid }) {
            ocp {
                ocpid
                address
            }
        }
    }
`;

export const DELETE_OCP = gql`
    mutation DeleteOCP($ocpid: Int!) {
        deleteOcpById(input: { ocpid: $ocpid }) {
            ocp {
                ocpid
            }
        }
    }
`;

// Мутации для таблицы OCPItem
export const CREATE_OCP_ITEM = gql`
    mutation CreateOCPItem($itemid: Int!, $amount: Int!, $ocpid: Int!) {
        createOcpItem(input: { ocpItem: { itemid: $itemid, amount: $amount, ocpid: $ocpid } }) {
            ocpItem {
                ocpitemd
                itemid
                amount
                ocpid
            }
        }
    }
`;

export const UPDATE_OCP_ITEM = gql`
    mutation UpdateOCPItem($ocpitemd: Int!, $itemid: Int, $amount: Int, $ocpid: Int) {
        updateOcpItemById(input: { ocpItemPatch: { itemid: $itemid, amount: $amount, ocpid: $ocpid }, ocpitemd: $ocpitemd }) {
            ocpItem {
                ocpitemd
                itemid
                amount
                ocpid
            }
        }
    }
`;

export const DELETE_OCP_ITEM = gql`
    mutation DeleteOCPItem($ocpitemd: Int!) {
        deleteOcpItemById(input: { ocpitemd: $ocpitemd }) {
            ocpItem {
                ocpitemd
            }
        }
    }
`;

// Мутации для таблицы Orders
export const CREATE_ORDER = gql`
    mutation CreateOrder($userid: Int!, $bouquetid: Int!, $orderdate: String!, $price: Float!, $statusid: Int!, $customeraddress: String!, $delivery: Int!) {
        createOrder(input: { order: { userid: $userid, bouquetid: $bouquetid, orderdate: $orderdate, price: $price, statusid: $statusid, customeraddress: $customeraddress, delivery: $delivery } }) {
            order {
                orderid
                userid
                bouquetid
                orderdate
                price
                statusid
                customeraddress
                delivery
            }
        }
    }
`;

export const UPDATE_ORDER = gql`
    mutation UpdateOrder($orderid: Int!, $userid: Int, $bouquetid: Int, $orderdate: String, $price: Float, $statusid: Int, $customeraddress: String, $delivery: Int) {
        updateOrderById(input: { orderPatch: { userid: $userid, bouquetid: $bouquetid, orderdate: $orderdate, price: $price, statusid: $statusid, customeraddress: $customeraddress, delivery: $delivery }, orderid: $orderid }) {
            order {
                orderid
                userid
                bouquetid
                orderdate
                price
                statusid
                customeraddress
                delivery
            }
        }
    }
`;

export const DELETE_ORDER = gql`
    mutation DeleteOrder($orderid: Int!) {
        deleteOrderById(input: { orderid: $orderid }) {
            order {
                orderid
            }
        }
    }
`;

// Мутации для таблицы Role
export const CREATE_ROLE = gql`
    mutation CreateRole($role: String!) {
        createRole(input: { role: { role: $role } }) {
            role {
                roleid
                role
            }
        }
    }
`;

export const UPDATE_ROLE = gql`
    mutation UpdateRole($roleid: Int!, $role: String) {
        updateRoleById(input: { rolePatch: { role: $role }, roleid: $roleid }) {
            role {
                roleid
                role
            }
        }
    }
`;

export const DELETE_ROLE = gql`
    mutation DeleteRole($roleid: Int!) {
        deleteRoleById(input: { roleid: $roleid }) {
            role {
                roleid
            }
        }
    }
`;

// Мутации для таблицы Status
export const CREATE_STATUS = gql`
    mutation CreateStatus($status: String!) {
        createStatus(input: { status: { status: $status } }) {
            status {
                statusid
                status
            }
        }
    }
`;

export const UPDATE_STATUS = gql`
    mutation UpdateStatus($statusid: Int!, $status: String) {
        updateStatusById(input: { statusPatch: { status: $status }, statusid: $statusid }) {
            status {
                statusid
                status
            }
        }
    }
`;

export const DELETE_STATUS = gql`
    mutation DeleteStatus($statusid: Int!) {
        deleteStatusById(input: { statusid: $statusid }) {
            status {
                statusid
            }
        }
    }
`;

// Мутации для таблицы Type
export const CREATE_TYPE = gql`
    mutation CreateType($name: String!) {
        createType(input: { type: { name: $name } }) {
            type {
                typeid
                name
            }
        }
    }
`;

export const UPDATE_TYPE = gql`
    mutation UpdateType($typeid: Int!, $name: String) {
        updateTypeById(input: { typePatch: { name: $name }, typeid: $typeid }) {
            type {
                typeid
                name
            }
        }
    }
`;

export const DELETE_TYPE = gql`
    mutation DeleteType($typeid: Int!) {
        deleteTypeById(input: { typeid: $typeid }) {
            type {
                typeid
            }
        }
    }
`;

// Мутации для таблицы Users
export const CREATE_USER = gql`
    mutation CreateUser($username: String!, $passhash: String, $email: String, $phone: String, $role: Int!, $dateofbirth: String, $usersyrname: String!) {
        createUser(input: { user: { username: $username, passhash: $passhash, email: $email, phone: $phone, role: $role, dateofbirth: $dateofbirth, usersyrname: $usersyrname } }) {
            user {
                userid
                username
                passhash
                email
                phone
                role
                dateofbirth
                usersyrname
            }
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($userid: Int!, $username: String, $passhash: String, $email: String, $phone: String, $role: Int, $dateofbirth: String, $usersyrname: String) {
        updateUserById(input: { userPatch: { username: $username, passhash: $passhash, email: $email, phone: $phone, role: $role, dateofbirth: $dateofbirth, usersyrname: $usersyrname }, userid: $userid }) {
            user {
                userid
                username
                passhash
                email
                phone
                role
                dateofbirth
                usersyrname
            }
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($userid: Int!) {
        deleteUserById(input: { userid: $userid }) {
            user {
                userid
            }
        }
    }
`;

// Мутации для таблицы Wishlist
export const CREATE_WISHLIST = gql`
    mutation CreateWishlist($userid: Int!, $bouquetid: Int!) {
        createWishlist(input: { wishlist: { userid: $userid, bouquetid: $bouquetid } }) {
            wishlist {
                wishlistid
                userid
                bouquetid
            }
        }
    }
`;

export const UPDATE_WISHLIST = gql`
    mutation UpdateWishlist($wishlistid: Int!, $userid: Int, $bouquetid: Int) {
        updateWishlistById(input: { wishlistPatch: { userid: $userid, bouquetid: $bouquetid }, wishlistid: $wishlistid }) {
            wishlist {
                wishlistid
                userid
                bouquetid
            }
        }
    }
`;

export const DELETE_WISHLIST = gql`
    mutation DeleteWishlist($wishlistid: Int!) {
        deleteWishlistById(input: { wishlistid: $wishlistid }) {
            wishlist {
                wishlistid
            }
        }
    }
`;