import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import s from './App.module.css'
import RootStore from "@/store/RootStore";
import StoreContext from "@/store/StoreContext";

import Main from "@/routs/Main";
import Article from "@/routs/Article";
import UserProfile from "@/routs/UserProfile";

import CatalogCategories from "@/views/Catalog/CatalogCategories";

import Navbar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import AuthTestButtons from "@/views/Test/AuthTestButtons";

let rootStore;

const App = () => {
  if (!rootStore) rootStore = new RootStore();
  return (
    <StoreContext.Provider value={rootStore}>
        <div className={s.conteiner}>
          <Router>
            <Navbar/>
              <main className={s.main}>
                <Routes>
                  <Route path="/main/*" element={<Main />} />
                  <Route path="/catalog" element={<CatalogCategories/>} />
                  <Route path="/article/*" element={<Article/>} />
                  <Route path="/profile/*" element={<UserProfile/>} />
                  <Route path="/test" element={<AuthTestButtons/>} />
                  <Route path="*" element={<Navigate to="/main" replace={true} />} />
                </Routes>
              </main>
            <Footer/>
          </Router>
        </div>
    </StoreContext.Provider>
  );
};

export default App;