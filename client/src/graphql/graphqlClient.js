const { request, gql } = require('graphql-request');

const endpoint = 'http://localhost:4000/graphql';

// Запросы для таблицы Item
const getItem = async (itemid) => {
    const query = gql`
        query GetItem($itemid: Int!) {
            itemById(itemid: $itemid) {
                itemid
                itemname
                typeid
                cost
            }
        }
    `;
    const variables = { itemid };
    return request(endpoint, query, variables);
};

const listItems = async () => {
    const query = gql`
        query ListItems {
            allItems {
                nodes {
                    itemid
                    itemname
                    typeid
                    cost
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createItem = async (itemname, typeid, cost) => {
    const mutation = gql`
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
    const variables = { itemname, typeid, cost };
    return request(endpoint, mutation, variables);
};

const updateItem = async (itemid, itemname, typeid, cost) => {
    const mutation = gql`
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
    const variables = { itemid, itemname, typeid, cost };
    return request(endpoint, mutation, variables);
};

const deleteItem = async (itemid) => {
    const mutation = gql`
        mutation DeleteItem($itemid: Int!) {
            deleteItemById(input: { itemid: $itemid }) {
                item {
                    itemid
                }
            }
        }
    `;
    const variables = { itemid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы Bonuses
const getBonus = async (bonusid) => {
    const query = gql`
        query GetBonus($bonusid: Int!) {
            bonusById(bonusid: $bonusid) {
                bonusid
                bonus
                userid
            }
        }
    `;
    const variables = { bonusid };
    return request(endpoint, query, variables);
};

const listBonuses = async () => {
    const query = gql`
        query ListBonuses {
            allBonuses {
                nodes {
                    bonusid
                    bonus
                    userid
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createBonus = async (bonus, userid) => {
    const mutation = gql`
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
    const variables = { bonus, userid };
    return request(endpoint, mutation, variables);
};

const updateBonus = async (bonusid, bonus, userid) => {
    const mutation = gql`
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
    const variables = { bonusid, bonus, userid };
    return request(endpoint, mutation, variables);
};

const deleteBonus = async (bonusid) => {
    const mutation = gql`
        mutation DeleteBonus($bonusid: Int!) {
            deleteBonusById(input: { bonusid: $bonusid }) {
                bonus {
                    bonusid
                }
            }
        }
    `;
    const variables = { bonusid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы Bouquets
const getBouquet = async (bouquetid) => {
    const query = gql`
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
            }
        }
    `;
    const variables = { bouquetid };
    return request(endpoint, query, variables);
};

const listBouquets = async () => {
    const query = gql`
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
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createBouquet = async (bouquetname, category, price, image, description, amount, sale, secondImage) => {
    const mutation = gql`
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
    const variables = { bouquetname, category, price, image, description, amount, sale, secondImage };
    return request(endpoint, mutation, variables);
};

const updateBouquet = async (bouquetid, bouquetname, category, price, image, description, amount, sale, secondImage) => {
    const mutation = gql`
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
    const variables = { bouquetid, bouquetname, category, price, image, description, amount, sale, secondImage };
    return request(endpoint, mutation, variables);
};

const deleteBouquet = async (bouquetid) => {
    const mutation = gql`
        mutation DeleteBouquet($bouquetid: Int!) {
            deleteBouquetById(input: { bouquetid: $bouquetid }) {
                bouquet {
                    bouquetid
                }
            }
        }
    `;
    const variables = { bouquetid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы Cart
const getCart = async (cartid) => {
    const query = gql`
        query GetCart($cartid: Int!) {
            cartById(cartid: $cartid) {
                cartid
                userid
                bouquetid
            }
        }
    `;
    const variables = { cartid };
    return request(endpoint, query, variables);
};

const listCarts = async () => {
    const query = gql`
        query ListCarts {
            allCarts {
                nodes {
                    cartid
                    userid
                    bouquetid
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createCart = async (userid, bouquetid) => {
    const mutation = gql`
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
    const variables = { userid, bouquetid };
    return request(endpoint, mutation, variables);
};

const updateCart = async (cartid, userid, bouquetid) => {
    const mutation = gql`
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
    const variables = { cartid, userid, bouquetid };
    return request(endpoint, mutation, variables);
};

const deleteCart = async (cartid) => {
    const mutation = gql`
        mutation DeleteCart($cartid: Int!) {
            deleteCartById(input: { cartid: $cartid }) {
                cart {
                    cartid
                }
            }
        }
    `;
    const variables = { cartid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы Category
const getCategory = async (categoryid) => {
    const query = gql`
        query GetCategory($categoryid: Int!) {
            categoryById(categoryid: $categoryid) {
                categoryid
                category
            }
        }
    `;
    const variables = { categoryid };
    return request(endpoint, query, variables);
};

const listCategories = async () => {
    const query = gql`
        query ListCategories {
            allCategories {
                nodes {
                    categoryid
                    category
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createCategory = async (category) => {
    const mutation = gql`
        mutation CreateCategory($category: String!) {
            createCategory(input: { category: { category: $category } }) {
                category {
                    categoryid
                    category
                }
            }
        }
    `;
    const variables = { category };
    return request(endpoint, mutation, variables);
};

const updateCategory = async (categoryid, category) => {
    const mutation = gql`
        mutation UpdateCategory($categoryid: Int!, $category: String) {
            updateCategoryById(input: { categoryPatch: { category: $category }, categoryid: $categoryid }) {
                category {
                    categoryid
                    category
                }
            }
        }
    `;
    const variables = { categoryid, category };
    return request(endpoint, mutation, variables);
};

const deleteCategory = async (categoryid) => {
    const mutation = gql`
        mutation DeleteCategory($categoryid: Int!) {
            deleteCategoryById(input: { categoryid: $categoryid }) {
                category {
                    categoryid
                }
            }
        }
    `;
    const variables = { categoryid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы CreditInfo
const getCreditInfo = async (creditid) => {
    const query = gql`
        query GetCreditInfo($creditid: Int!) {
            creditInfoById(creditid: $creditid) {
                creditid
                cardnumber
                cvv
                userid
                ownername
            }
        }
    `;
    const variables = { creditid };
    return request(endpoint, query, variables);
};

const listCreditInfos = async () => {
    const query = gql`
        query ListCreditInfos {
            allCreditInfos {
                nodes {
                    creditid
                    cardnumber
                    cvv
                    userid
                    ownername
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createCreditInfo = async (cardnumber, cvv, userid, ownername) => {
    const mutation = gql`
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
    const variables = { cardnumber, cvv, userid, ownername };
    return request(endpoint, mutation, variables);
};

const updateCreditInfo = async (creditid, cardnumber, cvv, userid, ownername) => {
    const mutation = gql`
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
    const variables = { creditid, cardnumber, cvv, userid, ownername };
    return request(endpoint, mutation, variables);
};

const deleteCreditInfo = async (creditid) => {
    const mutation = gql`
        mutation DeleteCreditInfo($creditid: Int!) {
            deleteCreditInfoById(input: { creditid: $creditid }) {
                creditInfo {
                    creditid
                }
            }
        }
    `;
    const variables = { creditid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы DeliveryManInfo
const getDeliveryManInfo = async (diliverymanid) => {
    const query = gql`
        query GetDeliveryManInfo($diliverymanid: Int!) {
            deliveryManInfoById(diliverymanid: $diliverymanid) {
                diliverymanid
                userid
                ocpid
            }
        }
    `;
    const variables = { diliverymanid };
    return request(endpoint, query, variables);
};

const listDeliveryManInfos = async () => {
    const query = gql`
        query ListDeliveryManInfos {
            allDeliveryManInfos {
                nodes {
                    diliverymanid
                    userid
                    ocpid
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createDeliveryManInfo = async (userid, ocpid) => {
    const mutation = gql`
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
    const variables = { userid, ocpid };
    return request(endpoint, mutation, variables);
};

const updateDeliveryManInfo = async (diliverymanid, userid, ocpid) => {
    const mutation = gql`
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
    const variables = { diliverymanid, userid, ocpid };
    return request(endpoint, mutation, variables);
};

const deleteDeliveryManInfo = async (diliverymanid) => {
    const mutation = gql`
        mutation DeleteDeliveryManInfo($diliverymanid: Int!) {
            deleteDeliveryManInfoById(input: { diliverymanid: $diliverymanid }) {
                deliveryManInfo {
                    diliverymanid
                }
            }
        }
    `;
    const variables = { diliverymanid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы Feedback
const getFeedback = async (feedbackid) => {
    const query = gql`
        query GetFeedback($feedbackid: Int!) {
            feedbackById(feedbackid: $feedbackid) {
                feedbackid
                orderid
                userid
                text
                score
            }
        }
    `;
    const variables = { feedbackid };
    return request(endpoint, query, variables);
};

const listFeedbacks = async () => {
    const query = gql`
        query ListFeedbacks {
            allFeedbacks {
                nodes {
                    feedbackid
                    orderid
                    userid
                    text
                    score
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createFeedback = async (orderid, userid, text, score) => {
    const mutation = gql`
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
    const variables = { orderid, userid, text, score };
    return request(endpoint, mutation, variables);
};

const updateFeedback = async (feedbackid, orderid, userid, text, score) => {
    const mutation = gql`
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
    const variables = { feedbackid, orderid, userid, text, score };
    return request(endpoint, mutation, variables);
};

const deleteFeedback = async (feedbackid) => {
    const mutation = gql`
        mutation DeleteFeedback($feedbackid: Int!) {
            deleteFeedbackById(input: { feedbackid: $feedbackid }) {
                feedback {
                    feedbackid
                }
            }
        }
    `;
    const variables = { feedbackid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы FlowersInBouquets
const getFlowersInBouquets = async (fbid) => {
    const query = gql`
        query GetFlowersInBouquets($fbid: Int!) {
            flowersInBouquetsById(fbid: $fbid) {
                fbid
                flowerid
                amount
                bouquetid
            }
        }
    `;
    const variables = { fbid };
    return request(endpoint, query, variables);
};

const listFlowersInBouquets = async () => {
    const query = gql`
        query ListFlowersInBouquets {
            allFlowersInBouquets {
                nodes {
                    fbid
                    flowerid
                    amount
                    bouquetid
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createFlowersInBouquets = async (flowerid, amount, bouquetid) => {
    const mutation = gql`
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
    const variables = { flowerid, amount, bouquetid };
    return request(endpoint, mutation, variables);
};

const updateFlowersInBouquets = async (fbid, flowerid, amount, bouquetid) => {
    const mutation = gql`
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
    const variables = { fbid, flowerid, amount, bouquetid };
    return request(endpoint, mutation, variables);
};

const deleteFlowersInBouquets = async (fbid) => {
    const mutation = gql`
        mutation DeleteFlowersInBouquets($fbid: Int!) {
            deleteFlowersInBouquetsById(input: { fbid: $fbid }) {
                flowersInBouquets {
                    fbid
                }
            }
        }
    `;
    const variables = { fbid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы OCP
const getOCP = async (ocpid) => {
    const query = gql`
        query GetOCP($ocpid: Int!) {
            ocpById(ocpid: $ocpid) {
                ocpid
                address
            }
        }
    `;
    const variables = { ocpid };
    return request(endpoint, query, variables);
};

const listOCPs = async () => {
    const query = gql`
        query ListOCPs {
            allOcps {
                nodes {
                    ocpid
                    address
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createOCP = async (address) => {
    const mutation = gql`
        mutation CreateOCP($address: String!) {
            createOcp(input: { ocp: { address: $address } }) {
                ocp {
                    ocpid
                    address
                }
            }
        }
    `;
    const variables = { address };
    return request(endpoint, mutation, variables);
};

const updateOCP = async (ocpid, address) => {
    const mutation = gql`
        mutation UpdateOCP($ocpid: Int!, $address: String) {
            updateOcpById(input: { ocpPatch: { address: $address }, ocpid: $ocpid }) {
                ocp {
                    ocpid
                    address
                }
            }
        }
    `;
    const variables = { ocpid, address };
    return request(endpoint, mutation, variables);
};

const deleteOCP = async (ocpid) => {
    const mutation = gql`
        mutation DeleteOCP($ocpid: Int!) {
            deleteOcpById(input: { ocpid: $ocpid }) {
                ocp {
                    ocpid
                }
            }
        }
    `;
    const variables = { ocpid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы OCPItem
const getOCPItem = async (ocpitemd) => {
    const query = gql`
        query GetOCPItem($ocpitemd: Int!) {
            ocpItemById(ocpitemd: $ocpitemd) {
                ocpitemd
                itemid
                amount
                ocpid
            }
        }
    `;
    const variables = { ocpitemd };
    return request(endpoint, query, variables);
};

const listOCPItems = async () => {
    const query = gql`
        query ListOCPItems {
            allOcpItems {
                nodes {
                    ocpitemd
                    itemid
                    amount
                    ocpid
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createOCPItem = async (itemid, amount, ocpid) => {
    const mutation = gql`
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
    const variables = { itemid, amount, ocpid };
    return request(endpoint, mutation, variables);
};

const updateOCPItem = async (ocpitemd, itemid, amount, ocpid) => {
    const mutation = gql`
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
    const variables = { ocpitemd, itemid, amount, ocpid };
    return request(endpoint, mutation, variables);
};

const deleteOCPItem = async (ocpitemd) => {
    const mutation = gql`
        mutation DeleteOCPItem($ocpitemd: Int!) {
            deleteOcpItemById(input: { ocpitemd: $ocpitemd }) {
                ocpItem {
                    ocpitemd
                }
            }
        }
    `;
    const variables = { ocpitemd };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы Orders
const getOrder = async (orderid) => {
    const query = gql`
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
            }
        }
    `;
    const variables = { orderid };
    return request(endpoint, query, variables);
};

const listOrders = async () => {
    const query = gql`
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
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createOrder = async (userid, bouquetid, orderdate, price, statusid, customeraddress, delivery) => {
    const mutation = gql`
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
    const variables = { userid, bouquetid, orderdate, price, statusid, customeraddress, delivery };
    return request(endpoint, mutation, variables);
};

const updateOrder = async (orderid, userid, bouquetid, orderdate, price, statusid, customeraddress, delivery) => {
    const mutation = gql`
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
    const variables = { orderid, userid, bouquetid, orderdate, price, statusid, customeraddress, delivery };
    return request(endpoint, mutation, variables);
};

const deleteOrder = async (orderid) => {
    const mutation = gql`
        mutation DeleteOrder($orderid: Int!) {
            deleteOrderById(input: { orderid: $orderid }) {
                order {
                    orderid
                }
            }
        }
    `;
    const variables = { orderid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы Role
const getRole = async (roleid) => {
    const query = gql`
        query GetRole($roleid: Int!) {
            roleById(roleid: $roleid) {
                roleid
                role
            }
        }
    `;
    const variables = { roleid };
    return request(endpoint, query, variables);
};

const listRoles = async () => {
    const query = gql`
        query ListRoles {
            allRoles {
                nodes {
                    roleid
                    role
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createRole = async (role) => {
    const mutation = gql`
        mutation CreateRole($role: String!) {
            createRole(input: { role: { role: $role } }) {
                role {
                    roleid
                    role
                }
            }
        }
    `;
    const variables = { role };
    return request(endpoint, mutation, variables);
};

const updateRole = async (roleid, role) => {
    const mutation = gql`
        mutation UpdateRole($roleid: Int!, $role: String) {
            updateRoleById(input: { rolePatch: { role: $role }, roleid: $roleid }) {
                role {
                    roleid
                    role
                }
            }
        }
    `;
    const variables = { roleid, role };
    return request(endpoint, mutation, variables);
};

const deleteRole = async (roleid) => {
    const mutation = gql`
        mutation DeleteRole($roleid: Int!) {
            deleteRoleById(input: { roleid: $roleid }) {
                role {
                    roleid
                }
            }
        }
    `;
    const variables = { roleid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы Status
const getStatus = async (statusid) => {
    const query = gql`
        query GetStatus($statusid: Int!) {
            statusById(statusid: $statusid) {
                statusid
                status
            }
        }
    `;
    const variables = { statusid };
    return request(endpoint, query, variables);
};

const listStatuses = async () => {
    const query = gql`
        query ListStatuses {
            allStatuses {
                nodes {
                    statusid
                    status
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createStatus = async (status) => {
    const mutation = gql`
        mutation CreateStatus($status: String!) {
            createStatus(input: { status: { status: $status } }) {
                status {
                    statusid
                    status
                }
            }
        }
    `;
    const variables = { status };
    return request(endpoint, mutation, variables);
};

const updateStatus = async (statusid, status) => {
    const mutation = gql`
        mutation UpdateStatus($statusid: Int!, $status: String) {
            updateStatusById(input: { statusPatch: { status: $status }, statusid: $statusid }) {
                status {
                    statusid
                    status
                }
            }
        }
    `;
    const variables = { statusid, status };
    return request(endpoint, mutation, variables);
};

const deleteStatus = async (statusid) => {
    const mutation = gql`
        mutation DeleteStatus($statusid: Int!) {
            deleteStatusById(input: { statusid: $statusid }) {
                status {
                    statusid
                }
            }
        }
    `;
    const variables = { statusid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы Type
const getType = async (typeid) => {
    const query = gql`
        query GetType($typeid: Int!) {
            typeById(typeid: $typeid) {
                typeid
                name
            }
        }
    `;
    const variables = { typeid };
    return request(endpoint, query, variables);
};

const listTypes = async () => {
    const query = gql`
        query ListTypes {
            allTypes {
                nodes {
                    typeid
                    name
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createType = async (name) => {
    const mutation = gql`
        mutation CreateType($name: String!) {
            createType(input: { type: { name: $name } }) {
                type {
                    typeid
                    name
                }
            }
        }
    `;
    const variables = { name };
    return request(endpoint, mutation, variables);
};

const updateType = async (typeid, name) => {
    const mutation = gql`
        mutation UpdateType($typeid: Int!, $name: String) {
            updateTypeById(input: { typePatch: { name: $name }, typeid: $typeid }) {
                type {
                    typeid
                    name
                }
            }
        }
    `;
    const variables = { typeid, name };
    return request(endpoint, mutation, variables);
};

const deleteType = async (typeid) => {
    const mutation = gql`
        mutation DeleteType($typeid: Int!) {
            deleteTypeById(input: { typeid: $typeid }) {
                type {
                    typeid
                }
            }
        }
    `;
    const variables = { typeid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы Users
const getUser = async (userid) => {
    const query = gql`
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
            }
        }
    `;
    const variables = { userid };
    return request(endpoint, query, variables);
};

const listUsers = async () => {
    const query = gql`
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
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createUser = async (username, passhash, email, phone, role, dateofbirth, usersyrname) => {
    const mutation = gql`
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
    const variables = { username, passhash, email, phone, role, dateofbirth, usersyrname };
    return request(endpoint, mutation, variables);
};

const updateUser = async (userid, username, passhash, email, phone, role, dateofbirth, usersyrname) => {
    const mutation = gql`
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
    const variables = { userid, username, passhash, email, phone, role, dateofbirth, usersyrname };
    return request(endpoint, mutation, variables);
};

const deleteUser = async (userid) => {
    const mutation = gql`
        mutation DeleteUser($userid: Int!) {
            deleteUserById(input: { userid: $userid }) {
                user {
                    userid
                }
            }
        }
    `;
    const variables = { userid };
    return request(endpoint, mutation, variables);
};

// Запросы для таблицы Wishlist
const getWishlist = async (wishlistid) => {
    const query = gql`
        query GetWishlist($wishlistid: Int!) {
            wishlistById(wishlistid: $wishlistid) {
                wishlistid
                userid
                bouquetid
            }
        }
    `;
    const variables = { wishlistid };
    return request(endpoint, query, variables);
};

const listWishlists = async () => {
    const query = gql`
        query ListWishlists {
            allWishlists {
                nodes {
                    wishlistid
                    userid
                    bouquetid
                }
            }
        }
    `;
    return request(endpoint, query);
};

const createWishlist = async (userid, bouquetid) => {
    const mutation = gql`
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
    const variables = { userid, bouquetid };
    return request(endpoint, mutation, variables);
};

const updateWishlist = async (wishlistid, userid, bouquetid) => {
    const mutation = gql`
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
    const variables = { wishlistid, userid, bouquetid };
    return request(endpoint, mutation, variables);
};

const deleteWishlist = async (wishlistid) => {
    const mutation = gql`
        mutation DeleteWishlist($wishlistid: Int!) {
            deleteWishlistById(input: { wishlistid: $wishlistid }) {
                wishlist {
                    wishlistid
                }
            }
        }
    `;
    const variables = { wishlistid };
    return request(endpoint, mutation, variables);
};

module.exports = {
    getItem,
    listItems,
    createItem,
    updateItem,
    deleteItem,
    getBonus,
    listBonuses,
    createBonus,
    updateBonus,
    deleteBonus,
    getBouquet,
    listBouquets,
    createBouquet,
    updateBouquet,
    deleteBouquet,
    getCart,
    listCarts,
    createCart,
    updateCart,
    deleteCart,
    getCategory,
    listCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCreditInfo,
    listCreditInfos,
    createCreditInfo,
    updateCreditInfo,
    deleteCreditInfo,
    getDeliveryManInfo,
    listDeliveryManInfos,
    createDeliveryManInfo,
    updateDeliveryManInfo,
    deleteDeliveryManInfo,
    getFeedback,
    listFeedbacks,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    getFlowersInBouquets,
    listFlowersInBouquets,
    createFlowersInBouquets,
    updateFlowersInBouquets,
    deleteFlowersInBouquets,
    getOCP,
    listOCPs,
    createOCP,
    updateOCP,
    deleteOCP,
    getOCPItem,
    listOCPItems,
    createOCPItem,
    updateOCPItem,
    deleteOCPItem,
    getOrder,
    listOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getRole,
    listRoles,
    createRole,
    updateRole,
    deleteRole,
    getStatus,
    listStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    getType,
    listTypes,
    createType,
    updateType,
    deleteType,
    getUser,
    listUsers,
    createUser,
    updateUser,
    deleteUser,
    getWishlist,
    listWishlists,
    createWishlist,
    updateWishlist,
    deleteWishlist,
};