import MainPage from '@/views/Main/Main'
import {Route, Routes} from 'react-router-dom';
import CatalogCategories from "@/views/Catalog/CatalogCategories";
import Bouquet from "@/views/Bouquet/Bouquet";
import React from "react";

const Main = () => (
    <Routes>
        <Route index element={<MainPage/>}/>
        <Route path="/catalog" element={<CatalogCategories/>}/>
        <Route path="/catalog/:id" element={<Bouquet/>}/>
    </Routes>
);
export default Main;