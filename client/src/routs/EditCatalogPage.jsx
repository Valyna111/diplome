import EditCatalogPage from '@/views/EditCatalogPage/EditCatalogPage';
import { Route, Routes } from 'react-router-dom';

const EditCatalog = () => (
    <Routes>
        <Route path="/" element={<EditCatalogPage/>} />
    </Routes>
);
export default EditCatalog;