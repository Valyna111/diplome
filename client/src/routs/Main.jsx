import MainPage from '@/views/Main/Main'
import {Route, Routes} from 'react-router-dom';
import CatalogCategories from "@/views/Catalog/CatalogCategories";
import Bouquet from "@/views/Bouquet/Bouquet";
import ArticleList from '@/views/Article/List/Articles';
import ArticleItem from '@/views/Article/Item/ArticlePage';

import React from "react";

const Main = () => (
    <Routes>
        <Route index element={<MainPage/>}/>
        <Route path="/catalog" element={<CatalogCategories/>}/>
        <Route path="/catalog/:id" element={<Bouquet/>}/>
        <Route path="/article" element={<ArticleList />} />
        <Route path='/article/:id' element={<ArticleItem />} />
    </Routes>
);
export default Main;