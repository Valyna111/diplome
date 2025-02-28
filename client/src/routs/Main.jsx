import MainPage from '@/views/Main/Main'
import { Route, Routes } from 'react-router-dom';

const Main = () => (
    <Routes>
        <Route path="/" element={<MainPage />} />
    </Routes>
);
export default Main;