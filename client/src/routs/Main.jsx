import MainPage from '@/views/Main/Main'
import Flower from '@/views/Flower/Flower'
import { Route, Routes } from 'react-router-dom';

const Main = () => (
    <Routes>
        <Route index element={<MainPage />} />
        <Route path="/:id" element={<Flower />} />
    </Routes>
);
export default Main;