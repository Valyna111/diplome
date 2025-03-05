FloristOrdersPage
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FloristOrdersPage from "@/views/FloristOrdersPage/FloristOrdersPage";

const  FloristOrders = ()=> (
             <Routes>
                <Route path="/" element={<FloristOrdersPage />} />
            </Routes>
);
      
export default FloristOrders;
