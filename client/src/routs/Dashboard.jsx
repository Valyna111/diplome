import {Route, Routes} from 'react-router-dom';

import React from "react";
import ArticleConstructor from '@/views/ArticleConstructor/ArticleConstructor';
import PromotionConstructor from '@/views/PromotionConstructor/PromotionConstructor';
import ClientsList from '@/views/ClientsList/List/ClientsList';
import ClientDetails from '@/views/ClientsList/Item/ClientDetails';
import SalesReport from '@/views/SalesReport/SalesReport';
import ManagerOrdersPage from '@/views/ManagerOrdersPage/ManagerOrdersPage';

const Dashboard = () => (
    <Routes>
          <Route path="/article-constructor" element={<ArticleConstructor />} />
          <Route path="/promotion-constructor" element={<PromotionConstructor/>} />
          <Route path="/orders" element={<ManagerOrdersPage/>} />
          <Route path="/clientlist" element={<ClientsList />} />
          <Route path="/clientlist/:id" element={<ClientDetails />} />
          <Route path="/sales" element={<SalesReport/>} />
    </Routes>
);
export default Dashboard;