import {Route, Routes} from 'react-router-dom';

import React from "react";
import ItemInput from '@/views/ItemInput/ItemInput';
import OCPInput from '@/views/OCPInput/OCPInput';
import UserInput from "@/views/UserInput/UserInput";


const DBoperations = () => (
    <Routes>
        <Route path="/item" element={<ItemInput/>}/>
        <Route path="/ocp" element={<OCPInput/>}/>
        <Route path="/user" element={<UserInput/>}/>
    </Routes>
);
export default DBoperations;