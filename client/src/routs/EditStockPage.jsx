
import EditStockPage from "@/views/EditStockPage/EditStockPage";
import { Route, Routes } from 'react-router-dom';

const EditStock = () => (
    <Routes>
        <Route path="/" element={<EditStockPage/>} />
    </Routes>
);
export default EditStock;