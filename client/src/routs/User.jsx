import {Route, Routes} from 'react-router-dom';

import UserProfile from "@/views/UserProfile/UserProfile";
import React from "react";
import FavoritesPage from '@/views/Favorite/Favorite';
import CartPage from '@/views/CartPage/CartPage';
import OrderConfirmation from "@/views/OrderConfirmation/OrderConfirmation";
import CheckoutPage from "@/views/CheckoutPage/CheckoutPage";
import OrderHistory from "@/views/OrderHistory/OrderHistory";

const User = () => (
    <Routes>
        <Route path="/profile" element={<UserProfile/>}/>
        <Route path="/favorites" element={<FavoritesPage/>}/>
        {/*<Route path="/loyalty-program" element={<Loyalty/>} />*/}
        {/*<Route path="/payment-card" element={<CreditCard/>}/>*/}
        <Route path="/order-history" element={<OrderHistory/>}/>
        <Route path="/cart" element={<CartPage/>}/>
        <Route path="/checkout" element={<CheckoutPage/>}/>
        <Route path="/order-confirmation" element={<OrderConfirmation/>}/>
    </Routes>
);
export default User;