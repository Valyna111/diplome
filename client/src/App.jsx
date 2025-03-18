import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import s from './App.module.css'
import RootStore from "@/store/RootStore";
import StoreContext from "@/store/StoreContext";

import Main from "@/routs/Main";
import Article from "@/routs/Article";
import UserProfile from "@/routs/UserProfile";
import Favorite from "@/routs/Favorite";
import LoyaltyPage from "@/routs/Loyalty";
import CreditPage from "@/routs/CreditCard"
import Purchase from "@/routs/PurchaseHistory"
import Cart from "@/routs/CartPage"
import Client from "@/routs/ClientsList"
import Order from "@/routs/OrderHistory";
import Sales from "@/routs/SalesReport";
import Delivery from "@/routs/Deliveries";
import ConstuctorArt from "@/routs/ArticleConstructor"
import Promotion from "@/routs/PromotionConstructor";
import PromotionPage from "@/routs/PromotionDetail";
import FloristOrders from "@/routs/FloristOrdersPage";
import EditStock from "@/routs/EditStockPage";
import EditCatalog from "@/routs/EditCatalogPage";
import OCP from "@/routs/OCPInput";
import DeliveryMan from "@/routs/DeliveryDriver";

import CatalogCategories from "@/views/Catalog/CatalogCategories";
import Navbar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import AuthTestButtons from "@/views/Test/AuthTestButtons";
import AuthModal from "./views/Modals/Auth/AuthModal";
import Item from "./routs/ItemInput";
import UserBlock from "./routs/UserComments";

let rootStore;

const App = () => {
  if (!rootStore) rootStore = new RootStore();
  return (

        <StoreContext.Provider value={rootStore}>
            <div className={s.conteiner}>
              <Router>
                <AuthModal />
                <Navbar/>
                  <main className={s.main}>
                    <Routes>
                      <Route path="/main/*" element={<Main />} />
                      <Route path="/catalog" element={<CatalogCategories/>} />
                      <Route path="/article/*" element={<Article/>} />
                      <Route path="/profile/*" element={<UserProfile/>} />
                      <Route path="/favorites" element={<Favorite/>} />
                      <Route path="/loyalty-program" element={<LoyaltyPage/>} />
                      <Route path="/payment-card" element={<CreditPage/>} />
                      <Route path="/order-history" element={<Purchase/>} />
                      <Route path="/cart" element={<Cart/>} />
                      <Route path="/test" element={<AuthTestButtons/>} />
                      <Route path="/clientlist/*" element={<Client/>} />
                      <Route path="/orders" element={<Order/>} />
                      <Route path="/sales" element={<Sales/>} />
                      <Route path="/delivery" element={<Delivery/>} />
                      <Route path="/article-constructor" element={<ConstuctorArt/>} />
                      <Route path="/promotion-constructor" element={<Promotion/>} />
                      <Route path="/promotion-page" element={<PromotionPage/>} />
                      <Route path="/florist-orders" element={<FloristOrders/>} />
                      <Route path="/florist-edit-stock" element={<EditStock/>} />
                      <Route path="/edit-catalog" element={<EditCatalog/>} />
                      <Route path="/item-input" element={<Item/>} />
                      <Route path="/ocp-input" element={<OCP/>} />
                      <Route path="/user-block" element={<UserBlock/>} />
                      <Route path="/driver/deliveries" element={<DeliveryMan />} />
                      <Route path="*" element={<Navigate to="/main" replace={true} />} />
                    </Routes>
                  </main>
                <Footer/>
              </Router>
            </div>
        </StoreContext.Provider>
  );
};

export default App;