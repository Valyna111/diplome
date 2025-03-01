import Loyalty from "@/views/LoyaltyPage/LoyaltyPage"
import { Route, Routes } from 'react-router-dom';

const LoyaltyPage = () => (
    <Routes>
        <Route path="/" element={<Loyalty/>} />
    </Routes>
);
export default LoyaltyPage;