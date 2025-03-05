import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArticleConstructor from "@/views/ArticleConstructor/ArticleConstructor";

const  ConstuctorArt = ()=> (
             <Routes>
                <Route path="/" element={<ArticleConstructor />} />
            </Routes>
);
      
export default ConstuctorArt;
