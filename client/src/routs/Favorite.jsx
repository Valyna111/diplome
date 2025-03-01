import FavoritePage from '@/views/Favorite/Favorite'
import { Route, Routes } from 'react-router-dom';

const Favorite = () => (
    <Routes>
        <Route index element={<FavoritePage />} />
    </Routes>
);
export default Favorite;