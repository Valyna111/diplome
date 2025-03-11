OCPInput

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OCPInput from "@/views/OCPInput/OCPInput";

const  OCP = ()=> (
             <Routes>
                <Route path="/" element={<OCPInput/>} />
            </Routes>
);
      
export default OCP;
