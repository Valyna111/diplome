import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientsList from "@/views/ClientsList/List/ClientsList";
import ClientDetails from "@/views/ClientsList/Item/ClientDetails";

function Client() {
    return (
   
            <Routes>
                <Route path="/" element={<ClientsList />} />
                <Route path="/client/:id" element={<ClientDetails />} />
            </Routes>
      
    );
}

export default Client;
