DeliveryDriver

import DeliveryDriver from '@/views/DeliveryDriver/DeliveryDriver';
import { Route, Routes } from 'react-router-dom';

const DeliveryMan = () => (
    <Routes>
        <Route path="/" element={<DeliveryDriver/>} />
    </Routes>
);
export default DeliveryMan;