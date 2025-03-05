

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PromotionDetail from "@/views/PromotionDetails/PromotionDetail";

const  PromotionPage = ()=> (
             <Routes>
                <Route path="/" element={<PromotionDetail />} />
            </Routes>
);
      
export default PromotionPage;
