import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import s from './App.module.css'
import RootStore from "@/store/RootStore";
import StoreContext from "@/store/StoreContext";

import Main from "@/routs/Main";
// import PromotionPage from "@/routs/PromotionDetail";
import Navbar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import AuthTestButtons from "@/views/Test/AuthTestButtons";
import AuthModal from "./views/Modals/Auth/AuthModal";
import Dashboard from "./routs/Dashboard";
import User from "./routs/User";
import DBoperations from "./routs/DBoperations";
import Stock from "./routs/Stock";
import Delivery from "./routs/Delivery";

let rootStore;

const App = () => {
    if (!rootStore) rootStore = new RootStore();
    return (

        <StoreContext.Provider value={rootStore}>
            <div className={s.conteiner}>
                <Router>
                    <AuthModal/>
                    <Navbar/>
                    <main className={s.main}>
                        <Routes>
                            <Route path="/main/*" element={<Main/>}/>
                            <Route path="/dashboard/*" element={<Dashboard/>}/>
                            <Route path="/user/*" element={<User/>}/>
                            <Route path="/dboperations/*" element={<DBoperations/>}/>
                            <Route path="/stock/*" element={<Stock/>}/>
                            <Route path="/delivery/*" element={<Delivery/>}/>
                            <Route path="/test" element={<AuthTestButtons/>}/>
                            {/*<Route path="/promotion-page" element={<PromotionPage/>}/>*/}
                            <Route path="*" element={<Navigate to="/main" replace={true}/>}/>
                        </Routes>
                    </main>
                    <Footer/>
                </Router>
            </div>
        </StoreContext.Provider>
    );
};

export default App;