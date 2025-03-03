import CreditCard from "@/views/CreditCard/CreditCadr";
import { Route, Routes } from 'react-router-dom';

const CreditPage = () => (
    <Routes>
        <Route path="/" element={<CreditCard/>} />
    </Routes>
);
export default CreditPage;