import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import s from './App.module.css'

import Main from "@/routs/Main";
import Article from "@/routs/Article";

import CatalogCategories from "@/views/Catalog/CatalogCategories";
import Navbar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";



const App = () => {
  return (
    <div className={s.conteiner}>
      <Router>
        <Navbar/>
          <main className={s.main}>
            <Routes>
              <Route path="/main" element={<Main />} />
              <Route path="/catalog" element={<CatalogCategories/>} />
              <Route path="/article/*" element={<Article/>} />
              <Route path="*" element={<Navigate to="/main" replace={true} />} />
              
            </Routes>
          </main>
        <Footer/>
      </Router>
    </div>
  );
};

export default App;