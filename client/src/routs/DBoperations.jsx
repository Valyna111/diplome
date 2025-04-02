import {Route, Routes} from 'react-router-dom';

import React from "react";
import EditCatalogPage from '@/views/EditCatalogPage/EditCatalogPage';
import ItemInput from '@/views/ItemInput/ItemInput';
import OCPInput from '@/views/OCPInput/OCPInput';
import UserComments from '@/views/UserComments/UserComments';


const DBoperations = () => (
    <Routes>
         <Route path="/edit-catalog" element={<EditCatalogPage/>} />
         <Route path="/item-input" element={<ItemInput/>} />
         <Route path="/ocp-input" element={<OCPInput/>} />
         <Route path="/user-block"  element={<UserComments />} />
    </Routes>
);
export default DBoperations;