import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from "./screens/main";
import CatalogCategories from "./screens/catalog";

const App = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/catalog" element={<CatalogCategories/>} />
      </Routes>

    </Router>
  );
};

export default App;
