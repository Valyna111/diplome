

import OrderHistory from "@/views/OrderHistory/OrderHistory";
import { Route, Routes } from 'react-router-dom';

const Order = () => (
    <Routes>
        <Route path="/" element={<OrderHistory/>} />
    </Routes>
);
export default Order;