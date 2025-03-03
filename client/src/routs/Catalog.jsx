import CatalogCategories from '@/views/Catalog/CatalogCategories';
import CatalogItem from '@/views/Catalog/CatalogCategories';

import { Route, Routes } from 'react-router-dom';

const Catalog = () => (
    <Routes>
        <Route index element={<CatalogCategories />} />
        <Route path=':id' element={<CatalogItem />} />
    </Routes>
);

export default Catalog;