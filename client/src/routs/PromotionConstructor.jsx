


import PromotionConstructor from "@/views/PromotionConstructor/PromotionConstructor";
import { Route, Routes } from 'react-router-dom';

const Promotion = () => (
    <Routes>
        <Route path="/" element={<PromotionConstructor/>} />
    </Routes>
);
export default Promotion;