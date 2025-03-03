import CartPage from "@/views/CartPage/CartPage";
import { Route, Routes } from 'react-router-dom';

const Cart = () => (
    <Routes>
        <Route path="/" element={<CartPage/>} />
    </Routes>
);
export default Cart;