import {Route, Routes} from 'react-router-dom';
import React from "react";
import DeliveryDriver from '@/views/DeliveryDriver/DeliveryDriver';
import DeliveriesPage from '@/views/Deliveries/Deliveries';




const Delivery = () => (
    <Routes>
         <Route path="/driver/deliveries" element={<DeliveryDriver/>} />
         <Route path="/delivery" element={<DeliveriesPage/>} />
    </Routes>
);
export default Delivery;