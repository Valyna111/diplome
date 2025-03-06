
import SalesReport from "@/views/SalesReport/SalesReport";
import { Route, Routes } from 'react-router-dom';

const Sales = () => (
    <Routes>
        <Route path="/" element={<SalesReport/>} />
    </Routes>
);
export default Sales;