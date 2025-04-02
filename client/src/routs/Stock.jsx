import EditStockPage from '@/views/EditStockPage/EditStockPage';
import FloristOrdersPage from '@/views/FloristOrdersPage/FloristOrdersPage';
import {Route, Routes} from 'react-router-dom';

const Stock = () => (
    <Routes>
        <Route path="/florist-orders" element={<FloristOrdersPage />} />
        <Route path="/florist-edit-stock" element={<EditStockPage/>} />
    </Routes>
);
export default Stock;