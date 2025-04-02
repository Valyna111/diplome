
import {Route, Routes} from 'react-router-dom';

import UserProfile from "@/views/UserProfile/UserProfile";
import React from "react";
import FavoritesPage from '@/views/Favorite/Favorite';
import CreditCard from '@/views/CreditCard/CreditCadr';
import PurchaseHistory from '@/views/PurchaseHistory/PurchaseHistory';
import CartPage from '@/views/CartPage/CartPage';

const User = () => (
    <Routes>
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/loyalty-program" element={<Loyalty/>} />
        <Route path="/payment-card" element={<CreditCard/>} />
        <Route path="/order-history" element={<PurchaseHistory/>} />
        <Route path="/cart" element={<CartPage/>} />
    </Routes>
);
export default User;