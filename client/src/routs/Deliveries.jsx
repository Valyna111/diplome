
import Deliveries from "@/views/Deliveries/Deliveries";
import { Route, Routes } from 'react-router-dom';

const Delivery = () => (
    <Routes>
        <Route path="/" element={<Deliveries/>} />
    </Routes>
);
export default Delivery;