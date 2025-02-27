import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from "./screens/main";
import CatalogCategories from "./screens/catalog";
import Articles from "./screens/articles";
import Article1 from "./screens/ArticlePage";


const App = () => {
  return (
    <Router>
    
        <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/catalog" element={<CatalogCategories/>} />
        <Route path="/articles" element ={<Articles/>} />
        <Route path="/article/1" element ={<Article1/>} />
        </Routes>

    </Router>
  );
};

export default App;
