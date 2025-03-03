import PurchaseHistory from "@/views/PurchaseHistory/PurchaseHistory"
import { Route, Routes } from 'react-router-dom';

const Purchase = () => (
    <Routes>
        <Route path="/" element={<PurchaseHistory/>} />
    </Routes>
);
export default Purchase;